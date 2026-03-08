import { BaseScene } from "@/core/lib/baseScene";
import { SCENES } from "../config";
import type Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";

export class HUDScene extends BaseScene {
  private timerText!: Phaser.GameObjects.Text;
  private timePanel!: Sizer;

  constructor() {
    super({ sceneKey: SCENES.HUD });
  }

  create() {
    this.createPauseBtn();
    this.createTimePanel();

    this.game.events.off("restart");
    this.game.events.on("restart", this.restartGame, this);
    this.game.events.on("more-sec", this.addSeconds, this);

    this.events.once("shutdown", () => {
      this.game.events.off("restart", this.restartGame, this);
      this.game.events.off("more-sec", this.addSeconds, this);
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
        background: this.rexUI.add.roundRectangle({
          width: this.utils._px(34),
          height: this.utils._px(34),
          radius: this.utils._px(10),
          color: 0xf3ca00,
        }),
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

  addSeconds(value: number) {
    if (!this.timePanel) return;

    console.log(this.timePanel.getBounds().y);

    const secLabel = this.rexUI.add.label({
      x: this.timePanel.x,
      y: this.timePanel.getBounds().y * 2,
      text: this.utils.createText(`+${value}`, {
        style: {
          color: "#00E608",
          fontSize: this.utils._px(24),
          fontFamily: "Nerko-One-Font",
        },
      }),
      align: "center",
    });
    secLabel.setAlpha(0);
    secLabel.layout();
    this.timePanel.pinLocal(secLabel);

    this.tweens.chain({
      targets: secLabel,
      tweens: [
        { duration: 200, alpha: 1, ease: "Power1.easeOut" },
        {
          duration: 500,
          y: this.timePanel.getBounds().y,
          alpha: 0,
          delay: 500,
          ease: "Cubic.easeIn",
        },
      ],
      onComplete: () => {
        this.timePanel.remove(secLabel);
        secLabel.destroy();
      },
    });
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
      this.rexUI.add.roundRectangle(0, 0, 0, 0, this.utils._px(20), 0xf3ca00),
    );
    timePanel.add(
      this.add
        .image(0, 0, "clock-icon")
        .setDisplaySize(this.utils._px(24), this.utils._px(24)),
      { align: "center" },
    );
    this.timerText = this.utils.createText("00:40", {
      style: { fontSize: this.utils._px(16) },
    });
    timePanel.add(this.timerText, { align: "center" });
    timePanel.setOrigin(1, 0.5);
    timePanel.layout();

    this.game.events.on("timer-update", (formattedTime: string) => {
      this.timerText.setText(formattedTime);
      timePanel.layout();
    });
    this.timePanel = timePanel;
    this.utils.animateAlpha(timePanel);
    return timePanel;
  }

  restartGame() {
    this.timerText.setText("01:00");
    this.timePanel.layout();
  }
}
