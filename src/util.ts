import * as Phaser from "phaser";
import * as Constants from "./constants";

export const clamp = (x: number, min: number, max: number): number => {
  if (x < min) return min;
  else if (x > max) return max;
  else return x;
};

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
