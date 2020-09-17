import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

// Components
import MenuChoise from "../MenuChoise/MenuChoise";
import InputForm from "../InputForm/InputForm";
import "./StartPage.scss";

// socket.io client
const io = require("socket.io-client");
const socket = io("http://localhost:5000");

export default function StartPage() {
  const [isSelectedMenu, setIsSelectedMenu] = useState(false);
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [newGame, setNewGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverLoaded, setServerLoaded] = useState(false);

  useEffect(() => {
    setLoading(false);

    socket.on("newGame", (room) => {
      // Set room ID
      setRoom(room);
      setServerLoaded(true);
    });

    socket.on("joinedCreatedRoomSuccessfuly", () => {
      setServerLoaded(true);
    });
    // when user disconected - close session
    return () => {
      socket.disconnect();
    };
  }, []);

  const validateInputName = () => {
    return newGame
      ? name.trim() !== ""
      : name.trim() !== "" && room.trim() !== "";
  };

  const handleSelect = (isNewGame) => {
    setIsSelectedMenu(true);
    isNewGame ? setNewGame(true) : setNewGame(false);
  };

  const handleInput = (e) => {
    setName(e.target.value);
  };
  const handleInputRoom = (e) => {
    setRoom(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateInputName()) {
      newGame
        ? socket.emit("createNewGame")
        : socket.emit("joinCreatedRoom", { room });
    }
  };

  // Render
  if (loading) {
    return <h1>Loading...</h1>;
  } else if (serverLoaded) {
    return <Redirect to={`/game?room=${room}&name=${name}`} />;
  } else if (isSelectedMenu) {
    return (
      <InputForm
        setIsSelectedMenu={setIsSelectedMenu}
        onSubmit={handleSubmit}
        onInput={handleInput}
        onInputRoom={handleInputRoom}
        newGame={newGame}
        name={name}
        room={room}
      />
    );
  } else {
    return (
      <div className="start-container">
        <MenuChoise onSelect={handleSelect} />
      </div>
    );
  }
}
