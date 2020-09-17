import React from "react";
import Input from "../Input/Input";
import MenuButton from "../MenuButton/MenuButton";

const InputForm = ({
  setIsSelectedMenu,
  onSubmit,
  onInput,
  onInputRoom,
  newGame,
  name,
  room,
}) => {
  if (newGame) {
    return (
      <div className="input-container">
        <div className="nav-container">
          <Input
            name="name"
            placeholder="Your Name..."
            onChange={onInput}
            value={name}
          />
          <MenuButton
            type="nav-forward"
            choice="submit"
            onSelect={onSubmit}
            label="Start"
          />
          <MenuButton
            type="nav-back"
            choice="back"
            onSelect={() => setIsSelectedMenu(false)}
            label="Back"
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className="input-container">
        <div className="nav-container">
          <Input
            name="name"
            placeholder="Your Name..."
            onChange={onInput}
            value={name}
          />
          <Input
            name="room"
            placeholder="Room ID..."
            onChange={onInputRoom}
            value={room}
          />

          <MenuButton
            type="nav-forward"
            choice="submit"
            onSelect={onSubmit}
            label="Let's Go"
          />
          <MenuButton
            type="nav-back"
            choice="back"
            onSelect={() => setIsSelectedMenu(false)}
            label="Back"
          />
        </div>
      </div>
    );
  }
};

export default InputForm;
