import { BaseScene } from "@/core/lib/baseScene";
import { SCENES } from "../config";

export class StartScene extends BaseScene {
  constructor() {
    super({ sceneKey: SCENES.START });
  }

  create() {
    const container = this.rexUI.add.sizer({
      height: this.utils.gameHeight,
      width: this.utils.gameWidth,
      x: this.utils.gameWidth / 2,
      y: this.utils.gameHeight / 2,
      orientation: "v",
      space: {
        top: this.utils.topInset,
        bottom: this.utils.bottomInset + this.utils._px(34),
      },
    });

    const centerBalloon = this.rexUI.add.label({
      x: 0,
      y: 0,
      width: this.utils._px(91 + 50),
      height: this.utils._px(166 + 100),
      align: "center",
      background: this.add
        .image(0, 0, "balloonImg")
        .setDisplaySize(this.utils._px(91 + 50), this.utils._px(166 + 100)),
      text: this.utils.createText(
        `Ýokary\nnetije\n${this.registry.get("gameData")?.bestScore || 0}`,
        {
          style: {
            align: "center",
            fontFamily: "Nerko-One-Font",
            fontSize: this.utils._px(24),
          },
        },
      ),
      space: {
        top: this.utils._px(-70),
      },
    });
    centerBalloon.setScale(0.1);
    this.tweens.add({
      targets: centerBalloon,
      delay: 100,
      duration: 500,
      ease: "Back.easeOut",
      scale: 1,
    });

    const actionPanel = this.rexUI.add.sizer({
      x: 0,
      y: 0,
      width: this.utils.gameWidth,
      orientation: "v",
      space: {
        item: this.utils._px(8),
      },
    });

    const startBtn = this.rexUI.add
      .label({
        y: this.utils.gameHeight,
        x: this.utils.gameWidth,
        width: this.utils._px(221),
        height: this.utils._px(53),
        background: this.add
          .image(0, 0, "btnBigBg")
          .setDisplaySize(this.utils._px(221), this.utils._px(53)),
        text: this.utils.createText("Oýuna Başla", {
          style: {
            fontFamily: "Nerko-One-Font",
            align: "center",
            fontSize: `${this.utils._px(24)}px`,
          },
        }),
        align: "center",
      })
      .setInteractive()
      .onClick(() => {
        this.sound.play("click-sound");
        this.utils.animatedSceneChange(SCENES.GAME);
      })
      .setAlpha(0);
    this.tweens.add({
      targets: startBtn,
      duration: 500,
      alpha: 1,
      delay: 100,
      ease: "Back.easeOut",
    });

    const exitBtn = this.rexUI.add
      .label({
        y: this.utils.gameHeight,
        x: this.utils.gameWidth,
        width: this.utils._px(221),
        height: this.utils._px(53),
        background: this.add
          .image(0, 0, "btnBigBg")
          .setDisplaySize(this.utils._px(221), this.utils._px(53)),
        text: this.utils.createText("Oýundan Çyk", {
          style: {
            fontFamily: "Nerko-One-Font",
            align: "center",
            fontSize: `${this.utils._px(24)}px`,
          },
        }),
        align: "center",
      })
      .setInteractive()
      .onClick(() => {
        this.sound.play("click-sound");
        this.registry.get("quit")?.();
      })
      .setAlpha(0);
    this.tweens.add({
      targets: exitBtn,
      duration: 500,
      alpha: 1,
      delay: 200,
      ease: "Back.easeOut",
    });

    actionPanel.add(startBtn, { align: "center" });
    actionPanel.add(exitBtn, { align: "center" });

    container.addSpace();
    container.add(centerBalloon, { align: "center" });
    container.addSpace();
    container.add(actionPanel, { align: "center" });
    container.layout();
  }
}
