import * as Phaser from "phaser";
import * as Constants from "./constants";

export const mkFontStyle = (
  col: number,
  size: number
): Phaser.Types.GameObjects.Text.TextStyle => {
  return {
    color: Constants.COLORS[col].toString(),
    fontSize: `${size}px`,
    fontFamily: "Courier",
  };
};
