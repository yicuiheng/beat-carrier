import * as Phaser from "phaser";

import { MainPanel } from "./game/main_panel";
import { CommandPanel } from "./game/command_panel";
import { OperationPanel } from "./game/operation_panel";

export class GameScene extends Phaser.Scene {
  private mainPanel?: MainPanel;
  private commandPanel?: CommandPanel;
  private operationPanel?: OperationPanel;
  private map: Array<string> = [];

  drumSound?: Phaser.Sound.BaseSound;
  hatSound?: Phaser.Sound.BaseSound;
  snareSound?: Phaser.Sound.BaseSound;
  symbalSound?: Phaser.Sound.BaseSound;
  beatSounds = new Array<Phaser.Sound.BaseSound>(4);

  init(map: Array<string>): void {
    this.map = map;
  }

  preload(): void {
    this.load.audio("drum", "./sounds/drum.wav");
    this.load.audio("hat", "./sounds/hat.wav");
    this.load.audio("snare", "./sounds/snare.wav");
    this.load.audio("symbal", "./sounds/symbal.wav");
  }

  create(): void {
    const nCommand = 4;
    this.mainPanel = new MainPanel(this, this.map);
    this.commandPanel = new CommandPanel(this, nCommand);
    this.operationPanel = new OperationPanel(
      this,
      this.commandPanel,
      this.mainPanel
    );
    this.drumSound = this.sound.add("drum");
    this.beatSounds[0] = this.drumSound;
    this.hatSound = this.sound.add("hat");
    this.beatSounds[1] = this.hatSound;
    this.snareSound = this.sound.add("snare");
    this.beatSounds[2] = this.snareSound;
    this.symbalSound = this.sound.add("symbal");
    this.beatSounds[3] = this.symbalSound;
  }

  update(): void {
    this.commandPanel?.update();
    this.operationPanel?.update();
    this.mainPanel?.update();
  }
}
