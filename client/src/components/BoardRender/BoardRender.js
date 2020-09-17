import React from "react";

export default function BoardRender(props) {
  const beforeStyle = {
    background: "white",
    width: "93%",
    height: "13%",
    position: "absolute",
    transform: "rotate(45deg)",
  };
  const afterStyle = {
    background: "white",
    width: "93%",
    height: "13%",
    position: "absolute",
    transform: "rotate(-45deg)",
  };

  const beforeStyle2 = {
    background: "white",
    width: "90%",
    height: "90%",
    position: "absolute",
    borderRadius: "50%",
    // transform: 'rotate(45deg)'
  };
  const afterStyle2 = {
    background: "var(--dark-blue)",
    width: "70%",
    height: "70%",
    position: "absolute",
    borderRadius: "50%",
    // transform: 'rotate(45deg)'
  };
  const X = () => {
    return (
      <>
        <div className="before" style={beforeStyle}></div>
        <div className="after" style={afterStyle}></div>
      </>
    );
  };

  const O = () => {
    return (
      <>
        <div className="before" style={beforeStyle2}></div>
        <div className="after" style={afterStyle2}></div>
      </>
    );
  };
  const renderCell = () => {
    switch (props.value) {
      case "X":
        return <X />;
      case "O":
        return <O />;
      default:
        if (props.end || !props.turn) {
          return <div></div>;
        } else {
          switch (props.player) {
            case "X":
              return (
                <div className="placeHolder">
                  <X />
                </div>
              );
            case "O":
              return (
                <div className="placeHolder">
                  <O />
                </div>
              );
            default:
              return <div></div>;
          }
        }
    }
  };
  return (
    <div className="square" onClick={props.onClick}>
      {renderCell()}
    </div>
  );
}
