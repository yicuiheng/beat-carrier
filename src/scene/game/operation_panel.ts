import * as Phaser from "phaser";

type Rectangle = Phaser.GameObjects.Rectangle;
type Text = Phaser.GameObjects.Text;
type Line = Phaser.GameObjects.Line;

import * as Constants from "../../constants";
import { GameScene } from "../game";
import { mkFontStyle } from "../../util";
import { Command, ActionKind } from "./command_panel";
import { MainPanel } from "./main_panel";

export class OperationPanel {
  static readonly PANEL_MIN_X = 0;
  static readonly PANEL_MIN_Y = (Constants.SCREEN_HEIGHT * 3) / 4;
  static readonly BEAT_WIDTH = Constants.SCREEN_WIDTH / (4 * Command.N_BEATS);

  static readonly VERIFY_BUTTON_WIDTH: integer = 160;

  private background: Rectangle;

  private returnToTitleText: Text;
  private wallRect: Rectangle;
  private wallDescription: Text;
  private goalRect: Rectangle;
  private goalDescription: Text;

  private verifyButtton: Rectangle;
  private verifyText: Text;
  private timeline: Line;
  private beatRects: Array<Array<Rectangle>>;

  private startTime = Date.now();
  private prevTime = Date.now();

  isVerifying = false;
  scene: GameScene;

  constructor(scene: GameScene) {
    this.background = scene.add.rectangle(
      OperationPanel.PANEL_MIN_X,
      Constants.SCREEN_HEIGHT - 50,
      Constants.SCREEN_WIDTH,
      50,
      Constants.COLORS[2].toNumber()
    );
    this.background.setOrigin(0);

    this.returnToTitleText = scene.add.text(
      16,
      Constants.SCREEN_HEIGHT - 25,
      "Return",
      mkFontStyle(7, 24)
    );
    this.returnToTitleText.setInteractive();
    this.returnToTitleText.on("pointerdown", () => {
      this.scene.scene.start("title");
    });

    this.verifyButtton = scene.add.rectangle(
      Constants.SCREEN_WIDTH / 2,
      Constants.SCREEN_HEIGHT - 25,
      160,
      50,
      Constants.COLORS[7].toNumber()
    );
    this.verifyButtton.setOrigin(0.5);
    this.verifyButtton.setInteractive();
    this.verifyButtton.on("pointerdown", () => {
      this.isVerifying = !this.isVerifying;
      this.scene.mainPanel?.player.setInit();
      if (this.isVerifying) {
        this.startTime = Date.now();
        this.prevTime = Date.now();
      }
    });
    this.wallRect = scene.add.rectangle(
      Constants.SCREEN_WIDTH / 2 + 120,
      Constants.SCREEN_HEIGHT - 25,
      MainPanel.CHIP_WIDTH,
      MainPanel.CHIP_HEIGHT,
      Constants.COLORS[Constants.WALL_COLOR_ID].toNumber()
    );
    this.wallDescription = scene.add.text(
      Constants.SCREEN_WIDTH / 2 + 140,
      Constants.SCREEN_HEIGHT - 25,
      "=Wall",
      mkFontStyle(7, 24)
    );
    this.wallDescription.setOrigin(0, 0.5);
    this.goalRect = scene.add.rectangle(
      Constants.SCREEN_WIDTH / 2 + 240,
      Constants.SCREEN_HEIGHT - 25,
      MainPanel.CHIP_WIDTH,
      MainPanel.CHIP_HEIGHT,
      Constants.GOAL_COLOR.toNumber()
    );
    this.goalDescription = scene.add.text(
      Constants.SCREEN_WIDTH / 2 + 260,
      Constants.SCREEN_HEIGHT - 25,
      "=Goal",
      mkFontStyle(7, 24)
    );
    this.goalDescription.setOrigin(0, 0.5);

    this.verifyText = scene.add.text(
      Constants.SCREEN_WIDTH / 2,
      Constants.SCREEN_HEIGHT - 25,
      "Verify",
      mkFontStyle(2, 32)
    );
    this.verifyText.setOrigin(0.5);

    const beatSpaceHeight =
      Constants.SCREEN_HEIGHT -
      OperationPanel.PANEL_MIN_Y -
      this.verifyButtton.height;

    const commandPanel = scene.commandPanel;
    if (commandPanel == undefined) throw "unreachable!";
    const beatHeight = beatSpaceHeight / commandPanel.commands.length;
    this.beatRects = new Array<Array<Rectangle>>(commandPanel.commands.length);
    for (let cmdIdx = 0; cmdIdx < commandPanel.commands.length; cmdIdx++) {
      this.beatRects[cmdIdx] = new Array<Rectangle>(4 * Command.N_BEATS);
      for (let beatIdx = 0; beatIdx < 4 * Command.N_BEATS; beatIdx++) {
        this.beatRects[cmdIdx][beatIdx] = scene.add.rectangle(
          OperationPanel.BEAT_WIDTH * beatIdx + OperationPanel.BEAT_WIDTH / 2,
          OperationPanel.PANEL_MIN_Y + beatHeight * cmdIdx + beatHeight / 2,
          OperationPanel.BEAT_WIDTH - 1,
          beatHeight - 1,
          Constants.COLORS[7].toNumber()
        );
        this.beatRects[cmdIdx][beatIdx].setOrigin(0.5);
      }
    }

    this.timeline = scene.add.line(
      Constants.SCREEN_WIDTH / 2,
      OperationPanel.PANEL_MIN_Y + beatSpaceHeight,
      0,
      -beatSpaceHeight / 2,
      0,
      beatSpaceHeight / 2,
      Constants.COLORS[0].toNumber()
    );
    this.scene = scene;
  }

  update(): void {
    const commandPanel = this.scene.commandPanel;
    if (commandPanel === undefined) throw "unreachable!";
    for (let cmdIdx = 0; cmdIdx < commandPanel.commands.length; cmdIdx++) {
      const command = commandPanel.commands[cmdIdx];
      for (let beatIdx = 0; beatIdx < 4 * Command.N_BEATS; beatIdx++) {
        let colorId = command.beat[beatIdx % Command.N_BEATS] ? 7 : 5;
        if (!command.isActive) colorId--;
        this.beatRects[cmdIdx][beatIdx].fillColor = Constants.COLORS[
          colorId
        ].toNumber();
      }
    }

    if (this.isVerifying) {
      this.verifyText.text = "Stop";
    } else {
      this.verifyText.text = "Verify";
    }

    if (!this.isVerifying) return;

    const current = Date.now();
    const timeToPos = (t: integer) => {
      return ((((t - this.startTime) * 800) / 6000) | 0) % 800;
    };
    this.timeline.x = timeToPos(current);
    const prevX = timeToPos(this.prevTime);
    if (
      this.timeline.x % OperationPanel.BEAT_WIDTH <
      prevX % OperationPanel.BEAT_WIDTH
    ) {
      const beatIdx =
        ((this.timeline.x / OperationPanel.BEAT_WIDTH) | 0) % Command.N_BEATS;
      for (let cmdIdx = 0; cmdIdx < commandPanel.commands.length; cmdIdx++) {
        const command = commandPanel.commands[cmdIdx];
        if (!command.isActive || !command.beat[beatIdx]) continue;
        const mainPanel = this.scene.mainPanel;
        if (mainPanel === undefined) throw "unreachable!";
        switch (command.actionKind) {
          case ActionKind.Stop:
            break;
          case ActionKind.GoForward:
            mainPanel.player.goForward();
            break;
          case ActionKind.TurnLeft:
            mainPanel.player.turnLeft();
            break;
          case ActionKind.TurnRight:
            mainPanel.player.turnRight();
            break;
        }
        this.scene.beatSounds[cmdIdx].play();
      }
    }
    this.prevTime = current;
  }
}
