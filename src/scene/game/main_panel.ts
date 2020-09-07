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

  static readonly WIDTH = 30;
  static readonly HEIGHT = 30;

  polygon: Phaser.GameObjects.Polygon;
  private mainPanel: MainPanel;

  private initX: integer;
  private initY: integer;
  private initDir: Direction;

  constructor(
    scene: GameScene,
    mainPanel: MainPanel,
    x: integer,
    y: integer,
    dir = Direction.Right
  ) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.initX = x;
    this.initY = y;
    this.initDir = dir;

    const points = [
      [-Player.WIDTH / 2, -Player.HEIGHT / 2],
      [-Player.WIDTH / 2, Player.HEIGHT / 2],
      [Player.WIDTH / 2, Player.HEIGHT / 2],
      [Player.WIDTH, 0],
      [Player.WIDTH / 2, -Player.HEIGHT / 2],
    ];
    this.polygon = scene.add.polygon(
      Constants.SCREEN_WIDTH / 4 + x * MainPanel.CHIP_WIDTH + Player.WIDTH / 2,
      y * MainPanel.CHIP_HEIGHT + Player.HEIGHT / 2,
      points,
      Constants.COLORS[7].toNumber()
    );
    this.polygon.setOrigin(0);

    this.mainPanel = mainPanel;
  }

  setInit(): void {
    this.x = this.initX;
    this.y = this.initY;
    this.dir = this.initDir;
  }

  isAlreadyGoal(): boolean {
    return (
      this.mainPanel.map[this.y][this.x].fillColor ==
      Constants.GOAL_COLOR.toNumber()
    );
  }
  turnLeft(): void {
    if (this.isAlreadyGoal()) return;
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
    if (this.isAlreadyGoal()) return;
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
    if (this.isAlreadyGoal()) return;
    let targetX = this.x;
    let targetY = this.y;
    switch (this.dir) {
      case Direction.Up:
        targetY = clamp(this.y - 1, 0, MainPanel.HEIGHT - 1);
        break;
      case Direction.Right:
        targetX = clamp(this.x + 1, 0, MainPanel.WIDTH - 1);
        break;
      case Direction.Down:
        targetY = clamp(this.y + 1, 0, MainPanel.HEIGHT - 1);
        break;
      case Direction.Left:
        targetX = clamp(this.x - 1, 0, MainPanel.WIDTH - 1);
        break;
    }
    const targetColor = this.mainPanel.map[targetY][targetX].fillColor;
    if (
      targetColor === Constants.COLORS[0].toNumber() ||
      targetColor === Constants.GOAL_COLOR.toNumber()
    ) {
      this.x = targetX;
      this.y = targetY;
    }
  }

  update(): void {
    const targetX =
      Constants.SCREEN_WIDTH / 4 +
      this.x * MainPanel.CHIP_WIDTH +
      Player.WIDTH / 2;
    this.polygon.x = targetX * 0.1 + this.polygon.x * 0.9;
    const targetY = this.y * MainPanel.CHIP_HEIGHT + Player.HEIGHT / 2;
    this.polygon.y = targetY * 0.1 + this.polygon.y * 0.9;
    const calcNextAngle = (x: number, target: number): number => {
      if (target - x <= 180) {
        return x * 0.9 + target * 0.1;
      } else {
        return (x + 360) * 0.9 + target * 0.1;
      }
    };
    const targetAngle =
      this.dir == Direction.Right
        ? 0
        : this.dir == Direction.Down
        ? 90
        : this.dir == Direction.Left
        ? 180
        : this.dir == Direction.Up
        ? 270
        : 0; // unreachable
    this.polygon.angle = calcNextAngle(this.polygon.angle, targetAngle);
  }
}

export class MainPanel {
  static readonly PANEL_WIDTH: integer = (Constants.SCREEN_WIDTH * 3) / 4;
  static readonly PANEL_HEIGHT: integer = (Constants.SCREEN_HEIGHT * 3) / 4;
  static readonly PANEL_MIN_X: integer = Constants.SCREEN_WIDTH / 4;
  static readonly PANEL_MIN_Y: integer = 0;

  static readonly CHIP_WIDTH = Player.WIDTH;
  static readonly CHIP_HEIGHT = Player.HEIGHT;

  static readonly WIDTH = 20;
  static readonly HEIGHT = 15;

  private background: Phaser.GameObjects.Rectangle;

  map: Array<Array<Phaser.GameObjects.Rectangle>> = [];
  player: Player;
  scene: GameScene;

  constructor(scene: GameScene, map: Array<string>, dir: Direction) {
    this.background = scene.add.rectangle(
      MainPanel.PANEL_MIN_X + MainPanel.PANEL_WIDTH / 2,
      MainPanel.PANEL_MIN_Y + MainPanel.PANEL_HEIGHT / 2,
      MainPanel.PANEL_WIDTH,
      MainPanel.PANEL_HEIGHT,
      Constants.COLORS[7].toNumber()
    );
    this.background.setOrigin(0.5);
    this.map = new Array<Array<Phaser.GameObjects.Rectangle>>(MainPanel.HEIGHT);
    let playerX = -1;
    let playerY = -1;
    for (let y = 0; y < MainPanel.HEIGHT; y++) {
      this.map[y] = new Array<Phaser.GameObjects.Rectangle>(MainPanel.WIDTH);
      for (let x = 0; x < MainPanel.WIDTH; x++) {
        let color = Constants.COLORS[0].toNumber();
        if (map[y][x] === "#") {
          color = Constants.COLORS[Constants.WALL_COLOR_ID].toNumber();
        } else if (map[y][x] == "P") {
          playerX = x;
          playerY = y;
        } else if (map[y][x] == "G") {
          color = Constants.GOAL_COLOR.toNumber();
        }
        this.map[y][x] = scene.add.rectangle(
          MainPanel.PANEL_MIN_X +
            MainPanel.CHIP_WIDTH * x +
            MainPanel.CHIP_WIDTH / 2,
          MainPanel.PANEL_MIN_Y +
            MainPanel.CHIP_HEIGHT * y +
            MainPanel.CHIP_HEIGHT / 2,
          MainPanel.CHIP_WIDTH - 1,
          MainPanel.CHIP_HEIGHT - 1,
          color
        );
        this.map[y][x].visible = true;
      }
    }
    this.player = new Player(scene, this, playerX, playerY, dir);
    this.scene = scene;
  }

  update(): void {
    this.player.update();
  }
}
