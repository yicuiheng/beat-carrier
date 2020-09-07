import * as Phaser from "phaser";

import * as Constants from "../constants";
import { MainPanel, Direction } from "./game/main_panel";
import { CommandPanel } from "./game/command_panel";
import { OperationPanel } from "./game/operation_panel";
import { mkFontStyle } from "../util";

export class GameScene extends Phaser.Scene {
  private map: Array<string> = [];
  private dir = Direction.Right;

  private drumSound?: Phaser.Sound.BaseSound;
  private hatSound?: Phaser.Sound.BaseSound;
  private snareSound?: Phaser.Sound.BaseSound;
  private symbalSound?: Phaser.Sound.BaseSound;

  private clearText?: Phaser.GameObjects.Text;

  mainPanel?: MainPanel;
  commandPanel?: CommandPanel;
  operationPanel?: OperationPanel;
  beatSounds = new Array<Phaser.Sound.BaseSound>(4);

  init(data: { map: Array<string>; dir: Direction }): void {
    this.map = data.map;
    this.dir = data.dir;
  }

  preload(): void {
    this.load.audio("drum", "./sounds/drum.wav");
    this.load.audio("hat", "./sounds/hat.wav");
    this.load.audio("snare", "./sounds/snare.wav");
    this.load.audio("symbal", "./sounds/symbal.wav");
  }

  create(): void {
    const nCommand = 4;
    this.mainPanel = new MainPanel(this, this.map, this.dir);
    this.commandPanel = new CommandPanel(this, nCommand);
    this.operationPanel = new OperationPanel(this);
    this.drumSound = this.sound.add("drum");
    this.beatSounds[0] = this.drumSound;
    this.hatSound = this.sound.add("hat");
    this.beatSounds[1] = this.hatSound;
    this.snareSound = this.sound.add("snare");
    this.beatSounds[2] = this.snareSound;
    this.symbalSound = this.sound.add("symbal");
    this.beatSounds[3] = this.symbalSound;

    this.clearText = this.add.text(
      Constants.SCREEN_WIDTH / 2,
      Constants.SCREEN_HEIGHT / 2,
      "Clear!!!",
      mkFontStyle(7, 128)
    );
    this.clearText.style.setStroke(Constants.COLORS[1].toString(), 12);
    this.clearText.setOrigin(0.5);
    this.clearText.setInteractive();
    this.clearText.on("pointerdown", () => {
      this.scene.start("title");
    });
    this.clearText.visible = false;
  }

  update(): void {
    this.commandPanel?.update();
    this.operationPanel?.update();
    this.mainPanel?.update();

    if (this.mainPanel?.player.isAlreadyGoal() && this.clearText) {
      this.clearText.visible = true;
    }
  }
}
