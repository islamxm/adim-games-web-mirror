import * as Phaser from "phaser";
import { GameUtils } from "@/core/lib/gameUtils";
import { SCENES } from "../config";

export class HUDScene extends Phaser.Scene {
  private utils!: GameUtils;
  private timerText!: Phaser.GameObjects.Text;
  private scoreValue!: Phaser.GameObjects.Text;
  private comboValue!: Phaser.GameObjects.Text;
  private comboCircles: Phaser.GameObjects.Arc[] = [];

  constructor() {
    super({ key: SCENES.HUD });
  }

  preload() {
    this.utils = new GameUtils(this);
  }

  create() {
    this._createPauseBtn();
    this._createScorePanel();
    this._createTimePanel();
    this._createComboPanel();
    this._createControls();
  }

  /** плашка очков */
  private _createScorePanel() {
    const { width } = this.cameras.main;
    const padding = 20;
    const widgetW = 93;
    const widgetH = 34;

    const x = width - padding - widgetW / 2;
    const y = 40;

    const bg = this.add.graphics();
    bg.fillStyle(0xffffff);
    bg.fillRoundedRect(-widgetW / 2, -widgetH / 2, widgetW, widgetH, 10);

    const labelStyle = {
      fontSize: "14px",
      color: "#000000",
      fontFamily: "sans-serif",
    };

    const scoreLabel = this.add
      .text(-widgetW / 2 + 8, 0, "Score", labelStyle)
      .setOrigin(0, 0.5);
    this.scoreValue = this.add
      .text(widgetW / 2 - 8, 0, "0", labelStyle)
      .setOrigin(1, 0.5);

    this.add.container(x, y, [bg, scoreLabel, this.scoreValue]);

    this.game.events.on("update-score", (score: number) => {
      this.scoreValue.setText(score.toString());
    });
  }

  /** плашка времени игры */
  private _createTimePanel() {
    const { width } = this.cameras.main;
    const padding = 20;
    const widgetW = 93;
    const widgetH = 34;
    const gap = 12;

    // Time (Wagt) слева от Score
    const x = width - padding - widgetW - gap - widgetW / 2;
    const y = 40;

    const bg = this.add.graphics();
    bg.fillStyle(0xffffff);
    bg.fillRoundedRect(-widgetW / 2, -widgetH / 2, widgetW, widgetH, 10);

    const labelStyle = {
      fontSize: "14px",
      color: "#000000",
      fontFamily: "sans-serif",
    };

    const timeLabel = this.add
      .text(-widgetW / 2 + 8, 0, "Wagt", labelStyle)
      .setOrigin(0, 0.5);
    this.timerText = this.add
      .text(widgetW / 2 - 8, 0, "01:00", labelStyle)
      .setOrigin(1, 0.5);

    this.add.container(x, y, [bg, timeLabel, this.timerText]);

    this.game.events.on("timer-update", (formattedTime: string) => {
      this.timerText.setText(formattedTime);
    });
  }

  /** плашка панели комбо */
  private _createComboPanel() {
    const { width } = this.cameras.main;
    const padding = 20;
    const widgetW = 138;
    const widgetH = 34;
    const gapY = 12;

    const x = width - padding - widgetW / 2;
    const y = 40 + 17 + gapY + widgetH / 2;

    const bg = this.add.graphics();
    bg.fillStyle(0xffffff);
    bg.fillRoundedRect(-widgetW / 2, -widgetH / 2, widgetW, widgetH, 10);

    const circlesContainer = this.add.container(-widgetW / 2 + 15, 0);
    const circleRadius = 6;
    const circleGap = 16;

    for (let i = 0; i < 5; i++) {
      const circle = this.add.circle(i * circleGap, 0, circleRadius, 0xffffff);
      circle.setStrokeStyle(2, 0xffcc00);
      circlesContainer.add(circle);
      this.comboCircles.push(circle);
    }

    const multiplierStyle = {
      fontSize: "14px",
      color: "#000000",
      fontFamily: "sans-serif",
    };

    this.comboValue = this.add
      .text(widgetW / 2 - 8, 0, "1x", multiplierStyle)
      .setOrigin(1, 0.5);

    this.add.container(x, y, [bg, circlesContainer, this.comboValue]);

    this.game.events.on("update-combo-multiplier", (value: number) => {
      this.comboValue.setText(`${value}x`);
    });
    this.game.events.on("update-combo-count", (value: number) => {
      this.comboCircles.forEach((circle, index) => {
        const isFilled = index < value;
        const targetColor = isFilled ? 0xffcc00 : 0xffffff;

        if (circle.fillColor !== targetColor) {
          if (isFilled) {
            // Анимация пульсации при заполнении
            this.tweens.add({
              targets: circle,
              scale: 1.3,
              duration: 100,
              yoyo: true,
              ease: "Quad.out",
              onStart: () => circle.setFillStyle(targetColor, 1),
            });
          } else {
            // Мгновенный сброс
            circle.setFillStyle(targetColor, 1);
            circle.setScale(1);
          }
        }
      });
    });
  }

  /** плашка элементов управления */
  _createControls() {
    const { width, height } = this.cameras.main;

    const panelW = 248;
    const panelH = 74;
    const btnW = 64;
    const btnH = 54;
    const btnGap = 18;

    const panel = this.add.graphics();
    panel.fillStyle(0xffffff, 1);
    panel.fillRoundedRect(-panelW / 2, -panelH / 2, panelW, panelH, 18);

    const totalW = btnW * 3 + btnGap * 2;
    const startX = -totalW / 2;

    const leftBtnCenterX = startX + btnW / 2;
    const centerBtnCenterX = startX + btnW + btnGap + btnW / 2;
    const rightBtnCenterX = startX + (btnW + btnGap) * 2 + btnW / 2;

    const leftBtn = this.add.graphics();
    leftBtn.fillStyle(0xffcc00, 1);
    leftBtn.fillRoundedRect(startX, -btnH / 2, btnW, btnH, 16);
    leftBtn.setInteractive(
      new Phaser.Geom.Rectangle(startX, -btnH / 2, btnW, btnH),
      Phaser.Geom.Rectangle.Contains,
    );

    const centerBtn = this.add.graphics();
    centerBtn.fillStyle(0xffcc00, 1);
    centerBtn.fillRoundedRect(
      startX + btnW + btnGap,
      -btnH / 2,
      btnW,
      btnH,
      16,
    );
    centerBtn.setInteractive(
      new Phaser.Geom.Rectangle(startX + btnW + btnGap, -btnH / 2, btnW, btnH),
      Phaser.Geom.Rectangle.Contains,
    );

    const rightBtn = this.add.graphics();
    rightBtn.fillStyle(0xffcc00, 1);
    rightBtn.fillRoundedRect(
      startX + (btnW + btnGap) * 2,
      -btnH / 2,
      btnW,
      btnH,
      16,
    );
    rightBtn.setInteractive(
      new Phaser.Geom.Rectangle(
        startX + (btnW + btnGap) * 2,
        -btnH / 2,
        btnW,
        btnH,
      ),
      Phaser.Geom.Rectangle.Contains,
    );

    const leftIcon = this.add.image(leftBtnCenterX, 0, "left-arrow-icon");
    leftIcon.setDisplaySize(34, 34);

    const equalText = this.add
      .text(centerBtnCenterX, 0, "=", {
        fontSize: "30px",
        color: "#ffffff",
        fontFamily: "sans-serif",
      })
      .setOrigin(0.5);

    const rightIcon = this.add.image(rightBtnCenterX, 0, "right-arrow-icon");
    rightIcon.setDisplaySize(34, 34);

    const controlsContainer = this.add.container(
      width / 2,
      height - 48 - panelH / 2,
      [panel, leftBtn, centerBtn, rightBtn, leftIcon, equalText, rightIcon],
    );

    controlsContainer.setScale(0);
    this.tweens.add({
      targets: controlsContainer,
      scale: 1,
      duration: 400,
      ease: "Back.out",
      delay: 300,
    });

    leftBtn.on("pointerdown", () => {
      this.game.events.emit("answer", "left");
    });

    centerBtn.on("pointerdown", () => {
      this.game.events.emit("answer", "equal");
    });

    rightBtn.on("pointerdown", () => {
      this.game.events.emit("answer", "right");
    });
  }

  /** кнопка паузы */
  _createPauseBtn() {
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0xffcc00, 1);
    btnBg.fillRoundedRect(-17, -17, 34, 34, 8);

    const icon = this.add.image(0, 0, "pause-icon");
    icon.setDisplaySize(20, 20);

    const pauseBtn = this.add.container(40, 40, [btnBg, icon]);

    pauseBtn.setSize(34, 34);
    pauseBtn.setInteractive({ useHandCursor: true });

    pauseBtn.setScale(0);
    this.tweens.add({
      targets: pauseBtn,
      scale: 1,
      duration: 400,
      ease: "Back.out",
      delay: 300,
    });
    pauseBtn.on("pointerdown", () => {
      this.scene.pause(SCENES.GAME);
      this.scene.launch(SCENES.MENU);
    });
  }
}
