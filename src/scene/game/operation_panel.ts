import * as Phaser from "phaser";

import * as Constants from "../../constants";
import { GameScene } from "../game";
import { mkFontStyle } from "../../util";

enum Mode {
  Pause = "pause",
  Start = "start",
}

export class OperationPanel {
  private startButtton: Phaser.GameObjects.Rectangle;
  private startText: Phaser.GameObjects.Text;

  constructor(scene: GameScene, nCommand: integer) {
    this.startButtton = scene.add.rectangle(
      Constants.SCREEN_WIDTH / 2,
      Constants.SCREEN_HEIGHT - 25,
      100,
      50,
      Constants.COLORS[7].toNumber()
    );
    this.startButtton.setOrigin(0.5);

    this.startText = scene.add.text(
      Constants.SCREEN_WIDTH / 2,
      Constants.SCREEN_HEIGHT - 25,
      Mode.Pause,
      mkFontStyle(2, 32)
    );
    this.startText.setOrigin(0.5);
  }
  update() {
    // TODO
  }
}
