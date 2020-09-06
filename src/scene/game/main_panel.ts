import * as Phaser from "phaser";

import * as Constants from "../../constants";
import { clamp } from "../../util";
import { GameScene } from "../game";

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}

export class Player {
  x: integer;
  y: integer;
  dir: Direction;

  static readonly WIDTH = 15;
  static readonly HEIGHT = 15;

  private rect: Phaser.GameObjects.Rectangle;
  private triangle: Phaser.GameObjects.Triangle;

  constructor(scene: GameScene, x: integer, y: integer, dir = Direction.Right) {
    this.x = x;
    this.y = y;
    this.dir = dir;

    this.rect = scene.add.rectangle(
      Constants.SCREEN_WIDTH / 4 + x * MainPanel.CHIP_WIDTH + Player.WIDTH / 2,
      y * MainPanel.CHIP_HEIGHT + Player.HEIGHT / 2,
      Player.WIDTH,
      Player.HEIGHT,
      Constants.COLORS[7].toNumber()
    );
    this.rect.setOrigin(0.5);

    this.triangle = scene.add.triangle();
    this.triangle.isFilled = true;
    this.triangle.fillColor = Constants.COLORS[7].toNumber();
  }

  turnLeft(): void {
    switch (this.dir) {
      case Direction.Up:
        this.dir = Direction.Left;
        break;
      case Direction.Left:
        this.dir = Direction.Down;
        break;
      case Direction.Down:
        this.dir = Direction.Right;
        break;
      case Direction.Right:
        this.dir = Direction.Up;
        break;
    }
  }

  turnRight(): void {
    switch (this.dir) {
      case Direction.Up:
        this.dir = Direction.Right;
        break;
      case Direction.Right:
        this.dir = Direction.Down;
        break;
      case Direction.Down:
        this.dir = Direction.Left;
        break;
      case Direction.Left:
        this.dir = Direction.Up;
        break;
    }
  }

  goForward(): void {
    switch (this.dir) {
      case Direction.Up:
        this.y = clamp(this.y - 1, 0, MainPanel.HEIGHT);
        break;
      case Direction.Right:
        this.x = clamp(this.x + 1, 0, MainPanel.WIDTH);
        break;
      case Direction.Down:
        this.y = clamp(this.y + 1, 0, MainPanel.HEIGHT);
        break;
      case Direction.Left:
        this.x = clamp(this.x - 1, 0, MainPanel.WIDTH);
        break;
    }
  }

  update(): void {
    this.rect.x =
      Constants.SCREEN_WIDTH / 4 +
      this.x * MainPanel.CHIP_WIDTH +
      Player.WIDTH / 2;
    this.rect.y = this.y * MainPanel.CHIP_HEIGHT + Player.HEIGHT / 2;

    this.triangle.x = this.rect.x + 71 - Player.WIDTH / 2;
    this.triangle.y = this.rect.y + 71 - Player.WIDTH / 2;
    switch (this.dir) {
      case Direction.Up:
        this.triangle.setTo(
          -Player.WIDTH / 2,
          -Player.HEIGHT / 2,
          Player.WIDTH / 2,
          -Player.HEIGHT / 2,
          0,
          -Player.HEIGHT
        );
        break;
      case Direction.Right:
        this.triangle.setTo(
          Player.WIDTH / 2,
          -Player.HEIGHT / 2,
          Player.WIDTH / 2,
          Player.HEIGHT / 2,
          Player.WIDTH,
          0
        );
        break;
      case Direction.Down:
        this.triangle.setTo(
          -Player.WIDTH / 2,
          Player.HEIGHT / 2,
          Player.WIDTH / 2,
          Player.HEIGHT / 2,
          0,
          Player.HEIGHT
        );
        break;
      case Direction.Left:
        this.triangle.setTo(
          -Player.WIDTH / 2,
          -Player.HEIGHT / 2,
          -Player.WIDTH / 2,
          Player.HEIGHT / 2,
          -Player.WIDTH,
          0
        );
        break;
    }
    console.log(this.triangle);
  }
}

export class MainPanel {
  static readonly PANEL_WIDTH: integer = (Constants.SCREEN_WIDTH * 3) / 4;
  static readonly PANEL_HEIGHT: integer = (Constants.SCREEN_HEIGHT * 3) / 4;
  static readonly PANEL_MIN_X: integer = Constants.SCREEN_WIDTH / 4;
  static readonly PANEL_MIN_Y: integer = 0;

  static readonly CHIP_WIDTH = Player.WIDTH;
  static readonly CHIP_HEIGHT = Player.HEIGHT;

  static readonly WIDTH = 40;
  static readonly HEIGHT = 30;

  private background: Phaser.GameObjects.Rectangle;
  private map: Array<Array<Phaser.GameObjects.Rectangle>> = [];

  player: Player;

  constructor(scene: GameScene, playerX: integer, playerY: integer) {
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
    this.player = new Player(scene, playerX, playerY);
  }

  update(): void {
    this.player.update();
  }
}
