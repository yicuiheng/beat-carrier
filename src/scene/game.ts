import * as Phaser from "phaser";

import { MainPanel } from "./game/main_panel";
import { CommandPanel } from "./game/command_panel";
import { OperationPanel } from "./game/operation_panel";

export class GameScene extends Phaser.Scene {
  private mainPanel?: MainPanel;
  private commandPanel?: CommandPanel;
  private operationPanel?: OperationPanel;

  drumSound?: Phaser.Sound.BaseSound;
  hatSound?: Phaser.Sound.BaseSound;
  snareSound?: Phaser.Sound.BaseSound;
  symbalSound?: Phaser.Sound.BaseSound;
  beatSounds = new Array<Phaser.Sound.BaseSound>(4);

  preload(): void {
    this.load.audio(
      "drum",
      "https://maoudamashii.jokersounds.com/music/se/wav/se_maoudamashii_instruments_drum2_bassdrum.wav"
    );
    this.load.audio(
      "hat",
      "https://maoudamashii.jokersounds.com/music/se/wav/se_maoudamashii_instruments_drum2_hat.wav"
    );
    this.load.audio(
      "snare",
      "https://maoudamashii.jokersounds.com/music/se/wav/se_maoudamashii_instruments_drum2_snare.wav"
    );
    this.load.audio(
      "symbal",
      "https://maoudamashii.jokersounds.com/music/se/wav/se_maoudamashii_instruments_drum2_cymbal.wav"
    );
  }

  create(): void {
    const nCommand = 4;
    this.mainPanel = new MainPanel(this);
    this.commandPanel = new CommandPanel(this, nCommand);
    this.operationPanel = new OperationPanel(this, this.commandPanel);
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
