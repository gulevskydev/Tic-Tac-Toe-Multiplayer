import React from "react";

const MenuButton = ({ type, choice, label, onSelect }) => {
  return (
    <div className={`btn btn-${type}`} onClick={onSelect}>
      {label}
    </div>
  );
};

export default MenuButton;
