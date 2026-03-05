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
    super.createCountdown(this.startCountdown, () => {
      this.scene.launch(SCENES.HUD);
      const hudScene = this.scene.get(SCENES.HUD);
      hudScene.events.once("create", () => {
        this.startTime();
        this.startGame();
      });
    });
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
    const safeHeight = Math.min(
      this.utils.gameHeight - this.topHUDOffset - this.bottomHUDOffset,
      this.utils.gameHeight * 0.4,
    );

    const verticalMargin =
      (this.utils.gameHeight -
        this.topHUDOffset -
        this.bottomHUDOffset -
        safeHeight) /
      2;
    const finalY = this.topHUDOffset + verticalMargin;

    this.physics.world.setBounds(0, finalY, this.utils.gameWidth, safeHeight);
    this.balloonsGroup = this.physics.add.group({
      bounceX: 1,
      bounceY: 1,
      collideWorldBounds: true,
      allowGravity: false,
    });

    this.getQuestion();

    this.physics.add.collider(this.balloonsGroup, this.balloonsGroup);
  }

  getQuestion() {
    const question = this.registry.get("questions")[this.questionIndex];
    this.question = question;
    this.game.events.emit("newQuestion", question.value);

    const variants = question.variants as Array<string>;

    const placedPositions: Array<{ x: number; y: number }> = [];

    const MIN_DISTANCE = this.utils._px(110);

    variants.forEach((txt, i) => {
      let x, y;
      let isOverlapping;
      let attempts = 0;

      do {
        x = Phaser.Math.Between(100, this.utils.gameWidth - 100);
        y = Phaser.Math.Between(
          this.topHUDOffset + 50,
          this.utils.gameHeight - this.topHUDOffset - 50,
        );

        isOverlapping = false;

        for (let pos of placedPositions) {
          const distance = Phaser.Math.Distance.Between(x, y, pos.x, pos.y);

          if (distance < MIN_DISTANCE) {
            isOverlapping = true;
            break;
          }
        }
        attempts++;
      } while (isOverlapping && attempts < 50);

      placedPositions.push({ x, y });

      const balloon = this.rexUI.add
        .label({
          x,
          y,
          width: this.utils._px(91),
          height: this.utils._px(166),
          background: this.add.image(0, 0, "balloonImg"),
          text: this.utils.createText(txt.replace("*", "x"), {
            style: {
              fontFamily: "Nerko-One-Font",
              fontSize: `${this.utils._px(24)}px`,
              color: "#fff",
            },
          }),
          align: "center",
          space: { top: this.utils._px(-60) },
        })
        .layout();
      // @ts-ignore

      this.physics.add.existing(balloon);
      this.balloonsGroup.add(balloon);
      // @ts-ignore
      balloon.body.setSize(this.utils._px(91), this.utils._px(110));
      // @ts-ignore
      balloon.body.setOffset(0, 0);
      // @ts-ignore
      balloon.body.setCircle(this.utils._px(46), 0, this.utils._px(5));
      balloon.setScale(0);
      this.tweens.add({
        targets: balloon,
        scale: 1,
        duration: 500,
        ease: "Back.easeOut",
        delay: i * 50,
      });
      // @ts-ignore
      balloon.isCorrect = question.correct === i;

      this.tweens.add({
        targets: balloon,
        angle: {
          from: Phaser.Math.Between(-10, -5),
          to: Phaser.Math.Between(5, 10),
        },
        duration: Phaser.Math.Between(2000, 5000),
        yoyo: true,
        repeat: -1,
        // y: y - Phaser.Math.Between(this.utils._px(5), this.utils._px(15)),
        ease: "Sine.easeInOut",
        delay: i * 50,
      });
      balloon
        .setInteractive(
          new Phaser.Geom.Circle(
            balloon.width / 2,
            this.utils._px(46 * 2) / 2 + this.utils._px(5),
            this.utils._px(46),
          ),
          Phaser.Geom.Circle.Contains,
        )
        .onClick(() => {
          this.handleAnswer(i);
        });
    });

    this.questionIndex++;
  }

  shatterBalloon(x: any, y: any) {
    this.sound.play("balloonPopSound", { volume: 0.5 });

    const texture = this.textures.get("balloonImg").getSourceImage();
    const width = texture.width;
    const height = texture.height;

    const cols = 7;
    const rows = 7;
    const pieceWidth = width / cols;
    const pieceHeight = height / rows;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let piece = this.physics.add.sprite(x, y, "balloonImg");
        piece.setCrop(i * pieceWidth, j * pieceHeight, pieceWidth, pieceHeight);
        piece.setScale(Phaser.Math.FloatBetween(0.5, 1.2));

        const velocityX = Phaser.Math.Between(-800, 800);
        const velocityY = Phaser.Math.Between(-1000, 200);
        piece.setVelocity(velocityX, velocityY);

        piece.setGravityY(1500);
        piece.setDrag(150, 50);
        piece.setAngularVelocity(Phaser.Math.Between(-600, 600));

        this.tweens.add({
          targets: piece,
          alpha: 0,
          scale: 0,
          duration: Phaser.Math.Between(300, 600),
          delay: Phaser.Math.Between(0, 150),
          onComplete: () => {
            piece.destroy();
          },
        });
      }
    }
  }

  handleAnswer(index: number) {
    const isCorrect = this.question.correct === index;
    if (isCorrect) {
      this.correct();
    } else {
      this.wrong();
    }
    this.getQuestion();
  }

  correct() {
    this.showResultBg("correct");
    this.sound.play("correctSound");
    this.comboCount++;
    this.score = this.score + SCORE_BASE * this.scoreMultiplier;

    if (this.comboCount > 4) {
      this.scoreMultiplier++;
      this.comboCount = 0;
    }

    this.game.events.emit("update-score", this.score);
    this.game.events.emit("update-combo-multiplier", this.scoreMultiplier);
    this.game.events.emit("update-combo-count", this.comboCount);

    const allBalloons = this.balloonsGroup.getChildren().slice();
    let popCount = 1;
    allBalloons.forEach((b, i) => {
      // @ts-ignore
      if (b.isCorrect) {
        // @ts-ignore
        this.shatterBalloon(b.x, b.y);
        b.destroy();
      } else {
        this.time.delayedCall(popCount * 80, () => {
          if (b && b.active) {
            // @ts-ignore
            this.shatterBalloon(b.x, b.y);
            b.destroy();
          }
        });
        popCount++;
      }
    });
  }

  wrong() {
    this.showResultBg("wrong");
    this.sound.play("wrongSound");
    this.comboCount = 0;
    if (this.scoreMultiplier > 1) {
      this.scoreMultiplier--;
    }

    this.game.events.emit("update-score", this.score);
    this.game.events.emit("update-combo-multiplier", this.scoreMultiplier);
    this.game.events.emit("update-combo-count", this.comboCount);

    const sw = this.utils.gameWidth;
    const sh = this.utils.gameHeight;
    this.balloonsGroup.getChildren().forEach((b, i) => {
      // @ts-ignore
      b.body.setCollideWorldBounds(false);
      // @ts-ignore
      b.body.checkCollision.none = true;
      // @ts-ignore
      const targetX = b.x < sw / 2 ? -200 : sw + 200;
      // @ts-ignore
      const targetY = b.y < sh / 2 ? -200 : sh + 200;
      const curveX = Phaser.Math.Between(-300, 300);
      this.tweens.add({
        targets: b,
        x: targetX + curveX,
        y: targetY,
        scale: 0.2,
        angle: 100,
        duration: 500,
        ease: "Expo.offset",
        onStart: () => {
          this.sound.play("balloonDeflateSound", { volume: 0.5 });
        },
        onComplete: () => {
          b.destroy();
        },
      });
    });
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
