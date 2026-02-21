import * as Phaser from "phaser";

import { SCENES, type Question } from "../config";
import { GameUtils } from "@/core/lib/gameUtils";
import { BaseScene } from "@/core/lib/baseScene";

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
  private leftPanel!: Phaser.GameObjects.Container;
  private rightPanel!: Phaser.GameObjects.Container;
  private boardsContainer!: Phaser.GameObjects.Container;
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
    this.createCountdown(() => {
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
    this.leftText = this.utils.createText(
      this.currentQuestion?.leftStatement || "",
      {
        style: {
          color: "#000000",
          fontSize: `${this.utils._px(24)}px`,
          fontStyle: "600",
        },
      },
    );
    this.rightText = this.utils.createText(
      this.currentQuestion?.rightStatement || "",
      {
        style: {
          color: "#000000",
          fontSize: `${this.utils._px(24)}px`,
          fontStyle: "600",
        },
      },
    );

    this.leftPanel = this.utils.createPanel(this.leftText, {
      width: this.utils._px(152),
      height: this.utils._px(100),
      borderRadius: this.utils._px(24),
    });
    this.rightPanel = this.utils.createPanel(this.rightText, {
      width: this.utils._px(152),
      height: this.utils._px(100),
      borderRadius: this.utils._px(24),
    });

    const title = this.utils.createText("Выберите большую сторону", {
      style: {
        fontSize: `${this.utils._px(18)}px`,
      },
    });

    this.boardsContainer = this.utils.createStack({
      gap: this.utils._px(16),
      items: [this.leftPanel, this.rightPanel],
    });

    this.utils.createStack({
      fillY: true,
      fillX: true,
      gap: this.utils._px(24),
      justify: "center",
      align: "center",
      direction: "column",
      items: [title, this.boardsContainer],
    });
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

    const icon = this.utils.createImage(iconKey, {
      width: this.utils._px(50),
      height: this.utils._px(50),
    });

    this.boardsContainer.add(icon);
    icon.setOrigin(0.5);
    icon.setPosition(
      this.boardsContainer.width / 2,
      this.boardsContainer.height / 2,
    );
    this.currentResultIcon = icon;

    this.tweens.add({
      targets: icon,
      scale: { from: 0, to: icon.scale },
      duration: 300,
      ease: "Back.out",
      onComplete: () => {
        this.time.delayedCall(600, () => {
          if (!icon.scene) return;
          this.tweens.add({
            targets: icon,
            alpha: 0,
            scale: 0.5,
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

  createCountdown(onComplete: () => void) {
    let count = this.startCountdown;
    const panelSize = this.utils._px(100);

    const countText = this.utils.createText(count.toString(), {
      style: {
        fontSize: `${this.utils._px(48)}px`,
        fontStyle: "600",
        color: "#000000",
      },
    });

    const panel = this.utils.createPanel(countText, {
      width: panelSize,
      height: panelSize,
      borderRadius: panelSize / 2,
      justify: "center",
      align: "center",
    });

    const container = this.utils.createStack({
      fillX: true,
      fillY: true,
      justify: "center",
      align: "center",
      items: [panel],
    });

    countText.setOrigin(0.5);
    countText.setPosition(panelSize / 2, panelSize / 2);
    panel.setAlpha(0);
    this.tweens.add({
      targets: panel,
      alpha: 1,
      duration: 200,
      ease: "Back.out",
    });

    const timer = this.time.addEvent({
      delay: 1000,
      repeat: count - 1,
      callback: () => {
        count--;
        if (count > 0) {
          countText.setText(count.toString());
          this.tweens.add({
            targets: countText,
            scale: { from: 0, to: 1 },
            duration: 200,
            ease: "Back.out",
          });
        } else {
          this.tweens.add({
            targets: panel,
            alpha: 0,
            duration: 200,
            ease: "Back.in",
            onComplete: () => {
              container.destroy();
              onComplete();
            },
          });
        }
      },
    });
  }

  private _nextQuestion() {
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex >= this.questions.length) {
      this._endGame();
      return;
    }

    this.currentQuestion = this.questions[this.currentQuestionIndex];
    if (this.currentQuestion) {
      this.leftText.setAlpha(0);
      this.rightText.setAlpha(0);
      this.leftText.setText(this.currentQuestion.leftStatement);
      this.rightText.setText(this.currentQuestion.rightStatement);
      const targetLeftX = (this.leftPanel.width - this.leftText.width) / 2;
      const targetRightX = (this.rightPanel.width - this.rightText.width) / 2;
      this.leftText.x = targetLeftX - 84;
      this.rightText.x = targetRightX + 84;

      this.tweens.add({
        targets: this.leftText,
        x: targetLeftX,
        alpha: 1,
        duration: 300,
        ease: "Back.out",
      });

      this.tweens.add({
        targets: this.rightText,
        x: targetRightX,
        alpha: 1,
        duration: 300,
        ease: "Back.out",
      });
    }
  }

  private _startTime() {
    if (this.timerEvent) this.timerEvent.destroy();

    this.game.events.emit("timer-update", this._formatTime(this.gameDuration));

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.gameDuration--;
        this.game.events.emit(
          "timer-update",
          this._formatTime(this.gameDuration),
        );

        if (this.gameDuration <= 0) {
          this.timerEvent.destroy();
          this._endGame();
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  private _formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
