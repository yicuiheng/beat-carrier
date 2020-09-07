import * as Phaser from "phaser";

import * as Constants from "../constants";
import { GameScene } from "./game";
import * as Tutorial from "../stage/tutorial";
import { MainPanel } from "./game/main_panel";
import { Command, ActionKind } from "./game/command_panel";
import { OperationPanel } from "./game/operation_panel";

enum Phase {
  WhatGoalIs1,
  WhatGoalIs2,
  WhatGoalIs3,
  EnableCommand,
  MakeBeat,
  MakeAction,
  DoVerify,
  Verifying,
  TheEnd,
}

export class TutorialScene extends GameScene {
  private graphics?: Phaser.GameObjects.Graphics;
  private description?: Phaser.GameObjects.Text;
  private phase = Phase.WhatGoalIs1;
  private isPrevMouseDown = true;

  init(): void {
    super.init({
      map: Tutorial.MAP,
      dir: Tutorial.INIT_DIR,
    });
    this.phase = Phase.WhatGoalIs1;
    this.isPrevMouseDown = true;
  }
  create(): void {
    super.create();

    this.graphics = this.add.graphics();
    this.graphics.lineStyle(6, Constants.TUTORIAL_COLOR.toNumber());
    this.description = this.add.text(0, 0, "", {
      color: Constants.TUTORIAL_COLOR.toString(),
      fontSize: "32px",
      fontFamily: "Courier",
    });
    this.description.setAlign("center");
    this.description.setStroke(Constants.COLORS[0].toString(), 16);
    this.description.setOrigin(0.5);
  }

  update(): void {
    super.update();
    if (!this.graphics || !this.description) return;
    if (!this.mainPanel) return;

    switch (this.phase) {
      case Phase.WhatGoalIs1:
        this.graphics.visible = false;
        this.description.visible = true;
        this.description.text =
          "このゲームの目的は\nビートでプレイヤーを操作して\nゴールまでたどり着かせることです";
        this.description.x = Constants.SCREEN_WIDTH / 2;
        this.description.y = Constants.SCREEN_HEIGHT / 2;
        if (!this.isPrevMouseDown && this.input.activePointer.isDown) {
          this.phase = Phase.WhatGoalIs2;
        }
        break;
      case Phase.WhatGoalIs2:
        this.graphics.visible = true;
        this.graphics.strokeRect(
          this.mainPanel?.player.polygon.x - MainPanel.CHIP_WIDTH,
          this.mainPanel?.player.polygon.y - MainPanel.CHIP_HEIGHT,
          MainPanel.CHIP_WIDTH * 2,
          MainPanel.CHIP_HEIGHT * 2
        );
        this.description.text = "赤枠で囲まれた青白いセルがプレイヤーです";
        if (!this.isPrevMouseDown && this.input.activePointer.isDown) {
          this.phase = Phase.WhatGoalIs3;
        }
        break;
      case Phase.WhatGoalIs3:
        this.graphics.clear();
        this.graphics.lineStyle(6, Constants.TUTORIAL_COLOR.toNumber());
        this.graphics.strokeRect(
          this.mainPanel?.player.polygon.x + 13 * MainPanel.CHIP_HEIGHT,
          this.mainPanel?.player.polygon.y - MainPanel.CHIP_HEIGHT,
          MainPanel.CHIP_WIDTH * 2,
          MainPanel.CHIP_HEIGHT * 2
        );
        this.description.text = "赤枠で囲まれた水色のセルがゴールです";
        if (!this.isPrevMouseDown && this.input.activePointer.isDown) {
          this.phase = Phase.EnableCommand;
        }
        break;
      case Phase.EnableCommand:
        this.graphics.clear();
        this.graphics.lineStyle(6, Constants.TUTORIAL_COLOR.toNumber());
        this.graphics.strokeRect(12, 0, 30, 30);
        this.graphics.beginPath();
        this.graphics.moveTo(42, 30);
        this.graphics.lineTo(
          Constants.SCREEN_WIDTH / 2,
          Constants.SCREEN_HEIGHT / 2
        );
        this.graphics.closePath();
        this.graphics.strokePath();
        this.description.text =
          "ではプレイヤーを動かすためにビートを作りましょう！\nまずは赤枠の円をクリックして下さい";
        if (this.commandPanel?.commands[0].isActive) {
          this.phase = Phase.MakeBeat;
        }
        break;
      case Phase.MakeBeat:
        this.graphics.clear();
        this.graphics.lineStyle(6, Constants.TUTORIAL_COLOR.toNumber());
        this.graphics.strokeRect(
          0,
          Command.HEIGHT / 2,
          Command.WIDTH,
          Command.HEIGHT / 2
        );
        this.graphics.beginPath();
        this.graphics.moveTo(Command.WIDTH, Command.HEIGHT);
        this.graphics.lineTo(
          Constants.SCREEN_WIDTH / 2,
          Constants.SCREEN_HEIGHT / 2
        );
        this.graphics.closePath();
        this.graphics.strokePath();
        this.description.text =
          "赤枠内の四角を好きなようにクリックして下さい\nこれはドラムが鳴るタイミングを表します";
        if (this.commandPanel?.commands[0].beat.some((x) => x)) {
          this.phase = Phase.MakeAction;
        }
        break;
      case Phase.MakeAction:
        this.graphics.clear();
        this.graphics.lineStyle(6, Constants.TUTORIAL_COLOR.toNumber());
        this.graphics.strokeRect(32, 0, Command.WIDTH - 32, Command.HEIGHT / 2);
        this.graphics.beginPath();
        this.graphics.moveTo(Command.WIDTH, Command.HEIGHT / 2);
        this.graphics.lineTo(
          Constants.SCREEN_WIDTH / 2,
          Constants.SCREEN_HEIGHT / 2
        );
        this.graphics.closePath();
        this.graphics.strokePath();
        this.description.text =
          "赤枠部分をクリックして\nドラムが鳴ったときのアクションを決めましょう！\n取り敢えず今はgo forwardにしてください";
        if (this.commandPanel?.commands[0].actionKind == ActionKind.GoForward) {
          this.phase = Phase.DoVerify;
        }
        break;
      case Phase.DoVerify:
        this.graphics.clear();
        this.graphics.lineStyle(6, Constants.TUTORIAL_COLOR.toNumber());
        this.graphics.strokeRect(
          Constants.SCREEN_WIDTH / 2 - OperationPanel.VERIFY_BUTTON_WIDTH / 2,
          Constants.SCREEN_HEIGHT - 50,
          OperationPanel.VERIFY_BUTTON_WIDTH,
          50
        );
        this.graphics.beginPath();
        this.graphics.moveTo(
          Constants.SCREEN_WIDTH / 2,
          Constants.SCREEN_HEIGHT - 50
        );
        this.graphics.lineTo(
          Constants.SCREEN_WIDTH / 2,
          Constants.SCREEN_HEIGHT / 2
        );
        this.graphics.closePath();
        this.graphics.strokePath();
        this.description.text =
          "準備が整いました！\nVerifyをクリックして\nプレイヤーがどう動くのか確かめましょう！！";
        if (this.operationPanel?.isVerifying) {
          this.phase = Phase.Verifying;
        }
        break;
      case Phase.Verifying:
        this.graphics.clear();
        this.graphics.lineStyle(6, Constants.TUTORIAL_COLOR.toNumber());
        this.graphics.strokeRect(
          OperationPanel.PANEL_MIN_X,
          OperationPanel.PANEL_MIN_Y,
          Constants.SCREEN_WIDTH,
          Constants.SCREEN_HEIGHT / 4 - 50
        );
        this.graphics.beginPath();
        this.graphics.moveTo(
          Constants.SCREEN_WIDTH / 2,
          (Constants.SCREEN_HEIGHT * 3) / 4
        );
        this.graphics.lineTo(
          Constants.SCREEN_WIDTH / 2,
          Constants.SCREEN_HEIGHT / 2
        );
        this.graphics.closePath();
        this.graphics.strokePath();
        this.description.text =
          "この赤枠には\nあなたが作ったビート全体が表示されています";
        if (this.mainPanel?.player.isAlreadyGoal()) {
          this.phase = Phase.TheEnd;
        }
        break;
      case Phase.TheEnd:
        this.graphics.clear();
        this.description.text =
          "おめでとう！\nもうこのゲームを理解しましたね？\nドラム以外にもハイハットやスネアなども鳴らせます\n君が作ったビートでゴールまでたどり着け！！";
        this.description.y = Constants.SCREEN_HEIGHT / 4;
        break;
    }
    this.isPrevMouseDown = this.input.activePointer.isDown;
  }
}
