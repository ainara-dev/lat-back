import React from "react";

const DirectionBox = ({
  changeColor,
  imgSrc,
  title,
  directionName,
  isClicked,
}) => {
  let className = isClicked
    ? "directionContentBox directionContentBoxChanged"
    : "directionContentBox";
  return (
    <div className={className} onClick={() => changeColor(directionName)}>
      <img
        className="directionContentImgLeft"
        src={imgSrc}
        alt=""
        onClick={() => changeColor(directionName)}
      />
      <span className="directionContentText directionTextCenter">{title}</span>
    </div>
  );
};

export default DirectionBox;
