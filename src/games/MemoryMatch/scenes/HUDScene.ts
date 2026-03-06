import { BaseScene } from "@/core/lib/baseScene";
import { SCENES } from "../config";
import type Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";

export class HUDScene extends BaseScene {
  private timerText!: Phaser.GameObjects.Text;
  private scoreValue!: Phaser.GameObjects.Text;
  private comboValue!: Phaser.GameObjects.Text;

  private comboCircles: Phaser.GameObjects.Image[] = [];
  private timePanel!: Sizer;
  private scorePanel!: Sizer;
  private comboPanel!: Sizer;

  constructor() {
    super({ sceneKey: SCENES.HUD });
  }

  create() {
    this.comboCircles = [];
    this.createPauseBtn();
    this.createTimePanel();
    this.createBottomPanel();

    this.game.events.off("restart");
    this.game.events.on("restart", this.restartGame, this);

    this.events.once("shutdown", () => {
      this.game.events.off("restart", this.restartGame, this);
      this.game.events.off("update-score");
      this.game.events.off("update-combo-multiplier");
      this.game.events.off("update-combo-count");
      this.game.events.off("timer-update");
    });
  }

  createPauseBtn() {
    const button = this.rexUI.add
      .label({
        x: this.utils._px(34),
        y: this.utils.topInset + this.utils._px(34),
        background: this.add
          .image(0, 0, "icon-yellow-btn-bg")
          .setDisplaySize(this.utils._px(38), this.utils._px(38)),
        space: {
          top: this.utils._px(9),
          bottom: this.utils._px(9),
          left: this.utils._px(9),
          right: this.utils._px(9),
        },
      })
      .add(
        this.add
          .image(0, 0, "pause-icon")
          .setDisplaySize(this.utils._px(20), this.utils._px(20)),
      )
      .setOrigin(0)
      .layout();
    button.setInteractive().on("pointerdown", () => {
      this.sound.play("click-sound");
      this.scene.pause(SCENES.GAME);
      this.scene.launch(SCENES.MENU);
    });
    this.utils.animateAlpha(button);
  }

  createTimePanel() {
    const timePanel = this.rexUI.add.sizer({
      orientation: "h",
      space: {
        item: this.utils._px(5),
        top: this.utils._px(5),
        bottom: this.utils._px(5),
        left: this.utils._px(10),
        right: this.utils._px(10),
      },
      width: this.utils._px(92),
      height: this.utils._px(35),
      y: this.utils.topInset + this.utils._px(34) + this.utils._px(35) / 2,
      x: this.utils.gameWidth - this.utils._px(34),
    });
    timePanel.addBackground(
      this.rexUI.add
        .roundRectangle(0, 0, 0, 0, this.utils._px(20), 0x0a4540)
        .setStrokeStyle(this.utils._px(2), 0x0d6b5f, 1),
    );
    timePanel.add(
      this.add
        .image(0, 0, "clock-icon")
        .setDisplaySize(this.utils._px(24), this.utils._px(24)),
      { align: "center" },
    );
    this.timerText = this.utils.createText("01:00", {
      style: { fontFamily: "Nerko-One-Font", fontSize: this.utils._px(16) },
    });
    timePanel.add(this.timerText, { align: "center" });
    timePanel.setOrigin(1, 0.5);
    timePanel.layout();

    this.game.events.on("timer-update", (formattedTime: string) => {
      this.timerText.setText(formattedTime);
      timePanel.layout();
    });

    this.timePanel = timePanel;
    return timePanel;
  }

  createBottomPanel() {
    const bottomPanel = this.rexUI.add.sizer({
      orientation: "h",
      space: {
        item: this.utils._px(24),
        bottom: this.utils._px(34) + this.utils.topInset,
        left: this.utils._px(50),
        right: this.utils._px(50),
      },
      width: this.utils.gameWidth,
      height: this.utils.gameHeight,
      x: this.utils.gameWidth / 2,
      y: this.utils.gameHeight / 2,
    });

    const scorePanel = this.createScorePanel();
    const comboPanel = this.createComboPanel();
    bottomPanel.addSpace();
    bottomPanel.add(scorePanel, { align: "bottom" });
    bottomPanel.add(comboPanel, { align: "bottom" });
    bottomPanel.addSpace();
    bottomPanel.layout();
  }

  createScorePanel() {
    const scorePanel = this.rexUI.add.sizer({
      orientation: "h",
      space: {
        item: this.utils._px(5),
        top: this.utils._px(5),
        bottom: this.utils._px(5),
        left: this.utils._px(18),
        right: this.utils._px(18),
      },
      width: this.utils._px(102),
      height: this.utils._px(35),
    });
    scorePanel.addBackground(
      this.rexUI.add
        .roundRectangle(0, 0, 0, 0, this.utils._px(20), 0x0a4540)
        .setStrokeStyle(this.utils._px(2), 0x0d6b5f, 1),
    );
    scorePanel.add(
      this.utils.createText("Utuk:", {
        style: { fontFamily: "Nerko-One-Font", fontSize: this.utils._px(16) },
      }),
    );
    scorePanel.addSpace();
    this.scoreValue = this.utils.createText("0", {
      style: { fontFamily: "Nerko-One-Font", fontSize: this.utils._px(16) },
    });
    scorePanel.add(this.scoreValue, { align: "center" });
    scorePanel.layout();

    this.game.events.on("update-score", (score: number) => {
      this.scoreValue.setText(score.toString());
      scorePanel.layout();
    });

    this.scorePanel = scorePanel;
    return scorePanel;
  }

  createComboPanel() {
    const comboPanel = this.rexUI.add
      .sizer({
        width: this.utils._px(158),
        height: this.utils._px(35),
        orientation: "x",
        space: {
          left: this.utils._px(18),
          right: this.utils._px(18),
          item: this.utils._px(16),
        },
      })
      .addBackground(
        this.rexUI.add
          .roundRectangle(0, 0, 0, 0, this.utils._px(20), 0x0a4540)
          .setStrokeStyle(this.utils._px(2), 0x0d6b5f, 1),
      );

    const circlesSizer = this.rexUI.add.sizer({
      orientation: "x",
    });

    for (let i = 0; i < 5; i++) {
      const circle = this.add.image(0, 0, "combo-empty-icon");
      circlesSizer.add(circle);
      this.comboCircles.push(circle);
    }

    this.comboValue = this.utils.createText("1x", {
      style: { fontFamily: "Nerko-One-Font", fontSize: this.utils._px(16) },
    });

    comboPanel.add(circlesSizer, { align: "center" });
    comboPanel.add(this.comboValue, { align: "center" });
    comboPanel.layout();

    this.game.events.on("update-combo-multiplier", (value: number) => {
      this.comboValue.setText(`${value}x`);
    });

    this.game.events.on("update-combo-count", (value: number) => {
      this.comboCircles.forEach((circle, index) => {
        const isFilled = index < value;

        if (isFilled) {
          if (circle.texture.key !== "combo-filled-icon") {
            circle.setTexture("combo-filled-icon");
            this.tweens.add({
              targets: circle,
              scale: 1.3,
              duration: 100,
              yoyo: true,
              ease: "Quad.out",
            });
          }
        } else {
          circle.setTexture("combo-empty-icon");
          circle.setScale(1);
        }
      });
    });

    this.comboPanel = comboPanel;
    return comboPanel;
  }

  restartGame() {
    this.scoreValue.setText("0");
    this.comboValue.setText("1x");
    this.timerText.setText("01:00");

    this.timePanel.layout();
    this.scorePanel.layout();
    this.comboPanel.layout();

    this.comboCircles.forEach((circle) => {
      circle.setTexture("combo-empty-icon");
      circle.setScale(1);
    });
  }
}
