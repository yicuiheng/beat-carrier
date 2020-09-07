import * as Phaser from "phaser";

import * as Constants from "../constants";
import { mkFontStyle } from "../util";
import * as Stage1 from "../stage/stage1";
import * as Stage2 from "../stage/stage2";
import * as Stage3 from "../stage/stage3";
import * as Stage4 from "../stage/stage4";

const N_STAGES = 4;

export class TitleScene extends Phaser.Scene {
  private titleText?: Phaser.GameObjects.Text;
  private tutorialText?: Phaser.GameObjects.Text;
  private stageTexts = new Array<Phaser.GameObjects.Text>(N_STAGES);

  create(): void {
    this.cameras.main.setBackgroundColor(Constants.COLORS[7].toString());

    this.titleText = this.add.text(
      Constants.SCREEN_WIDTH / 2,
      (Constants.SCREEN_HEIGHT * 5) / 12,
      "- Beat Carrior -",
      mkFontStyle(0, 48)
    );
    this.titleText.setOrigin(0.5);

    this.tutorialText = this.add.text(
      Constants.SCREEN_WIDTH / 2,
      (Constants.SCREEN_HEIGHT * 5) / 8,
      "Tutorial",
      mkFontStyle(0, 24)
    );
    this.tutorialText.style.setStroke(Constants.COLORS[7].toString(), 12);
    this.tutorialText.setOrigin(0.5);
    this.tutorialText
      .setInteractive()
      .on("pointerdown", () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.scene.start("tutorial");
      })
      .on("pointerover", (_pointer: any) => {
        if (this.tutorialText === undefined) return;
        this.tutorialText.text = "> Tutorial";
        this.tutorialText.x = Constants.SCREEN_WIDTH / 2 + 12;
      })
      .on("pointerout", (_pointer: any) => {
        if (this.tutorialText === undefined) return;
        this.tutorialText.text = "Tutorial";
        this.tutorialText.x = Constants.SCREEN_WIDTH / 2;
      });
    const stageMaps = [Stage1.MAP, Stage2.MAP, Stage3.MAP, Stage4.MAP];
    const stageDir = [
      Stage1.INIT_DIR,
      Stage2.INIT_DIR,
      Stage3.INIT_DIR,
      Stage4.INIT_DIR,
    ];

    for (let stageIdx = 0; stageIdx < N_STAGES; stageIdx++) {
      let stageText = this.stageTexts[stageIdx];
      stageText = this.add.text(
        Constants.SCREEN_WIDTH / 2,
        (Constants.SCREEN_HEIGHT * 5) / 8 + stageIdx * 32 + 32,
        "Stage" + (stageIdx + 1).toString(),
        mkFontStyle(0, 24)
      );
      stageText.style.setStroke(Constants.COLORS[7].toString(), 12);
      stageText.setOrigin(0.5);
      stageText
        .setInteractive()
        .on("pointerdown", () => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          this.scene.start("game", {
            map: stageMaps[stageIdx],
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            dir: stageDir[stageIdx],
          });
        })
        .on("pointerover", (_pointer: any) => {
          stageText.text = "> " + stageText.text;
          stageText.x = Constants.SCREEN_WIDTH / 2 + 12;
        })
        .on("pointerout", (_pointer: any) => {
          stageText.text = "Stage" + (stageIdx + 1).toString();
          stageText.x = Constants.SCREEN_WIDTH / 2;
        });
    }
  }
}
