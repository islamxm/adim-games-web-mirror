import * as Phaser from "phaser";

import { SCENES, type Question } from "../config";
import { GameUtils } from "@/core/lib/gameUtils";
import { BaseScene } from "@/core/lib/baseScene";
import type Label from "phaser3-rex-plugins/templates/ui/label/Label";
import type Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";

const SCORE_BASE = 5;

export class GameScene extends BaseScene {
  private gameDuration = 60;
  private score = 0;
  private scoreMultiplier = 1;
  private comboCount = 0;
  private currentQuestion: Question | null = null;
  private currentQuestionIndex = 0;
  private startCountdown = 3;
  private questions: Question[] = [];

  private leftText!: Phaser.GameObjects.Text;
  private rightText!: Phaser.GameObjects.Text;
  private leftPanel!: Label;
  private rightPanel!: Label;
  private boardsContainer!: Sizer;
  private currentResultIcon: Phaser.GameObjects.Image | null = null;
  private timerEvent!: Phaser.Time.TimerEvent;

  constructor() {
    super({ sceneKey: SCENES.GAME });
  }

  init() {
    this.questions = this.registry.get("questions");
    this.score = 0;
    this.scoreMultiplier = 1;
    this.comboCount = 0;
    this.currentQuestionIndex = 0;
    this.gameDuration = 60;
  }

  create() {
    this.currentQuestion = this.questions[this.currentQuestionIndex];

    this.game.events.on("answer", this.handleAnswer, this);
    this.scene.stop(SCENES.HUD);
    super.createCountdown(this.startCountdown, () => {
      this.createGame();
      this._startTime();
      this.scene.launch(SCENES.HUD);
    });

    this.events.once("shutdown", () => {
      this.game.events.off("answer", this.handleAnswer, this);
    });
  }

  private handleAnswer(value: string) {
    if (!this.currentQuestion) return;

    if (value === this.currentQuestion.correct) {
      this.correct();
    } else {
      this.wrong();
    }

    this._nextQuestion();
  }

  createGame() {
    const mainContainer = this.rexUI.add.sizer({
      x: this.utils.gameWidth / 2,
      y: this.utils.gameHeight / 2,
      height: this.utils.gameHeight,
      width: this.utils.gameWidth,
      orientation: "y",
      space: {
        item: this.utils._px(24),
      },
    });
    const title = this.utils.createText("Haýsy tarap uly bolsa saýlaň", {
      style: { fontSize: `${this.utils._px(18)}px` },
    });
    this.boardsContainer = this.rexUI.add.sizer({
      orientation: "x",
      space: { item: this.utils._px(16) },
    });

    this.leftText = this.utils
      .createText(this.currentQuestion?.leftStatement || "", {
        style: {
          color: "#000000",
          fontSize: `${this.utils._px(24)}px`,
          fontStyle: "600",
        },
      })
      .setDepth(1);
    this.rightText = this.utils
      .createText(this.currentQuestion?.rightStatement || "", {
        style: {
          color: "#000000",
          fontSize: `${this.utils._px(24)}px`,
          fontStyle: "600",
        },
      })
      .setDepth(1);

    this.leftPanel = this.rexUI.add.label({
      width: this.utils._px(152),
      height: this.utils._px(100),
      background: this.rexUI.add.roundRectangle(
        0,
        0,
        2,
        2,
        this.utils._px(24),
        0xffffff,
      ),
      text: this.leftText,
      align: "center",
    });

    this.rightPanel = this.rexUI.add.label({
      width: this.utils._px(152),
      height: this.utils._px(100),
      background: this.rexUI.add.roundRectangle(
        0,
        0,
        2,
        2,
        this.utils._px(24),
        0xffffff,
      ),
      text: this.rightText,
      align: "center",
    });

    this.boardsContainer.addSpace();
    this.boardsContainer.add(this.leftPanel);
    this.boardsContainer.add(this.rightPanel);
    this.boardsContainer.addSpace();

    mainContainer.addSpace();
    mainContainer.add(title, { align: "center" });
    mainContainer.add(this.boardsContainer, { align: "center" });
    mainContainer.addSpace();
    mainContainer.layout();

    this.utils.animateAlpha(title);
    this.utils.animateFadeLeft(this.leftPanel);
    this.utils.animateFadeRight(this.rightPanel);
  }

  correct() {
    this.showResultIcon("right-icon");
    this.sound.play("correct-sound");

    this.comboCount++;
    this.score = this.score + SCORE_BASE * this.scoreMultiplier;

    if (this.comboCount > 4) {
      this.scoreMultiplier++;
      this.comboCount = 0;
    }

    this.game.events.emit("update-score", this.score);
    this.game.events.emit("update-combo-multiplier", this.scoreMultiplier);
    this.game.events.emit("update-combo-count", this.comboCount);
  }

  wrong() {
    this.showResultIcon("wrong-icon");

    // Останавливаем старые тряски и возвращаем камеру в 0, чтобы не было накопления смещения
    this.tweens.killTweensOf(this.cameras.main);
    this.cameras.main.scrollX = 0;

    this.tweens.add({
      targets: this.cameras.main,
      scrollX: 5,
      duration: 50,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        this.cameras.main.scrollX = 0;
      },
    });
    this.sound.play("wrong-sound");

    this.comboCount = 0;
    if (this.scoreMultiplier > 1) {
      this.scoreMultiplier--;
    }

    this.game.events.emit("update-score", this.score);
    this.game.events.emit("update-combo-multiplier", this.scoreMultiplier);
    this.game.events.emit("update-combo-count", this.comboCount);
  }

  showResultIcon(iconKey: string) {
    if (this.currentResultIcon) {
      this.tweens.killTweensOf(this.currentResultIcon);
      this.currentResultIcon.destroy();
    }

    const icon = this.add
      .image(0, 0, iconKey)
      .setDisplaySize(this.utils._px(50), this.utils._px(50));

    this.boardsContainer.pin(icon);
    const { x, y } = this.utils._getGlobalPosition(this.boardsContainer);

    icon.setPosition(x, y);
    this.currentResultIcon = icon;

    const targetScale = icon.scaleX;

    this.tweens.add({
      targets: icon,
      scale: { from: 0, to: targetScale },
      duration: 300,
      ease: "Back.out",
      onComplete: () => {
        this.time.delayedCall(600, () => {
          if (!icon.scene) return;
          this.tweens.add({
            targets: icon,
            alpha: 0,
            scale: targetScale * 0.5,
            duration: 300,
            ease: "Cubic.In",
            onComplete: () => {
              if (this.currentResultIcon === icon) {
                this.currentResultIcon = null;
              }
              icon.destroy();
            },
          });
        });
      },
    });
  }

  // createCountdown(onComplete: () => void) {
  //   let count = this.startCountdown;
  //   const panelSize = this.utils._px(100);

  //   const countText = this.utils
  //     .createText(count.toString(), {
  //       style: {
  //         fontSize: `${this.utils._px(48)}px`,
  //         fontStyle: "600",
  //         color: "#000000",
  //       },
  //     })
  //     .setOrigin(0.5)
  //     .setDepth(1);

  //   const panel = this.rexUI.add.label({
  //     width: panelSize,
  //     height: panelSize,
  //     background: this.rexUI.add.roundRectangle(
  //       0,
  //       0,
  //       2,
  //       2,
  //       panelSize / 2,
  //       0xffffff,
  //     ),
  //     align: "center",
  //     text: countText,
  //   });

  //   const container = this.rexUI.add.sizer({
  //     width: this.utils.gameWidth,
  //     height: this.utils.gameHeight,
  //     x: this.utils.gameWidth / 2,
  //     y: this.utils.gameHeight / 2,
  //   });

  //   container.addSpace();
  //   container.add(panel, { align: "center" });
  //   container.addSpace();
  //   container.layout();

  //   panel.setAlpha(0);
  //   this.tweens.add({
  //     targets: panel,
  //     alpha: 1,
  //     duration: 200,
  //     ease: "Back.out",
  //   });

  //   const timer = this.time.addEvent({
  //     delay: 1000,
  //     repeat: count - 1,
  //     callback: () => {
  //       count--;
  //       if (count > 0) {
  //         countText.setText(count.toString());
  //         panel.layout();
  //         this.tweens.add({
  //           targets: countText,
  //           scale: { from: 0, to: 1 },
  //           duration: 200,
  //           ease: "Back.out",
  //         });
  //       } else {
  //         this.tweens.add({
  //           targets: panel,
  //           alpha: 0,
  //           duration: 200,
  //           ease: "Back.in",
  //           onComplete: () => {
  //             container.destroy();
  //             onComplete();
  //           },
  //         });
  //       }
  //     },
  //   });
  // }

  private _nextQuestion() {
    console.log(this.currentQuestionIndex);
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex >= this.questions.length) {
      this._endGame();
      return;
    }

    this.currentQuestion = this.questions[this.currentQuestionIndex];
    if (this.currentQuestion) {
      this.leftText.setText(this.currentQuestion.leftStatement);
      this.rightText.setText(this.currentQuestion.rightStatement);

      this.leftPanel.layout();
      this.rightPanel.layout();

      this.tweens.killTweensOf([this.leftText, this.rightText]);

      const leftTargetX = this.leftText.x;
      const rightTargetX = this.rightText.x;

      this.leftText.setAlpha(0);
      this.rightText.setAlpha(0);

      this.leftText.x = leftTargetX - 84;
      this.rightText.x = rightTargetX + 84;

      this.tweens.add({
        targets: this.leftText,
        x: leftTargetX,
        alpha: 1,
        duration: 300,
        ease: "Back.out",
      });

      this.tweens.add({
        targets: this.rightText,
        x: rightTargetX,
        alpha: 1,
        duration: 300,
        ease: "Back.out",
      });
    }
  }

  private _startTime() {
    if (this.timerEvent) this.timerEvent.destroy();

    this.game.events.emit("timer-update", super.formatTime(this.gameDuration));

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.gameDuration--;
        this.game.events.emit(
          "timer-update",
          super.formatTime(this.gameDuration),
        );
        if (this.gameDuration <= 5) {
          this.sound.play("tick-sound");
        }
        if (this.gameDuration <= 0) {
          this.timerEvent.destroy();
          this._endGame();
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  private _endGame() {
    if (this.timerEvent) {
      this.timerEvent.destroy();
    }

    this.scene.stop(SCENES.HUD);
    this.registry.set("score", this.score);
    this.utils.animatedSceneChange(SCENES.GAME_OVER);
  }
}
