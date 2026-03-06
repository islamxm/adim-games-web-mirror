import { BaseScene } from "@/core/lib/baseScene";
import {
  questionsMock,
  SCENES,
  shuffleQuestions,
  type Question,
} from "../config";
import type Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import type OverlapSizer from "phaser3-rex-plugins/templates/ui/overlapsizer/OverlapSizer";
import type { GameObjects } from "phaser";
import type Label from "phaser3-rex-plugins/templates/ui/label/Label";
import type GridSizer from "phaser3-rex-plugins/templates/ui/gridsizer/GridSizer";

const SCORE_BASE = 5;

export default class GameScene extends BaseScene {
  private gameDuration = 60;
  private startCountdown = 3;
  private score = 0;
  private scoreMultiplier = 1;
  private comboCount = 0;

  private gameContainer!: Sizer;

  private questions: Array<Question> = shuffleQuestions(questionsMock);
  private cards!: GameObjects.Group;
  private timerEvent!: Phaser.Time.TimerEvent;

  private pair: Array<Pick<Question, "id" | "value">> = [];
  private done: Array<Pick<Question, "id" | "value">> = [];

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
    super.createCountdown(this.startCountdown, () => {
      // this.startTime();
      this.startGame();
      this.scene.launch(SCENES.HUD);
    });
  }

  handleAnswer() {
    if (this.pair.length < 2) return;
    const first = this.pair[0];
    const second = this.pair[1];

    const isCorrect = first.value === second.value;

    if (isCorrect) {
      this.done.push(first);
      this.done.push(second);
      this.pair = [];
      const isVictory = this.done.length === this.questions.length;

      if (isVictory) {
        this.sound.play("victorySound");
      } else {
        this.sound.play("correctSound");
      }
    } else {
      this.sound.play("wrongSound");
      this.cards.children.each((card) => {
        const id = card.getData("id") as number;
        if (id === first.id || id === second.id) {
          this.closeCard(card as OverlapSizer);
        }
        return null;
      });
    }
  }

  closeCard(card: OverlapSizer) {
    const id = card.getData("id") as number;
    this.pair = this.pair.filter((f) => f.id === id);
    this.tweens.add({
      targets: card,
      scaleX: 0,
      duration: 150,
      ease: "Linear",
      onComplete: () => {
        const back = card.getElement("back") as GameObjects.Image;
        const front = card.getElement("front") as Label;

        back.setVisible(true);
        front.setVisible(false);

        this.tweens.add({
          targets: card,
          scaleX: 1,
          duration: 150,
          ease: "Back.easeOut",
          onComplete: () => {
            card.setData("isFlipping", false);
          },
        });
      },
    });
  }

  openCard(card: OverlapSizer) {
    this.tweens.add({
      targets: card,
      scaleX: 0,
      duration: 150,
      ease: "Linear",
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
          },
        });
      },
    });
  }

  selectCard(card: OverlapSizer) {
    const cardId = card.getData("id") as number;
    const cardValue = card.getData("value") as string;
    const isFlipping = card.getData("isFlipping") as boolean;
    const isDisabled = this.done.find((f) => f.id === cardId);

    if (isDisabled || isFlipping) return;

    const canClose = this.pair.find((f) => f.id === cardId);
    this.sound.play("flipSound");
    if (canClose) {
      this.pair = this.pair.filter((f) => f.id === cardId);
      this.closeCard(card);
    } else {
      this.pair.push({ id: cardId, value: cardValue });
      this.openCard(card);
      this.handleAnswer();
    }
  }

  createCard(question: Question) {
    const backSide = this.add.image(0, 0, "cardBackBg");
    const frontSide = this.rexUI.add.label({
      background: this.add.image(0, 0, "cardFrontBg"),
      align: "center",
      icon: this.add.image(0, 0, question.imageKey),
    });
    frontSide.setVisible(true);

    const card = this.rexUI.add.overlapSizer({
      width: this.utils._px(99),
      height: this.utils._px(120),
    });

    this.time.delayedCall(1000, () => this.closeCard(card));

    card.add(backSide, { key: "back", align: "center", expand: true });
    card.add(frontSide, { key: "front", align: "center", expand: true });

    card.setData("value", question.value);
    card.setData("id", question.id);
    card.setData("imageKey", question.imageKey);
    card.setData("isFlipping", false);

    card.setInteractive().onClick(() => this.selectCard(card));
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
    this.cards = this.add.group();
    this.questions.forEach((question) => {
      const card = this.createCard(question);
      gridSizer.add(card);
      this.cards.add(card);
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
