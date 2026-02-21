import * as Phaser from "phaser";
import { SCENES } from "../config";
import { BaseScene } from "@/core/lib/baseScene";

export class HUDScene extends BaseScene {
  private timerText!: Phaser.GameObjects.Text;
  private scoreValue!: Phaser.GameObjects.Text;
  private comboValue!: Phaser.GameObjects.Text;
  private comboCircles: Phaser.GameObjects.Arc[] = [];
  public leftButton!: Phaser.GameObjects.Container;
  public rightButton!: Phaser.GameObjects.Container;

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

  private _createScorePanel() {
    this.scoreValue = this.utils.createText("0", {
      style: { color: "#000000" },
    });
    this.game.events.on("update-score", (score: number) => {
      this.scoreValue.setText(score.toString());
    });
    const scorePanel = this.utils.createPanel(
      this.utils.createStack({
        direction: "row",
        gap: this.utils._px(8),
        items: [
          this.utils.createText("Score", { style: { color: "#000000" } }),
          this.scoreValue,
        ],
      }),
      {
        width: this.utils._px(93),
        height: this.utils._px(34),
        borderRadius: this.utils._px(10),
        p: [0, this.utils._px(8), 0, this.utils._px(8)],
        justify: "start",
      },
    );
    return scorePanel;
  }

  createControlsPanel() {
    const panel = this.utils.createPanel(
      this.utils.createStack({
        direction: "row",
        gap: this.utils._px(18),
        items: [
          (this.leftButton = this.utils.createPanel(
            this.utils.createImage("arrow-left-icon", {
              width: this.utils._px(34),
              height: this.utils._px(34),
            }),
            {
              width: this.utils._px(64),
              height: this.utils._px(54),
              borderRadius: this.utils._px(16),
              p: [
                this.utils._px(10),
                this.utils._px(15),
                this.utils._px(10),
                this.utils._px(15),
              ],
              backgroundColor: "#F0C23B",
              onClick: () => {
                this.game.events.emit("answer", "LEFT");
              },
            },
          )),
          this.utils.createPanel(
            this.utils.createText("=", {
              style: { fontSize: this.utils._px(24) },
            }),
            {
              width: this.utils._px(64),
              height: this.utils._px(54),
              borderRadius: this.utils._px(16),
              p: [
                this.utils._px(10),
                this.utils._px(15),
                this.utils._px(10),
                this.utils._px(15),
              ],
              backgroundColor: "#F0C23B",
              onClick: () => {
                this.game.events.emit("answer", "EQUAL");
              },
            },
          ),
          (this.rightButton = this.utils.createPanel(
            this.utils.createImage("arrow-right-icon", {
              width: this.utils._px(34),
              height: this.utils._px(34),
            }),
            {
              width: this.utils._px(64),
              height: this.utils._px(54),
              borderRadius: this.utils._px(16),
              p: [
                this.utils._px(10),
                this.utils._px(15),
                this.utils._px(10),
                this.utils._px(15),
              ],
              backgroundColor: "#F0C23B",
              onClick: () => {
                this.game.events.emit("answer", "RIGHT");
              },
            },
          )),
        ],
      }),
      {
        width: this.utils._px(248),
        height: this.utils._px(74),
        borderRadius: this.utils._px(18),
        p: [
          this.utils._px(10),
          this.utils._px(10),
          this.utils._px(10),
          this.utils._px(10),
        ],
      },
    );
    panel.x = (this.utils.gameWidth - panel.width) / 2;
    panel.y = this.utils.gameHeight - panel.height - this.utils._px(42);
    this.utils.animateScale(panel);
  }

  createIndicatorsPanel() {
    const timePanel = this._createTimePanel();
    const comboPanel = this._createComboPanel();
    const scorePanel = this._createScorePanel();
    const stack = this.utils.createStack({
      y: this.utils._px(34),
      direction: "column",
      align: "end",
      justify: "start",
      gap: this.utils._px(12),
      items: [
        this.utils.createStack({
          direction: "row",
          justify: "end",
          align: "center",
          gap: this.utils._px(12),
          items: [timePanel, scorePanel],
        }),
        comboPanel,
      ],
    });
    stack.x = this.utils.gameWidth - stack.width - this.utils._px(34);
    this.utils.animateScale(stack);
  }

  createPauseBtn() {
    const btn = this.utils.createButton(
      this.utils.createImage("pause-icon", {
        width: this.utils._px(20),
        height: this.utils._px(20),
      }),
      {
        p: [
          this.utils._px(7),
          this.utils._px(7),
          this.utils._px(7),
          this.utils._px(7),
        ],
        backgroundColor: "#F0C23B",
        borderRadius: this.utils._px(10),
        x: this.utils._px(34),
        y: this.utils._px(34),
        onClick: () => {
          this.scene.pause(SCENES.GAME);
          this.scene.launch(SCENES.MENU);
        },
      },
    );
    this.utils.animateScale(btn);
  }

  private _createTimePanel() {
    this.timerText = this.utils.createText("01:00", {
      style: { color: "#000000" },
    });

    this.game.events.on("timer-update", (formattedTime: string) => {
      this.timerText.setText(formattedTime);
    });

    const timePanel = this.utils.createPanel(
      this.utils.createStack({
        direction: "row",
        gap: this.utils._px(8),
        items: [
          this.utils.createText("Wagt", { style: { color: "#000000" } }),
          this.timerText,
        ],
      }),
      {
        width: this.utils._px(93),
        height: this.utils._px(34),
        borderRadius: this.utils._px(10),
        p: [0, this.utils._px(8), 0, this.utils._px(8)],
        justify: "start",
      },
    );
    return timePanel;
  }

  private _createComboPanel() {
    const circleRadius = this.utils._px(7);
    const circleGap = this.utils._px(6);

    const circles = [];
    for (let i = 0; i < 5; i++) {
      const circle = this.add.circle(0, 0, circleRadius, 0xffffff);
      circle.setStrokeStyle(2, 0xffcc00);
      circles.push(circle);
      this.comboCircles.push(circle);
    }

    const circlesRow = this.utils.createStack({
      direction: "row",
      gap: circleGap,
      items: circles,
    });
    circles.forEach((circle) => {
      circle.setOrigin(0.5);
      circle.x += circleRadius;
      circle.y += circleRadius;
    });

    this.comboValue = this.utils.createText("1x", {
      style: { color: "#000000" },
    });

    const contentStack = this.utils.createStack({
      direction: "row",
      gap: this.utils._px(8),
      align: "center",
      items: [circlesRow, this.comboValue],
    });

    const comboPanel = this.utils.createPanel(contentStack, {
      width: this.utils._px(138),
      height: this.utils._px(40),
      borderRadius: this.utils._px(12),
      backgroundColor: "#ffffff",
      p: [0, this.utils._px(10), 0, this.utils._px(10)],
      justify: "center",
      align: "center",
    });

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
