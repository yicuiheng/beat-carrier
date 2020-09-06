import * as Phaser from "phaser";

import * as Constants from "../constants";
import { mkFontStyle } from "../util";

export class TitleScene extends Phaser.Scene {
  private titleText?: Phaser.GameObjects.Text;
  private startText?: Phaser.GameObjects.Text;

  create(): void {
    this.cameras.main.setBackgroundColor(Constants.COLORS[7].toString());

    this.titleText = this.add.text(
      Constants.SCREEN_WIDTH / 2,
      (Constants.SCREEN_HEIGHT * 5) / 12,
      "- Beat Carrior -",
      mkFontStyle(0, 48)
    );
    this.titleText.setOrigin(0.5);

    this.startText = this.add.text(
      Constants.SCREEN_WIDTH / 2,
      (Constants.SCREEN_HEIGHT * 5) / 8,
      "Click HERE to Start",
      mkFontStyle(0, 24)
    );
    this.startText.setOrigin(0.5);
    this.startText.setInteractive();
    this.startText.on("pointerdown", () => {
      this.scene.start("game");
    });
  }
}
