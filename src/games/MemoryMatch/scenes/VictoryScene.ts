import { BaseScene } from "@/core/lib/baseScene";
import { SCENES } from "../config";

export class VictoryScene extends BaseScene {
  constructor() {
    super({ sceneKey: SCENES.VICTORY });
  }

  create() {
    this.createMainPanel();
    this.createBottomPanel();
    this.saveScore();
  }

  createMainPanel() {
    const container = this.rexUI.add.sizer({
      orientation: "v",
      width: this.utils.gameWidth,
      height: this.utils.gameHeight,
      x: this.utils.gameWidth / 2,
      y: this.utils.gameHeight / 2,
      space: {
        item: this.utils._px(16),
      },
    });

    const img = this.add.image(0, 0, "trophyImg");
    const title = this.utils.createText("Berekella! Siz utduňyz", {
      style: {
        fontSize: `${this.utils._px(34)}px`,
        align: "center",
        fontStyle: "bold",
      },
    });

    container.addSpace();
    container.add(img, { align: "center" });
    container.add(title, { align: "center" });
    container.addSpace();
    container.layout();
  }

  createBottomPanel() {
    const actionPanel = this.rexUI.add.sizer({
      x: this.utils.gameWidth / 2,
      y: this.utils.gameHeight / 2,
      width: this.utils.gameWidth,
      height: this.utils.gameHeight,
      orientation: "v",
      space: {
        item: this.utils._px(8),
        bottom: this.utils.bottomInset + this.utils._px(34),
      },
    });
    const startBtn = this.rexUI.add
      .label({
        y: 0,
        width: this.utils._px(300),
        height: this.utils._px(64),
        background: this.rexUI.add.roundRectangle({
          x: 0,
          y: 0,
          width: this.utils._px(300),
          height: this.utils._px(64),
          color: 0xffffff,
          radius: this.utils._px(32),
        }),
        text: this.utils.createText("Oýuna Başla", {
          style: {
            fontSize: `${this.utils._px(24)}px`,
            fontStyle: "bold",
            color: "#EC5616",
          },
        }),
        icon: this.add
          .image(0, 0, "playIcon")
          .setDisplaySize(this.utils._px(24), this.utils._px(24)),
        align: "center",
        space: {
          left: this.utils._px(22),
          right: this.utils._px(22),
          iconLeft: this.utils._px(10),
        },
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
        width: this.utils._px(300),
        height: this.utils._px(64),
        background: this.rexUI.add.roundRectangle({
          x: 0,
          y: 0,
          width: this.utils._px(300),
          height: this.utils._px(64),
          color: 0xffffff,
          radius: this.utils._px(32),
        }),
        icon: this.add
          .image(0, 0, "quitIcon")
          .setDisplaySize(this.utils._px(24), this.utils._px(24)),
        text: this.utils.createText("Oýundan Çyk", {
          style: {
            fontSize: `${this.utils._px(24)}px`,
            fontStyle: "bold",
            color: "#EC5616",
          },
        }),
        align: "center",
        space: {
          left: this.utils._px(22),
          right: this.utils._px(22),
          iconLeft: this.utils._px(10),
        },
      })
      .setInteractive()
      .onClick(() => {
        this.sound.play("click-sound");
        this.nativeBridge.close();
      })
      .setAlpha(0);
    this.tweens.add({
      targets: exitBtn,
      duration: 500,
      alpha: 1,
      delay: 200,
      ease: "Back.easeOut",
    });

    actionPanel.addSpace();
    actionPanel.add(startBtn, { align: "center" });
    actionPanel.add(exitBtn, { align: "center" });
    actionPanel.layout();
  }

  async saveScore() {}
}
