import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

import "./GamePage.scss";
import BoardRender from "../BoardRender/BoardRender";
import "./fontawesome/css/font-awesome.css";

import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";

// query string
import qs from "qs";
// socket.io client
const io = require("socket.io-client");
const socket = io("http://localhost:5000");

export default function GamePage() {
  // main state
  const [waiting, setWaiting] = useState(true);
  const [roomID, setRoomID] = useState("");
  const [name, setName] = useState("");
  const [errorJoin, setErrorJoin] = useState(false);
  const [playerID, setPlayerID] = useState("");
  const [sign, setSign] = useState("");
  const [board, setBoard] = useState([]);
  const [turn, setTurn] = useState(null);
  const [enemy, setEnemy] = useState([]);
  const [endGame, setEndGame] = useState(false);
  const [currentScore, setCurrentScore] = useState(null);
  const [enemyScore, setEnemytScore] = useState(null);
  const [draw, setDraw] = useState(false);
  useEffect(() => {
    //get current room and name
    const { room, name } = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });
    //handle error join
    if (!name || !room) {
      setErrorJoin(true);
    }
    setRoomID(room);
    setName(name);
    socket.on("initSignAndId", ({ id, sign }) => {
      setSign(sign);
      setPlayerID(id);
    });
  }, []);

  // when two players in the room start the game
  socket.on("startTheGame", ({ turn, board, waiting, players }) => {
    const isCurrentTurn = turn === sign;
    const enemyPlayer = players.filter((player) => !player.includes(playerID));
    setBoard(board);
    setTurn(isCurrentTurn);
    setWaiting(waiting);
    setEnemy(enemyPlayer);
  });

  useEffect(() => {
    if (roomID) {
      socket.emit("newJoinToTheRoom", { roomID, name });
    }
  }, [roomID]);

  useEffect(() => {
    socket.on("win", ({ board, id, signWinner }) => {
      function updateScore() {
        if (id === playerID) {
          console.log(playerID, id, currentScore);
          const updateScore = currentScore + 1;
          setCurrentScore(updateScore);
        } else {
          const updateScore = enemyScore + 1;
          setEnemytScore(updateScore);
        }
        setBoard(board);
        setEndGame(true);
      }
      if (playerID) {
        console.log("RENDER WIN");
        updateScore();
      }
    });
    if (playerID) {
      socket.on("draw", ({ board }) => {
        setBoard(board);
        setEndGame(true);
        setDraw(true);
      });
    }
    socket.on(
      "restartGame",
      ({ board, currentTurn, currentScore, enemyScore }) => {
        const isCurrentTurn = currentTurn === sign;
        setBoard(board);
        setEndGame(false);
        setTurn(isCurrentTurn);
        setDraw(false);
      }
    );
  }, [playerID, currentScore, enemyScore]);

  // update data from server
  socket.on("updateBoard", ({ board, currentTurn, signWinner }) => {
    const isCurrentTurn = currentTurn === sign;
    if (signWinner) {
      setEndGame(true);
      setTurn(false);
    } else {
      setTurn(isCurrentTurn);
    }
    setBoard(board);
  });

  const handleClick = (e, i) => {
    if (turn && !endGame && !board[i]) {
      console.log(endGame, board[i]);
      socket.emit("playerMove", { i, sign, roomID });
    } else if (board[i]) {
      NotificationManager.error("", "Ooophs!", 1000);
    } else {
      NotificationManager.error("", "Wait for the opponents move!", 1000);
    }
  };
  const handleRestart = (sign) => {
    if (sign) {
      socket.emit("restart", { sign, roomID, currentScore, enemyScore });
    }
  };

  const createUniqueRoomID = () =>
    Date.now().toString(36) + Math.random().toString(36).substr(2);

  // Render
  const classNameOfTheCell = (i, el) => {
    const notSelected =
      i === 0
        ? "cell bottom right"
        : i === 1
        ? "cell bottom"
        : i === 2
        ? "cell bottom left"
        : i === 3
        ? "cell bottom right"
        : i === 4
        ? "cell bottom"
        : i === 5
        ? "cell bottom left"
        : i === 6
        ? "cell right"
        : i === 7
        ? "cell right"
        : "cell";

    return `${notSelected} `;
  };

  const renderGameStage = () => {
    if (endGame) {
      return <h3 className="game-over">Game Over!</h3>;
    } else {
      return turn ? "Your turn" : "Wait for the opponent's move";
    }
  };

  if (errorJoin) {
    return <Redirect to={`/`} />;
  } else if (waiting) {
    return (
      <div className="waiting-container">
        <h3>Waiting another player...</h3>
        <h3>
          Please copy the ID and send it to your opponent so that he can connect
          to the game.
        </h3>
        <div class="id">{`${roomID}`}</div>
      </div>
    );
  } else {
    console.log(enemy);
    return (
      <div className="game-container">
        <div>
          <div className="board-сontainer">
            {endGame ? (
              <div className="restart" onClick={() => handleRestart(sign)}>
                Restart
              </div>
            ) : null}
            <div className="turn">{renderGameStage()}</div>
            {board.map((el, i) => {
              return (
                <div
                  key={createUniqueRoomID()}
                  className={classNameOfTheCell(i, el)}
                  onClick={(e) => handleClick(e, i)}>
                  <div className="span-container">
                    <span
                      className={
                        el === "X"
                          ? "fa fa-times"
                          : el === "O"
                          ? "fa fa-circle-o"
                          : ""
                      }
                      aria-hidden="true"></span>
                  </div>
                </div>
              );
            })}
            <div className="board-score">Score board</div>
            <div className="container-score">
              <div className="current-score">
                <h3 className="currentName"> You</h3>
                <span className="score-player">
                  {currentScore ? currentScore : 0}
                </span>
              </div>
              <div className="enemy-score">
                <h3 className="opponentName"> Opponent </h3>
                <span className="score-player">
                  {enemyScore ? enemyScore : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
        <NotificationContainer />
      </div>
    );
  }
}
