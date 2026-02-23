import * as Phaser from "phaser";
import { SCENES } from "../config";
import { BaseScene } from "@/core/lib/baseScene";
import type Label from "phaser3-rex-plugins/templates/ui/label/Label";

export class HUDScene extends BaseScene {
  private timerText!: Phaser.GameObjects.Text;
  private scoreValue!: Phaser.GameObjects.Text;
  private comboValue!: Phaser.GameObjects.Text;
  private comboCircles: Phaser.GameObjects.Arc[] = [];
  public leftButton!: Label;
  public rightButton!: Label;
  public equalButton!: Label;

  constructor() {
    super({ sceneKey: SCENES.HUD });
  }

  create() {
    this.comboCircles = [];

    this.createPauseBtn();
    this.createIndicatorsPanel();
    this.createControlsPanel();

    this.game.events.off("restart");
    this.game.events.on("restart", this._restartGame, this);

    this.events.once("shutdown", () => {
      this.game.events.off("restart", this._restartGame, this);
      this.game.events.off("update-score");
      this.game.events.off("update-combo-multiplier");
      this.game.events.off("update-combo-count");
      this.game.events.off("timer-update");
    });
  }

  createControlsPanel() {
    const panel = this.rexUI.add.label({
      y: this.utils.gameHeight - this.utils.bottomInset - this.utils._px(34),
      x: this.utils.gameWidth / 2,
      space: {
        left: this.utils._px(10),
        right: this.utils._px(10),
        top: this.utils._px(10),
        bottom: this.utils._px(10),
      },
      background: this.rexUI.add.roundRectangle(
        0,
        0,
        2,
        2,
        this.utils._px(24),
        0xffffff,
      ),
    });

    const sizer = this.rexUI.add.sizer({
      space: {
        item: this.utils._px(18),
      },
      orientation: "x",
    });

    this.leftButton = this.rexUI.add.label({
      width: this.utils._px(64),
      height: this.utils._px(54),
      background: this.rexUI.add.roundRectangle(
        0,
        0,
        2,
        2,
        this.utils._px(16),
        0xf0c23b,
      ),
      icon: this.add
        .image(0, 0, "arrow-left-icon")
        .setDisplaySize(this.utils._px(34), this.utils._px(34)),
      align: "center",
    });

    this.rightButton = this.rexUI.add.label({
      width: this.utils._px(64),
      height: this.utils._px(54),
      background: this.rexUI.add.roundRectangle(
        0,
        0,
        2,
        2,
        this.utils._px(16),
        0xf0c23b,
      ),
      icon: this.add
        .image(0, 0, "arrow-right-icon")
        .setDisplaySize(this.utils._px(34), this.utils._px(34)),
      align: "center",
    });

    this.equalButton = this.rexUI.add.label({
      width: this.utils._px(64),
      height: this.utils._px(54),
      background: this.rexUI.add.roundRectangle(
        0,
        0,
        2,
        2,
        this.utils._px(16),
        0xf0c23b,
      ),
      text: this.utils.createText("=", {
        style: { fontSize: this.utils._px(30) },
      }),
      align: "center",
    });

    this.leftButton
      .setInteractive()
      .on("pointerdown", () => this.game.events.emit("answer", "LEFT"));
    this.rightButton
      .setInteractive()
      .on("pointerdown", () => this.game.events.emit("answer", "RIGHT"));
    this.equalButton
      .setInteractive()
      .on("pointerdown", () => this.game.events.emit("answer", "EQUAL"));

    sizer.add(this.leftButton);
    sizer.add(this.equalButton);
    sizer.add(this.rightButton);
    sizer.layout;

    panel.add(sizer, { proportion: 1 });
    panel.setOrigin(0.5, 1);
    panel.layout();
    this.utils.animateAlpha(panel);
  }

  createIndicatorsPanel() {
    const timePanel = this._createTimePanel();
    const comboPanel = this._createComboPanel();
    const scorePanel = this._createScorePanel();

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
    top.add(timePanel, { align: "center" });
    top.add(scorePanel, { align: "center" });
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
        background: this.rexUI.add.roundRectangle(
          0,
          0,
          2,
          2,
          this.utils._px(10),
          0xffcc00,
        ),
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
      this.scene.pause(SCENES.GAME);
      this.scene.launch(SCENES.MENU);
    });
    this.utils.animateAlpha(button);
  }

  private _createScorePanel() {
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
        0xffffff,
      ),
      space: {
        left: this.utils._px(8),
        right: this.utils._px(8),
      },
    });

    const sizer = this.rexUI.add.sizer({
      orientation: "x",
    });
    const label = this.utils.createText("Score", {
      style: { color: "#000000" },
    });
    this.scoreValue = this.utils.createText("0", {
      style: { color: "#000000" },
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

  private _createTimePanel() {
    const timePanel = this.rexUI.add.label({
      background: this.rexUI.add.roundRectangle(
        0,
        0,
        2,
        2,
        this.utils._px(10),
        0xffffff,
      ),
      width: this.utils._px(100),
      height: this.utils._px(34),
      space: {
        left: this.utils._px(8),
        right: this.utils._px(8),
      },
    });
    const sizer = this.rexUI.add.sizer({ orientation: "x" });
    const label = this.utils.createText("Wagt", {
      style: { color: "#000000" },
    });
    this.timerText = this.utils.createText("01:00", {
      style: { color: "#000000" },
    });
    sizer.add(label);
    sizer.addSpace();
    sizer.add(this.timerText);
    sizer.layout();
    timePanel.add(sizer, { proportion: 1 });

    this.game.events.on("timer-update", (formattedTime: string) => {
      this.timerText.setText(formattedTime);
      timePanel.layout();
    });
    return timePanel;
  }

  private _createComboPanel() {
    const circleRadius = this.utils._px(7);
    const circleGap = this.utils._px(6);

    const comboPanel = this.rexUI.add
      .sizer({
        width: this.utils._px(138),
        height: this.utils._px(40),
        orientation: "x",
        space: {
          left: this.utils._px(10),
          right: this.utils._px(10),
          item: this.utils._px(8),
        },
      })
      .addBackground(
        this.rexUI.add.roundRectangle(0, 0, 2, 2, this.utils._px(12), 0xffffff),
      );

    const circlesSizer = this.rexUI.add.sizer({
      orientation: "x",
      space: { item: circleGap },
    });

    for (let i = 0; i < 5; i++) {
      const circle = this.add.circle(0, 0, circleRadius, 0xffffff);
      circle.setStrokeStyle(2, 0xffcc00);
      circlesSizer.add(circle);
      this.comboCircles.push(circle);
    }

    this.comboValue = this.utils.createText("1x", {
      style: { color: "#000000" },
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
        const targetColor = isFilled ? 0xffcc00 : 0xffffff;

        if (circle.fillColor !== targetColor) {
          if (isFilled) {
            this.tweens.add({
              targets: circle,
              scale: 1.3,
              duration: 100,
              yoyo: true,
              ease: "Quad.out",
              onStart: () => circle.setFillStyle(targetColor, 1),
            });
          } else {
            circle.setFillStyle(targetColor, 1);
            circle.setScale(1);
          }
        }
      });
    });

    return comboPanel;
  }

  private _restartGame() {
    this.scoreValue.setText("0");
    this.comboValue.setText("1x");
    this.timerText.setText("01:00");
    this.comboCircles.forEach((circle) => {
      circle.setFillStyle(0xffffff, 1);
      circle.setScale(1);
    });
  }
}
