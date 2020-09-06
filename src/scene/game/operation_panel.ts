import * as Phaser from "phaser";

type Rectangle = Phaser.GameObjects.Rectangle;
type Text = Phaser.GameObjects.Text;
type Line = Phaser.GameObjects.Line;

import * as Constants from "../../constants";
import { GameScene } from "../game";
import { mkFontStyle } from "../../util";
import { CommandPanel, Command } from "./command_panel";

enum Mode {
  Stop,
  Play,
}

export class OperationPanel {
  static readonly PANEL_MIN_X = 0;
  static readonly PANEL_MIN_Y = (Constants.SCREEN_HEIGHT * 3) / 4;
  static readonly BEAT_WIDTH = Constants.SCREEN_WIDTH / (4 * Command.N_BEATS);

  private startButtton: Rectangle;
  private startText: Text;
  private timeline: Line;
  private beatRects: Array<Array<Rectangle>>;

  private currentMode = Mode.Stop;
  private startTime = 0;
  private prevTime = 0;

  private commandPanel: CommandPanel;
  private scene: GameScene;

  constructor(scene: GameScene, commandPanel: CommandPanel) {
    this.startButtton = scene.add.rectangle(
      Constants.SCREEN_WIDTH / 2,
      Constants.SCREEN_HEIGHT - 25,
      100,
      50,
      Constants.COLORS[7].toNumber()
    );
    this.startButtton.setOrigin(0.5);
    this.startButtton.setInteractive();
    this.startButtton.on("pointerdown", () => {
      switch (this.currentMode) {
        case Mode.Stop: // push Start button
          this.currentMode = Mode.Play;
          this.startTime = Date.now();
          this.prevTime = Date.now();
          break;
        case Mode.Play: // push Stop button
          this.currentMode = Mode.Stop;
          break;
      }
    });

    this.startText = scene.add.text(
      Constants.SCREEN_WIDTH / 2,
      Constants.SCREEN_HEIGHT - 25,
      "Start",
      mkFontStyle(2, 32)
    );
    this.startText.setOrigin(0.5);

    const beatSpaceHeight =
      Constants.SCREEN_HEIGHT -
      OperationPanel.PANEL_MIN_Y -
      this.startButtton.height;

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
    this.timeline.visible = false;

    this.commandPanel = commandPanel;
    this.scene = scene;
  }

  update(): void {
    for (let cmdIdx = 0; cmdIdx < this.commandPanel.commands.length; cmdIdx++) {
      const command = this.commandPanel.commands[cmdIdx];
      for (let beatIdx = 0; beatIdx < 4 * Command.N_BEATS; beatIdx++) {
        let colorId = command.beat[beatIdx % Command.N_BEATS] ? 7 : 5;
        if (!command.isActive) colorId--;
        this.beatRects[cmdIdx][beatIdx].fillColor = Constants.COLORS[
          colorId
        ].toNumber();
      }
    }

    if (this.currentMode == Mode.Play) {
      this.timeline.visible = true;
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
        for (
          let cmdIdx = 0;
          cmdIdx < this.commandPanel.commands.length;
          cmdIdx++
        ) {
          const command = this.commandPanel.commands[cmdIdx];
          if (!command.isActive || !command.beat[beatIdx]) continue;
          this.scene.beatSounds[cmdIdx].play();
        }
      }
      this.prevTime = current;
    }

    switch (this.currentMode) {
      case Mode.Stop:
        this.startText.text = "Start";
        break;
      case Mode.Play:
        this.startText.text = "Stop";
        break;
    }
  }
}
