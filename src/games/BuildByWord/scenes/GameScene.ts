import { BaseScene } from "@/core/lib/baseScene";
import { SCENES, type Question } from "../config";
import { GameObjects } from "phaser";
import type Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import type Label from "phaser3-rex-plugins/templates/ui/label/Label";

const SCORE_BASE = 5;

export default class GameScene extends BaseScene {
  private topHUDOffset = this.utils._px(100);
  private bottomHUDOffset = 0;

  private gameDuration = 10;
  private startCountdown = 3;
  private score = 0;
  private scoreMultiplier = 1;
  private comboCount = 0;
  private timerEvent!: Phaser.Time.TimerEvent;

  private balloonsGroup!: GameObjects.Group;
  private questionIndex = 0;
  private question!: Question;
  private currectResultBg: Label | null = null;
  private gameContainer!: Sizer;

  constructor() {
    super({ sceneKey: SCENES.GAME });
  }

  init() {
    this.score = 0;
    this.scoreMultiplier = 1;
    this.comboCount = 0;
    this.questionIndex = 0;
    this.gameDuration = 60;
  }

  create() {
    this.resetGame();
    this.startGame();
    // super.createCountdown(this.startCountdown, () => {
    //   this.scene.launch(SCENES.HUD);
    //   const hudScene = this.scene.get(SCENES.HUD);
    //   hudScene.events.once("create", () => {
    //     this.startTime();
    //     this.startGame();
    //   });
    // });
  }

  resetGame() {
    this.bottomHUDOffset =
      this.utils._px(53) + this.utils.bottomInset + this.utils._px(34);
    this.gameDuration = 60;
    this.score = 0;
    this.scoreMultiplier = 1;
    this.comboCount = 0;
    this.scene.stop(SCENES.HUD);
  }

  startTime() {
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
          this.endGame();
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  startGame() {
    this.gameContainer = this.rexUI.add.sizer({
      x: this.utils.gameWidth / 2,
      y: this.utils.gameHeight / 2,
      width: this.utils.gameWidth,
      height: this.utils.gameHeight,
    });
  }

  getQuestion() {}

  handleAnswer(index: number) {
    const isCorrect = false;
    if (isCorrect) {
      this.correct();
    } else {
      this.wrong();
    }
    this.getQuestion();
  }

  correct() {
    // this.showResultBg("correct");
    // this.sound.play("correctSound");
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
    // this.showResultBg("wrong");
    // this.sound.play("wrongSound");
    this.comboCount = 0;
    if (this.scoreMultiplier > 1) {
      this.scoreMultiplier--;
    }

    this.game.events.emit("update-score", this.score);
    this.game.events.emit("update-combo-multiplier", this.scoreMultiplier);
    this.game.events.emit("update-combo-count", this.comboCount);
  }

  showResultBg(type: "correct" | "wrong") {
    if (this.currectResultBg) {
      this.tweens.killTweensOf(this.currectResultBg);
      this.currectResultBg.destroy();
    }

    const bg = this.rexUI.add.label({
      x: 0,
      y: 0,
      width: this.utils.gameWidth,
      height: this.utils.gameHeight,
      background: this.rexUI.add.roundRectangle({
        x: this.utils.gameWidth / 2,
        y: this.utils.gameHeight / 2,
        width: this.utils.gameWidth,
        height: this.utils.gameHeight,
        color: type === "correct" ? 0x23c203 : 0xf03737,
      }),
    });

    this.gameContainer.pin(bg);

    this.currectResultBg = bg;
    this.currectResultBg.setAlpha(0);

    this.tweens.add({
      targets: bg,
      alpha: 0.2,
      duration: 300,
      ease: "Back.out",
      onComplete: () => {
        this.tweens.add({
          targets: this.currectResultBg,
          duration: 300,
          alpha: 0,
          ease: "Back.out",
          onComplete: () => {
            this.currectResultBg?.destroy();
          },
        });
      },
    });
  }

  endGame() {
    this.registry.set("score", this.score);
    this.resetGame();
    this.utils.animatedSceneChange(SCENES.GAME_OVER);
  }
}
