import { BaseScene } from "@/core/lib/baseScene";
import {
  QuestionObject,
  SCENES,
  type Direction,
  type Question,
} from "../config";
import type { GameObjects } from "phaser";
import type Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";

const SCORE_BASE = 5;

export default class GameScene extends BaseScene {
  private gameDuration = 60;
  private startCountdown = 3;
  private score = 0;
  private scoreMultiplier = 1;
  private comboCount = 0;
  private leafWidth: number = this.utils._px(94);
  private leafHeight: number = this.utils._px(94);
  private gap: number = this.utils._px(75);
  private speed: number = this.utils._px(2);
  private leaves!: GameObjects.Group;
  private wrapWidth!: number;
  private gameContainer!: Sizer;

  private moveDirection!: Direction;

  private currentQuestion!: Question;
  private currentResultIcon: Phaser.GameObjects.Image | null = null;
  private timerEvent!: Phaser.Time.TimerEvent;

  constructor() {
    super({ sceneKey: SCENES.GAME });
  }

  create() {
    // Сбрасываем состояние игры при старте/рестарте
    this.gameDuration = 60;
    this.score = 0;
    this.scoreMultiplier = 1;
    this.comboCount = 0;

    this.scene.stop(SCENES.HUD);
    super.createCountdown(this.startCountdown, () => {
      this.next();
      this.startTime();
      this.scene.launch(SCENES.HUD);
    });
  }

  next() {
    if (this.leaves) this.leaves.destroy(true);
    if (this.gameContainer) this.gameContainer.destroy();

    this.currentQuestion = QuestionObject.generateQuestion();
    const { leafType, direction, moveDirection } = this.currentQuestion;
    this.moveDirection = moveDirection;

    const { width, height } = this.scale;

    this.gameContainer = this.rexUI.add
      .sizer({
        x: width / 2,
        y: height / 2,
        width: width,
        height: height,
        orientation: "vertical",
      })
      .layout();

    this.leaves = this.add.group();

    const cols = Math.ceil(width / (this.leafWidth + this.gap)) + 2;
    const rows = Math.ceil(height / (this.leafHeight + this.gap)) + 1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const xOffset = r % 2 === 0 ? 0 : (this.leafWidth + this.gap) / 2;

        const posX = c * (this.leafWidth + this.gap) + xOffset;
        const posY = r * (this.leafHeight + this.gap);
        const leafImgKey = `${leafType}-leaf`;
        const leaf = this.add.image(posX, posY, leafImgKey);
        leaf.setOrigin(0.5);
        leaf.setAlpha(0);
        leaf.setScale(0.8);

        if (direction === "BOTTOM") {
          leaf.setAngle(270);
        }
        if (direction === "TOP") {
          leaf.setAngle(90);
        }
        if (direction === "LEFT") {
          leaf.setAngle(360);
        }
        if (direction === "RIGHT") {
          leaf.setAngle(180);
        }

        this.leaves.add(leaf);
      }
    }

    this.tweens.add({
      targets: this.leaves.getChildren(),
      alpha: 1,
      scale: 1,
      duration: 300,
      ease: "Back.easeOut",
    });

    this.wrapWidth = cols * (this.leafWidth + this.gap);

    this.gameContainer.setInteractive();

    const swipe = this.rexGestures.add.swipe(this.gameContainer, {
      threshold: this.utils._px(50),
      velocityThreshold: this.utils._px(1000),
      dir: "4dir",
    });

    swipe.on("swipe", (swipeObj: any) => {
      if (swipeObj.left) {
        this.handleAnswer("LEFT");
      } else if (swipeObj.right) {
        this.handleAnswer("RIGHT");
      } else if (swipeObj.up) {
        this.handleAnswer("TOP");
      } else if (swipeObj.down) {
        this.handleAnswer("BOTTOM");
      }
    });
  }

  update() {
    if (!this.leaves || !this.leaves.scene) return;
    const { width, height } = this.scale;
    const wrapHeight =
      (Math.ceil(height / (this.leafHeight + this.gap)) + 1) *
      (this.leafHeight + this.gap);

    // @ts-ignore
    this.leaves.children.iterate((leaf: any) => {
      switch (this.moveDirection) {
        case "LEFT":
          leaf.x -= this.speed;
          if (leaf.x < -this.leafWidth) leaf.x += this.wrapWidth;
          break;
        case "RIGHT":
          leaf.x += this.speed;
          if (leaf.x > width + this.leafWidth) leaf.x -= this.wrapWidth;
          break;
        case "TOP":
          leaf.y -= this.speed;
          if (leaf.y < -this.leafHeight) leaf.y += wrapHeight;
          break;
        case "BOTTOM":
          leaf.y += this.speed;
          if (leaf.y > height + this.leafHeight) leaf.y -= wrapHeight;
          break;
      }
    });
  }

  handleAnswer(direction: Direction) {
    if (!this.currentQuestion) return;

    // Отключаем ввод на время анимации
    this.gameContainer.disableInteractive();

    if (this.currentQuestion.correct === direction) {
      this.correct();
    } else {
      this.wrong();
    }

    this.tweens.add({
      targets: [this.gameContainer, ...this.leaves.getChildren()],
      alpha: 0,
      duration: 150,
      onComplete: () => {
        this.next();
      },
    });
  }

  showResultIcon(iconKey: string) {
    if (this.currentResultIcon) {
      this.tweens.killTweensOf(this.currentResultIcon);
      this.currentResultIcon.destroy();
    }

    const icon = this.add
      .image(0, 0, iconKey)
      .setDisplaySize(this.utils._px(90), this.utils._px(90))
      .setDepth(2);

    const { x, y } = this.utils._getGlobalPosition(this.gameContainer);

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

  wrong() {
    this.showResultIcon("wrong-icon");

    this.tweens.killTweensOf(this.cameras.main);
    this.cameras.main.scrollX = 0;

    this.sound.play("wrong-sound");

    this.comboCount = 0;
    if (this.scoreMultiplier > 1) {
      this.scoreMultiplier--;
    }

    this.game.events.emit("update-score", this.score);
    this.game.events.emit("update-combo-multiplier", this.scoreMultiplier);
    this.game.events.emit("update-combo-count", this.comboCount);
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
    if (this.timerEvent) {
      this.timerEvent.destroy();
    }
    if (this.leaves) {
      this.leaves.destroy(true);
      this.leaves = null as any;
    }
    this.scene.stop(SCENES.HUD);
    this.registry.set("score", this.score);
    this.utils.animatedSceneChange(SCENES.GAME_OVER);
  }
}
