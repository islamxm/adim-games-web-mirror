import { BaseScene } from "@/core/lib/baseScene";
import {
  levels,
  SCENES,
  shuffleQuestions,
  type Level,
  type Question,
} from "../config";
import type Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import OverlapSizer from "phaser3-rex-plugins/templates/ui/overlapsizer/OverlapSizer";
import type { GameObjects } from "phaser";
import type Label from "phaser3-rex-plugins/templates/ui/label/Label";
import type GridSizer from "phaser3-rex-plugins/templates/ui/gridsizer/GridSizer";
import type Image from "phaser3-rex-plugins/plugins/gameobjects/mesh/perspective/image/Image";

export default class GameScene extends BaseScene {
  private gameDuration = 40;

  private gameGrid!: GridSizer;
  private levelChangePanel!: Sizer;
  private level = 0;
  private levelData: Level = {
    ...levels[0],
    questions: shuffleQuestions(levels[0].questions),
  };
  private cards!: GameObjects.Group;
  private timerEvent!: Phaser.Time.TimerEvent;

  private pair: Array<Pick<Question, "id" | "value">> = [];
  private done: Array<Pick<Question, "id" | "value">> = [];
  private canInteract = true;

  constructor() {
    super({ sceneKey: SCENES.GAME });
  }

  init() {
    this.gameDuration = 40;
    this.level = 0;
    this.levelData = {
      ...levels[0],
      questions: shuffleQuestions(levels[0].questions),
    };
  }

  create() {
    this.resetGame();
    this.startTime();
    this.levelChange();
    this.scene.launch(SCENES.HUD);
  }

  levelChange() {
    this.level++;
    if (this.levelChangePanel) {
      this.levelChangePanel.destroy();
    }
    if (this.timerEvent) {
      this.timerEvent.paused = true;
    }
    const label = this.rexUI.add.label({
      width: this.utils.gameWidth * 0.7,
      height: this.utils._px(97),
      x: this.utils.gameWidth / 2,
      y: this.utils.gameHeight / 2,
      background: this.rexUI.add.roundRectangle({
        x: 0,
        y: 0,
        width: this.utils.gameWidth * 0.7,
        height: this.utils._px(97),
        radius: this.utils._px(49),
        color: 0xffffff,
      }),
      text: this.utils.createText(`Level ${this.level}`, {
        style: {
          fontFamily: "Nerko-One-Font",
          fontSize: `${this.utils._px(54)}px`,
          align: "center",
          color: "#F54900",
        },
      }),
      align: "center",
    });

    this.levelChangePanel = this.rexUI.add.sizer({
      x: this.utils.gameWidth / 2,
      y: this.utils.gameHeight / 2,
      width: this.utils.gameWidth,
      height: this.utils.gameHeight,
    });
    this.levelChangePanel.addSpace();
    this.levelChangePanel.add(label, { align: "center" });
    this.levelChangePanel.addSpace();
    this.levelChangePanel.layout();
    this.levelChangePanel.setAlpha(0);
    if (this.gameGrid) {
      this.gameGrid.setVisible(false);
    }

    this.tweens.add({
      targets: this.levelChangePanel,
      duration: 200,
      alpha: 1,
      onComplete: () => {
        this.time.delayedCall(2000, () => {
          this.tweens.add({
            targets: this.levelChangePanel,
            duration: 200,
            alpha: 0,
            onComplete: () => {
              this.startLevel();
            },
          });
        });
      },
    });
  }

  handleAnswer(card: OverlapSizer) {
    this.openCard(card, () => {
      if (this.pair.length === 1) {
        return;
      }
      const first = this.pair[0];
      const second = this.pair[1];

      const isCorrect = first?.value === second?.value;

      if (isCorrect) {
        this.gameDuration = this.gameDuration + 3;
        this.game.events.emit("more-sec", 3);
        this.done.push(first);
        this.done.push(second);
        this.pair = [];
        if (!this.cards) return;
        this.cards.children.each((card) => {
          const c = card as OverlapSizer;
          const id = card.getData("id") as number;

          if (id === first.id || id === second.id) {
            const front = c.getElement("front") as Label;

            const icon = front.getElement("icon") as Image;
            icon.setTexture(card.getData("imageKey")).setDepth(2);
            front.addBackground(this.add.image(0, 0, "cardFrontCorrectBg"));

            c.layout();
          }
          return null;
        });
        const isVictory = this.done.length === this.levelData.questions.length;
        if (isVictory) {
          this.sound.play("victorySound");
          if (this.level === levels.length) {
            this.endGame();
          } else {
            this.levelChange();
          }
        } else {
          this.sound.play("correctSound");
        }
      } else {
        this.pair = [];
        this.sound.play("wrongSound");
        this.cards.children.each((card) => {
          const id = card.getData("id") as number;
          if (id === first.id || id === second.id) {
            this.closeCard(card as OverlapSizer);
          }
          return null;
        });
      }
    });
  }

  selectCard(card: OverlapSizer) {
    const id = card.getData("id") as number;
    const value = card.getData("value") as string;
    const isFlipping = card.getData("isFlipping") as boolean;
    const isDisabled = this.done.find((f) => f.id === id);

    if (isDisabled || isFlipping || !this.canInteract) return;

    this.sound.play("flipSound");

    const isContained = this.pair.find((f) => f.id === id);

    if (isContained) {
      this.closeCard(card, () => {
        this.pair = [];
      });
      return;
    }
    this.pair.push({ id, value });
    this.handleAnswer(card);
  }

  createCard(question: Question, config: Omit<Level, "questions" | "label">) {
    const { cardHeight, cardWidth } = config.size;

    const backSide = this.add
      .image(0, 0, "cardBackBg")
      .setDisplaySize(this.utils._px(cardWidth), this.utils._px(cardHeight));
    const frontSide = this.rexUI.add.label({
      background: this.add.image(0, 0, "cardFrontBg"),
      align: "center",
      icon: this.add.image(0, 0, question.imageKey),
    });
    frontSide.setVisible(true);

    const card = this.rexUI.add.overlapSizer({
      width: this.utils._px(cardWidth),
      height: this.utils._px(cardHeight),
    });
    this.canInteract = false;
    this.time.delayedCall(1000 * (this.level * 2) || 1000, () => {
      this.closeCard(card);
      this.canInteract = true;
      this.timerEvent.paused = false;
    });

    card.add(backSide, { key: "back", align: "center", expand: true });
    card.add(frontSide, { key: "front", align: "center", expand: true });

    card.setData("value", question.value);
    card.setData("id", question.id);
    card.setData("imageKey", question.imageKey);
    card.setData("isFlipping", false);

    card.setInteractive().onClick(() => this.selectCard(card));
    return card;
  }

  startLevel() {
    this.cleanupLevel(() => {
      this.levelData = {
        ...levels[this.level - 1],
        questions: shuffleQuestions(levels[this.level - 1].questions),
      };
      const { size } = this.levelData;
      this.gameGrid = this.rexUI.add.gridSizer({
        x: this.utils.gameWidth / 2,
        y: this.utils.gameHeight / 2,
        column: size.col,
        row: size.row,
        space: {
          column: this.utils._px(size.gap),
          row: this.utils._px(size.gap),
        },
      });
      this.cards = this.add.group();
      this.levelData.questions.forEach((question) => {
        const card = this.createCard(question, { size });
        this.gameGrid.add(card);
        this.cards.add(card);
      });
      this.gameGrid.setAlpha(0);
      this.gameGrid.layout();
      this.tweens.add({
        targets: this.gameGrid,
        duration: 200,
        alpha: 1,
      });
    });
  }

  cleanupLevel(nextLevelCb: () => void) {
    if (!this.gameGrid) {
      nextLevelCb();
      return;
    }
    this.canInteract = false;
    this.tweens.add({
      targets: this.gameGrid,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        this.gameGrid?.destroy();
        this.cards?.destroy();
        this.pair = [];
        this.done = [];
        nextLevelCb();
      },
    });
  }

  closeCard(card: OverlapSizer, onComplete?: () => void) {
    card.setData("isFlipping", true);
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
            onComplete?.();
          },
        });
      },
    });
  }

  openCard(card: OverlapSizer, onComplete?: () => void) {
    card.setData("isFlipping", true);
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
            onComplete?.();
          },
        });
      },
    });
  }

  resetGame() {
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
    const isVictory = this.done.length === this.levelData.questions.length;
    if (isVictory) {
      this.utils.animatedSceneChange(SCENES.VICTORY);
    } else {
      this.utils.animatedSceneChange(SCENES.GAME_OVER);
    }
  }
}
