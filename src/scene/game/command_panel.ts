import * as Phaser from "phaser";

import * as Constants from "../../constants";
import { mkFontStyle } from "../../util";
import { GameScene } from "../game";

export enum ActionKind {
  Stop = "stop",
  GoForward = "go forward",
  TurnLeft = "turn left",
  TurnRight = "turn right",
}

export class Command {
  actionKind: ActionKind;
  beat: Array<boolean>;
  isActive: boolean;
  number: integer;

  static readonly WIDTH: integer = Constants.SCREEN_WIDTH / 4;
  static readonly HEIGHT: integer = (Constants.SCREEN_HEIGHT * 3) / 32;
  static readonly MARGIN: integer = 2;

  static readonly BEAT_WIDTH: integer = 24;
  static readonly BEAT_HEIGHT: integer = 24;
  static readonly N_BEATS: integer = 8;

  private background: Phaser.GameObjects.Rectangle;
  private activateButton: Phaser.GameObjects.Ellipse;
  private actionText: Phaser.GameObjects.Text;
  private beatRects: Array<Phaser.GameObjects.Rectangle>;
  private scene: GameScene;

  constructor(scene: GameScene, number: integer) {
    this.scene = scene;
    this.actionKind = ActionKind.Stop;
    this.beat = new Array<boolean>(Command.N_BEATS);
    this.number = number;
    this.isActive = false;
    const baseColor = 3;
    this.background = scene.add.rectangle(
      Command.WIDTH / 2,
      Command.HEIGHT * number + Command.HEIGHT / 2,
      Command.WIDTH - 2 * Command.MARGIN,
      Command.HEIGHT - 2 * Command.MARGIN,
      Constants.COLORS[baseColor].toNumber()
    );
    this.background.setOrigin(0.5);

    this.activateButton = scene.add.ellipse(
      Command.WIDTH / 8,
      Command.HEIGHT * number + Command.HEIGHT / 4,
      28,
      22,
      Constants.INACTIVE_COLOR.toNumber()
    );
    this.activateButton.setOrigin(0.5);
    this.activateButton.setInteractive();
    this.activateButton.on("pointerdown", () => {
      if (!this.scene.operationPanel?.isVerifying)
        this.isActive = !this.isActive;
    });

    this.actionText = scene.add.text(
      this.activateButton.x + 24,
      Command.HEIGHT * number,
      this.actionKind,
      mkFontStyle(baseColor + 3, 24)
    );
    this.actionText.setOrigin(0);
    this.actionText.setInteractive();
    this.actionText.on("pointerdown", () => {
      if (this.scene.operationPanel?.isVerifying) return;
      switch (this.actionKind) {
        case ActionKind.Stop:
          this.actionKind = ActionKind.GoForward;
          break;
        case ActionKind.GoForward:
          this.actionKind = ActionKind.TurnLeft;
          break;
        case ActionKind.TurnLeft:
          this.actionKind = ActionKind.TurnRight;
          break;
        case ActionKind.TurnRight:
          this.actionKind = ActionKind.Stop;
          break;
      }
    });

    this.beatRects = new Array<Phaser.GameObjects.Rectangle>(Command.N_BEATS);
    for (let i = 0; i < 8; i++) {
      this.beatRects[i] = scene.add.rectangle(
        Command.WIDTH / 2 - Command.BEAT_WIDTH * 3.5 + i * Command.BEAT_WIDTH,
        Command.HEIGHT * number + Command.HEIGHT / 2 + Command.BEAT_HEIGHT / 2,
        Command.BEAT_WIDTH - 2,
        Command.BEAT_HEIGHT - 2,
        Constants.COLORS[baseColor + 3].toNumber()
      );
      this.beatRects[i].setOrigin(0.5);
      this.beatRects[i].setInteractive();
      this.beatRects[i].on("pointerdown", () => {
        if (!this.scene.operationPanel?.isVerifying) {
          this.beat[i] = !this.beat[i];
        }
      });
    }
  }

  update(): void {
    if (this.isActive) {
      this.activateButton.fillColor = Constants.ACTIVE_COLOR.toNumber();
    } else {
      this.activateButton.fillColor = Constants.INACTIVE_COLOR.toNumber();
    }
    let baseColor = 2;
    if (this.isActive) baseColor++;
    if (!this.scene.operationPanel?.isVerifying) baseColor++;
    this.background.fillColor = Constants.COLORS[baseColor].toNumber();

    this.actionText.text = this.actionKind;

    for (let i = 0; i < Command.N_BEATS; i++) {
      if (this.beat[i]) {
        this.beatRects[i].fillColor = Constants.COLORS[
          baseColor + 3
        ].toNumber();
      } else {
        this.beatRects[i].fillColor = Constants.COLORS[
          baseColor + 1
        ].toNumber();
      }
    }
  }
}

export class CommandPanel {
  static readonly PANEL_WIDTH: integer = Constants.SCREEN_WIDTH / 4;
  static readonly PANEL_HEIGHT: integer = (Constants.SCREEN_HEIGHT * 3) / 4;
  static readonly PANEL_MIN_X: integer = 0;
  static readonly PANEL_MIN_Y: integer = 0;

  private background: Phaser.GameObjects.Rectangle;
  private noteText: Phaser.GameObjects.Text;
  commands: Array<Command>;
  scene: GameScene;

  constructor(scene: GameScene, nCommands: integer) {
    this.background = scene.add.rectangle(
      CommandPanel.PANEL_MIN_X + CommandPanel.PANEL_WIDTH / 2,
      CommandPanel.PANEL_MIN_Y + CommandPanel.PANEL_HEIGHT / 2,
      CommandPanel.PANEL_WIDTH,
      CommandPanel.PANEL_HEIGHT,
      Constants.COLORS[1].toNumber()
    );
    this.background.setOrigin(0.5);

    this.commands = new Array<Command>();
    for (let i = 0; i < nCommands; i++) {
      this.commands.push(new Command(scene, i));
    }

    this.noteText = scene.add.text(
      CommandPanel.PANEL_WIDTH / 2,
      nCommands * Command.HEIGHT + Command.HEIGHT,
      "cannot change beats\nwhile verifying",
      mkFontStyle(7, 16)
    );
    this.noteText.setOrigin(0.5);
    this.noteText.visible = false;

    this.scene = scene;
  }

  update(): void {
    for (const command of this.commands) command.update();

    this.noteText.visible = this.scene.operationPanel?.isVerifying || false;
  }
}
