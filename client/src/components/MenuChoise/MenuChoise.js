import React from "react";
import MenuButton from "../MenuButton/MenuButton";

const MenuChoise = ({ onSelect }) => {
  return (
    <>
      <div className="choice-container">
        <MenuButton
          onSelect={() => onSelect(true)}
          type="primary"
          choice="new"
          label="Start New"
        />
        <MenuButton
          onSelect={() => onSelect(false)}
          type="secondary"
          choice="join"
          label="Join Game"
        />
      </div>
    </>
  );
};

export default MenuChoise;
