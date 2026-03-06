import { BaseScene } from "@/core/lib/baseScene";
import { SCENES, type Question } from "../config";
import type Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import type OverlapSizer from "phaser3-rex-plugins/templates/ui/overlapsizer/OverlapSizer";
import type { GameObjects } from "phaser";
import type Label from "phaser3-rex-plugins/templates/ui/label/Label";

const SCORE_BASE = 5;

export default class GameScene extends BaseScene {
  private gameDuration = 60;
  private startCountdown = 3;
  private score = 0;
  private scoreMultiplier = 1;
  private comboCount = 0;

  private gameContainer!: Sizer;

  private currentQuestion!: Question;
  private timerEvent!: Phaser.Time.TimerEvent;

  constructor() {
    super({ sceneKey: SCENES.GAME });
  }

  init() {
    this.score = 0;
    this.scoreMultiplier = 1;
    this.comboCount = 0;
    this.gameDuration = 60;
  }

  create() {
    this.resetGame();
    this.startGame();
    // super.createCountdown(this.startCountdown, () => {
    //   this.startTime();
    //   this.scene.launch(SCENES.HUD);
    // });
  }

  handleAnswer() {}

  closeCard() {}

  openCard() {}

  flipCard(card: OverlapSizer) {
    if (card.getData("isFlipping") || card.getData("isFaceUp")) return;

    card.setData("isFlipping", true);

    this.tweens.add({
      targets: card,
      scaleX: 0,
      duration: 150,
      ease: "Linar",
      onComplete: () => {
        const back = card.getElement("back") as GameObjects.Image;
        const front = card.getElement("front") as Label;

        back.setVisible(false);
        front.setVisible(true);

        this.tweens.add({
          targets: card,
          scaleX: 1,
          duration: 150,
          ease: "Back.easeOut",
          onComplete: () => {
            card.setData("isFlipping", false);
            card.setData("isFaceUp", true);
          },
        });
      },
    });
  }

  createCard() {
    const frontSide = this.rexUI.add.label({
      background: this.add.image(0, 0, "cardFrontBg"),
      align: "center",
    });
    frontSide.setVisible(false);

    const backSide = this.add.image(0, 0, "cardBackBg");

    const card = this.rexUI.add.overlapSizer({
      width: this.utils._px(99),
      height: this.utils._px(120),
    });
    card.add(backSide, { key: "back", align: "center", expand: true });
    card.add(frontSide, { key: "front", align: "center", expand: true });

    card.setData({ isFaceUp: false });
    card.setInteractive().onClick(() => this.flipCard(card));
    return card;
  }

  startGame() {
    const gridSizer = this.rexUI.add.gridSizer({
      x: this.utils.gameWidth / 2,
      y: this.utils.gameHeight / 2,
      column: 3,
      row: 4,
      space: {
        column: this.utils._px(12),
        row: this.utils._px(12),
      },
    });

    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    items.forEach(() => {
      gridSizer.add(this.createCard());
    });
    gridSizer.layout();
  }

  resetGame() {
    this.gameDuration = 60;
    this.score = 0;
    this.scoreMultiplier = 1;
    this.comboCount = 0;
    // this.timerEvent.destroy();
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

  endGame() {
    this.resetGame();
    this.registry.set("score", this.score);
    this.utils.animatedSceneChange(SCENES.GAME_OVER);
  }
}
