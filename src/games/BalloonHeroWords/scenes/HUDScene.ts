import * as Phaser from "phaser";
import { SCENES } from "../config";
import { BaseScene } from "@/core/lib/baseScene";
import type Label from "phaser3-rex-plugins/templates/ui/label/Label";

export class HUDScene extends BaseScene {
  private timerText!: Phaser.GameObjects.Text;
  private scoreValue!: Phaser.GameObjects.Text;
  private comboValue!: Phaser.GameObjects.Text;
  private comboCircles: Phaser.GameObjects.Image[] = [];

  private valueLabel!: Label;

  constructor() {
    super({ sceneKey: SCENES.HUD });
  }

  create() {
    this.comboCircles = [];

    this.createPauseBtn();
    this.createIndicatorsPanel();
    this.createControlsPanel();

    this.game.events.off("restart");
    this.game.events.on("restart", this.restartGame, this);
    this.game.events.on("newQuestion", this.newValue, this);
    this.events.once("shutdown", () => {
      this.game.events.off("restart", this.restartGame, this);
      this.game.events.off("update-score");
      this.game.events.off("update-combo-multiplier");
      this.game.events.off("update-combo-count");
      this.game.events.off("timer-update");
      this.game.events.off("newQuestion", this.newValue, this);
    });
  }

  newValue(value: number) {
    const text = this.valueLabel.getElement("text") as Phaser.GameObjects.Text;
    text.setOrigin(0.5);
    this.valueLabel.layout();

    this.tweens.add({
      targets: text,
      scale: 0,
      duration: 50,
      ease: "Power2",
      onComplete: () => {
        text.setText(value.toString());
        this.valueLabel.layout();
        this.tweens.add({
          targets: text,
          scale: 1,
          ease: "Back.easeOut",
          duration: 100,
        });
      },
    });
  }

  createControlsPanel() {
    this.valueLabel = this.rexUI.add
      .label({
        x: this.utils.gameWidth / 2,
        y: this.utils.gameHeight - this.utils.bottomInset - this.utils._px(34),
        originY: 1,
        width: this.utils._px(248),
        height: this.utils._px(53),
        background: this.add
          .image(0, 0, "btnBigBg")
          .setDisplaySize(this.utils._px(125), this.utils._px(53)),
        text: this.utils.createText("", {
          style: {
            fontFamily: "sans-serif",
            fontSize: this.utils._px(24),
            align: "center",
          },
        }),
        align: "center",
      })
      .layout();

    this.utils.animateAlpha(this.valueLabel);
  }

  createIndicatorsPanel() {
    const timePanel = this.createTimePanel();
    const comboPanel = this.createComboPanel();
    const scorePanel = this.createScorePanel();

    const panel = this.rexUI.add
      .sizer({
        x: this.utils.gameWidth - this.utils._px(34),
        y: this.utils.topInset + this.utils._px(34),
        orientation: "v",
        space: {
          item: this.utils._px(12),
        },
      })
      .setOrigin(1, 0);

    const top = this.rexUI.add.sizer({
      orientation: "h",
      space: { item: this.utils._px(12) },
    });
    top.add(scorePanel, { align: "center" });
    top.add(timePanel, { align: "center" });
    top.layout();
    panel.add(top, { align: "right" });
    panel.add(comboPanel, { align: "right" });
    panel.layout();

    this.utils.animateAlpha(panel);
  }

  createPauseBtn() {
    const button = this.rexUI.add
      .label({
        x: this.utils._px(34),
        y: this.utils.topInset + this.utils._px(34),
        background: this.rexUI.add
          .roundRectangle(0, 0, 2, 2, this.utils._px(10), 0x75549f)
          .setStrokeStyle(this.utils._px(4), 0xd1b0fc),
        icon: this.add
          .image(0, 0, "pause-icon")
          .setDisplaySize(this.utils._px(20), this.utils._px(20)),
        space: {
          top: this.utils._px(7),
          bottom: this.utils._px(7),
          left: this.utils._px(7),
          right: this.utils._px(7),
        },
      })
      .setOrigin(0)
      .layout();
    button.setInteractive().on("pointerdown", () => {
      this.sound.play("click-sound");
      this.scene.pause(SCENES.GAME);
      this.scene.launch(SCENES.MENU);
    });
    this.utils.animateAlpha(button);
  }

  createScorePanel() {
    const scorePanel = this.rexUI.add.label({
      width: this.utils._px(93),
      height: this.utils._px(34),
      orientation: "x",
      background: this.rexUI.add.roundRectangle(
        0,
        0,
        2,
        2,
        this.utils._px(10),
        0x75549f,
      ),
      space: {
        left: this.utils._px(8),
        right: this.utils._px(8),
      },
    });

    const sizer = this.rexUI.add.sizer({
      orientation: "x",
    });
    const label = this.utils.createText("Utuk", {
      style: { fontFamily: "Nerko-One-Font" },
    });
    this.scoreValue = this.utils.createText("0", {
      style: { fontFamily: "Nerko-One-Font" },
    });
    sizer.add(label);
    sizer.addSpace();
    sizer.add(this.scoreValue);
    sizer.layout();

    scorePanel.add(sizer, { proportion: 1 });
    scorePanel.layout();

    this.game.events.on("update-score", (score: number) => {
      this.scoreValue.setText(score.toString());
      scorePanel.layout();
    });

    return scorePanel;
  }

  createTimePanel() {
    const timePanel = this.rexUI.add.sizer({
      orientation: "h",
      space: {
        item: this.utils._px(5),
        left: this.utils._px(5),
        right: this.utils._px(5),
      },
      width: this.utils._px(76),
      height: this.utils._px(34),
    });
    timePanel.addBackground(
      this.rexUI.add.roundRectangle(0, 0, 2, 2, this.utils._px(10), 0x75549f),
    );
    timePanel.add(
      this.add
        .image(0, 0, "clock-icon")
        .setDisplaySize(this.utils._px(24), this.utils._px(24)),
      { align: "center" },
    );
    this.timerText = this.utils.createText("01:00", {
      style: { fontFamily: "Nerko-One-Font" },
    });
    timePanel.add(this.timerText, { align: "center" });
    timePanel.layout();

    this.game.events.on("timer-update", (formattedTime: string) => {
      this.timerText.setText(formattedTime);
      timePanel.layout();
    });
    return timePanel;
  }

  createComboPanel() {
    const comboPanel = this.rexUI.add
      .sizer({
        width: this.utils._px(142),
        height: this.utils._px(34),
        orientation: "x",
        space: {
          left: this.utils._px(18),
          right: this.utils._px(18),
          item: this.utils._px(16),
        },
      })
      .addBackground(
        this.rexUI.add.roundRectangle(0, 0, 0, 0, this.utils._px(10), 0x75549f),
      );

    const circlesSizer = this.rexUI.add.sizer({
      orientation: "x",
    });

    for (let i = 0; i < 5; i++) {
      const circle = this.add.image(0, 0, "comboEmptyIcon");
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
          if (circle.texture.key !== "comboFilledIcon") {
            circle.setTexture("comboFilledIcon");
            this.tweens.add({
              targets: circle,
              scale: 1.3,
              duration: 100,
              yoyo: true,
              ease: "Quad.out",
            });
          }
        } else {
          circle.setTexture("comboEmptyIcon");
          circle.setScale(1);
        }
      });
    });

    // this.comboPanel = comboPanel;
    return comboPanel;
  }

  restartGame() {
    this.scoreValue.setText("0");
    this.comboValue.setText("1x");
    this.timerText.setText("01:00");
  }
}
