const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const createUniqueRoomID = require("./utils/createUniqueRoomID");
const Board = require("./utils/Board");

const router = require("./router");
const e = require("express");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

// Main rooms store
const rooms = [];
const roomsID = [];

let board = new Array(9).fill(null);
const winCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const checkWinner = (sign, board) => {
  const playerMoves = board.filter((el, i) => {
    return el === sign ? i : null;
  });

  if (
    winCombinations.some(
      (win) =>
        board[win[0]] === sign &&
        board[win[1]] === sign &&
        board[win[2]] === sign
    )
  )
    return true;
};

const checkDraw = (board) => {
  return board.every((cell) => cell !== null);
};
const moveOnBoard = (sign, i, board) => {
  board[i] = sign;
};
let currentTurn = "X";

const changeCurrentTurn = (sign) => {
  const nextSign = sign === "X" ? "O" : "X";
  currentTurn = nextSign;
};

const createNewRoomAndReturnUniqueID = () => {
  const roomID = createUniqueRoomID();
  while (roomsID.includes(roomID)) {
    roomID = createUniqueRoomID();
  }
  const room = {
    players: [],
    board: null,
  };
  roomsID.push(roomID);
  rooms.push(room);
  return roomID;
};

// new player joined the room
const addNewPlayerInRoom = (name, roomID, id, indexOfCurrentRoom) => {
  const player = {
    name,
    roomID,
    id,
  };
  rooms[indexOfCurrentRoom]["players"].push(player);
};

io.on("connect", (socket) => {
  socket.on("createNewGame", () => {
    // create new room with unique ID
    const roomID = createNewRoomAndReturnUniqueID();
    socket.emit("newGame", roomID);
  });

  socket.on("joinCreatedRoom", ({ room }) => {
    if (roomsID.filter((id) => id === room).length) {
      socket.emit("joinedCreatedRoomSuccessfuly");
    }
  });

  socket.on("newJoinToTheRoom", ({ roomID, name }) => {
    const indexOfCurrentRoom = roomsID.indexOf(roomID);
    socket.join(roomID);

    addNewPlayerInRoom(name, roomID, socket.id, indexOfCurrentRoom);

    const playersInTheRoom = rooms[indexOfCurrentRoom]["players"];
    if (playersInTheRoom.length === 2) {
      playersInTheRoom.forEach((player, i) => {
        rooms[indexOfCurrentRoom].board = board.slice();
        player.sign = i === 0 ? "X" : "O";
        io.to(player.id).emit("initSignAndId", {
          id: player.id,
          sign: player.sign,
        });
      });

      const players = playersInTheRoom.map((el) => [el.name, el.id]);
      io.to(roomID).emit("startTheGame", {
        turn: currentTurn,
        board: rooms[indexOfCurrentRoom].board,
        waiting: false,
        players,
      });
    }

    console.log(rooms, playersInTheRoom);
  });

  socket.on("playerMove", ({ i, sign, roomID }) => {
    const indexOfCurrentRoom = roomsID.indexOf(roomID);
    const board = rooms[indexOfCurrentRoom].board;
    changeCurrentTurn(sign);
    moveOnBoard(sign, i, board);
    let signWinner = false;
    if (checkWinner(sign, board)) {
      io.to(roomID).emit("win", { board, id: socket.id });
    } else if (checkDraw(board)) {
      io.to(roomID).emit("draw", { board });
    } else {
      io.to(roomID).emit("updateBoard", { board, currentTurn, signWinner });
    }
  });

  socket.on("restart", ({ sign, roomID, currentScore, enemyScore }) => {
    const indexOfCurrentRoom = roomsID.indexOf(roomID);
    rooms[indexOfCurrentRoom].board = new Array(9).fill(null);
    const board = rooms[indexOfCurrentRoom].board;

    changeCurrentTurn(sign);
    io.to(roomID).emit("restartGame", {
      board,
      currentTurn,
      currentScore,
      enemyScore,
    });
  });

  socket.on("disconnect", () => {});
});

server.listen(process.env.PORT || 5000, () =>
  console.log(`Server has started.`)
);
