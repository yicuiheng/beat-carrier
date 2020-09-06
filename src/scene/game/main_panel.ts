import * as Phaser from "phaser";

import * as Constants from "../../constants";
import { GameScene } from "../game";

export class MainPanel {
  static readonly PANEL_WIDTH: integer = (Constants.SCREEN_WIDTH * 3) / 4;
  static readonly PANEL_HEIGHT: integer = (Constants.SCREEN_HEIGHT * 3) / 4;
  static readonly PANEL_MIN_X: integer = Constants.SCREEN_WIDTH / 4;
  static readonly PANEL_MIN_Y: integer = 0;

  static readonly CHIP_WIDTH = 10;
  static readonly CHIP_HEIGHT = 10;

  static readonly WIDTH = 60;
  static readonly HEIGHT = 45;

  private background: Phaser.GameObjects.Rectangle;
  private map: Array<Array<Phaser.GameObjects.Rectangle>> = [];

  private playerX: integer = MainPanel.WIDTH / 2;
  private playerY: integer = 22;

  constructor(scene: GameScene) {
    this.background = scene.add.rectangle(
      MainPanel.PANEL_MIN_X + MainPanel.PANEL_WIDTH / 2,
      MainPanel.PANEL_MIN_Y + MainPanel.PANEL_HEIGHT / 2,
      MainPanel.PANEL_WIDTH,
      MainPanel.PANEL_HEIGHT,
      Constants.COLORS[7].toNumber()
    );
    this.background.setOrigin(0.5);
    this.map = new Array<Array<Phaser.GameObjects.Rectangle>>(MainPanel.HEIGHT);
    for (let y = 0; y < MainPanel.HEIGHT; y++) {
      this.map[y] = new Array<Phaser.GameObjects.Rectangle>(MainPanel.WIDTH);
      for (let x = 0; x < MainPanel.WIDTH; x++) {
        this.map[y][x] = scene.add.rectangle(
          MainPanel.PANEL_MIN_X +
            MainPanel.CHIP_WIDTH * x +
            MainPanel.CHIP_WIDTH / 2,
          MainPanel.PANEL_MIN_Y +
            MainPanel.CHIP_HEIGHT * y +
            MainPanel.CHIP_HEIGHT / 2,
          MainPanel.CHIP_WIDTH - 1,
          MainPanel.CHIP_HEIGHT - 1,
          Constants.COLORS[0].toNumber()
        );
        this.map[y][x].setOrigin(0.5);
        this.map[y][x].visible = true;
      }
    }
  }

  update(): void {
    if (this.map[this.playerY] && this.map[this.playerY][this.playerX]) {
      this.map[this.playerY][
        this.playerX
      ].fillColor = Constants.COLORS[7].toNumber();
    }
  }
}
