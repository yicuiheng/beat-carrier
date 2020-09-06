import * as Phaser from "phaser";

import { MainPanel } from "./game/main_panel";
import { CommandPanel } from "./game/command_panel";
import { OperationPanel } from "./game/operation_panel";

export class GameScene extends Phaser.Scene {
  private mainPanel?: MainPanel;
  private commandPanel?: CommandPanel;
  private operationPanel?: OperationPanel;

  drumSound?: Phaser.Sound.BaseSound;

  preload() {
    this.load.audio("drum", "./sounds/drum.wav");
  }

  create() {
    const nCommand = 2;
    this.mainPanel = new MainPanel(this);
    this.commandPanel = new CommandPanel(this, nCommand);
    this.operationPanel = new OperationPanel(this, nCommand);
    this.drumSound = this.sound.add("drum");
  }

  update() {
    this.commandPanel?.update();
    this.operationPanel?.update();
    this.mainPanel?.update();
  }
}
