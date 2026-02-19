import * as Phaser from "phaser";

import { SCENES, type Question } from "../config";
import { GameUtils } from "@/core/lib/gameUtils";

const SCORE_BASE = 5;

export class GameScene extends Phaser.Scene {
  private utils!: GameUtils;
  private gameDuration = 60;
  private score = 0;
  private scoreMultiplier = 1;
  private comboCount = 0; // max 5
  private currentQuestion: Question | null = null;
  private currentQuestionIndex = 0;
  private startCountdown = 5;
  private questions: Question[] = [];

  private leftText!: Phaser.GameObjects.Text;
  private rightText!: Phaser.GameObjects.Text;
  private currentResultIcon: Phaser.GameObjects.Image | null = null;
  private timerEvent!: Phaser.Time.TimerEvent;

  constructor() {
    super({ key: SCENES.GAME });
  }

  preload() {
    this.utils = new GameUtils(this);
    this.questions = this.registry.get("questions");
  }

  create() {
    this.add
      .image(0, 0, "bg")
      .setOrigin(0, 0)
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    this.currentQuestion = this.questions[this.currentQuestionIndex];

    this.game.events.on("answer", (value: string) => {
      if (!this.currentQuestion) return;

      if (value === this.currentQuestion.correct) {
        this.correct();
      } else {
        this.wrong();
      }

      this._nextQuestion();
    });

    this.scene.launch(SCENES.HUD);
    this._createBoard();
    this._createTitle();
    this._startTime();

    this.events.on("shutdown", () => {
      this.game.events.off("answer");
    });
  }

  private _createTitle() {
    const { width, height } = this.cameras.main;
    const titleStyle = {
      fontSize: "18px",
      color: "#ffffff",
      fontStyle: "600",
      fontFamily: "sans-serif",
    };

    const title = this.add
      .text(width / 2, height / 2 - 80, "Выберите большую сторону", titleStyle)
      .setOrigin(0.5)
      .setResolution(window.devicePixelRatio || 2);

    title.setAlpha(0);
    this.tweens.add({
      targets: title,
      alpha: 1,
      duration: 500,
      ease: "Linear",
      delay: 500,
    });
  }

  _createBoard() {
    const { width, height } = this.cameras.main;

    const leftVariant = this.add.graphics();
    leftVariant.fillStyle(0xffffff, 1);
    leftVariant.fillRoundedRect(-160, -50, 152, 100, 10);

    const rightVariant = this.add.graphics();
    rightVariant.fillStyle(0xffffff, 1);
    rightVariant.fillRoundedRect(8, -50, 152, 100, 10);

    const textStyle = {
      fontSize: "24px",
      color: "#000000",
      fontStyle: "600",
      align: "center",
      wordWrap: { width: 140 },
    };

    this.leftText = this.add
      .text(-84, 0, this.currentQuestion?.left || "", textStyle)
      .setOrigin(0.5)
      .setResolution(window.devicePixelRatio || 2);

    this.rightText = this.add
      .text(84, 0, this.currentQuestion?.right || "", textStyle)
      .setOrigin(0.5)
      .setResolution(window.devicePixelRatio || 2);

    this.add.container(width / 2, height / 2, [
      leftVariant,
      rightVariant,
      this.leftText,
      this.rightText,
    ]);

    // Начальные позиции для анимации (с левой и правой стороны)
    leftVariant.setX(-width / 2);
    leftVariant.setAlpha(0);
    this.leftText.setAlpha(0);

    rightVariant.setX(width / 2);
    rightVariant.setAlpha(0);
    this.rightText.setAlpha(0);

    // Анимация левой плашки (вылет слева)
    this.tweens.add({
      targets: leftVariant,
      x: 0,
      alpha: 1,
      duration: 600,
      ease: "Cubic.out",
      delay: 300,
      onComplete: () => {
        this.leftText.setAlpha(1);
      },
    });

    // Анимация правой плашки (вылет справа)
    this.tweens.add({
      targets: rightVariant,
      x: 0,
      alpha: 1,
      duration: 600,
      ease: "Cubic.out",
      delay: 300,
      onComplete: () => {
        this.rightText.setAlpha(1);
      },
    });
  }

  correct() {
    this._showResultIcon("right-icon");
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
    this._showResultIcon("wrong-icon");
    const startX = this.cameras.main.scrollX;

    this.tweens.add({
      targets: this.cameras.main,
      scrollX: startX + 5,
      duration: 50,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        this.cameras.main.scrollX = startX;
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

  private _showResultIcon(iconKey: string) {
    if (this.currentResultIcon) {
      this.tweens.killTweensOf(this.currentResultIcon);
      this.currentResultIcon.destroy();
    }

    const { width, height } = this.cameras.main;

    this.currentResultIcon = this.add
      .image(width / 2, height / 2, iconKey)
      .setDisplaySize(80, 80)
      .setAlpha(0)
      .setScale(0);

    const icon = this.currentResultIcon;

    this.tweens.add({
      targets: icon,
      scale: 1,
      alpha: 1,
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

  private _nextQuestion() {
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex >= this.questions.length) {
      this._endGame();
      return;
    }

    this.currentQuestion = this.questions[this.currentQuestionIndex];
    if (this.currentQuestion) {
      // Подготовка текста к анимации
      this.leftText.setAlpha(0).setX(-94);
      this.rightText.setAlpha(0).setX(94);

      this.leftText.setText(this.currentQuestion.left);
      this.rightText.setText(this.currentQuestion.right);

      // Анимация появления текста
      this.tweens.add({
        targets: this.leftText,
        x: -84,
        alpha: 1,
        duration: 300,
        ease: "Back.out",
      });

      this.tweens.add({
        targets: this.rightText,
        x: 84,
        alpha: 1,
        duration: 300,
        ease: "Back.out",
      });
    }
  }

  private _startTime() {
    // Теперь UI таймера в HUDScene, здесь только логика
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

    this.game.events.off("answer");

    this.utils.animatedSceneChange(SCENES.GAME_OVER);
  }
}
