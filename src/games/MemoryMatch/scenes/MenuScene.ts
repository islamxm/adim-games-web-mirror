import { SCENES } from "../config";
import { BaseScene } from "@/core/lib/baseScene";

export class MenuScene extends BaseScene {
  constructor() {
    super({ sceneKey: SCENES.MENU });
  }

  create() {
    this.cameras.main.setAlpha(0);
    this.tweens.add({
      targets: this.cameras.main,
      alpha: 1,
      duration: 150,
    });

    this.add
      .rectangle(0, 0, this.utils.gameWidth, this.utils.gameHeight, 0xec5616)
      .setOrigin(0, 0)
      .setInteractive();

    const labelsMap = {
      continue: {
        label: "Dowam Et",
        iconKey: "playIcon",
        action: () => {
          this.closeMenu();
        },
      },
      retart: {
        label: "Täzeden Başla",
        iconKey: "restartIcon",
        action: () => {
          this.closeMenu();
          this.registry.set("score", 0);
          this.game.events.emit("restart");
          this.scene.start(SCENES.GAME);
        },
      },
      quit: {
        label: "Oýundan Çyk",
        iconKey: "quitIcon",
        action: () => {
          this.nativeBridge.close();
        },
      },
    };

    const btns: Array<any> = [];

    Object.entries(labelsMap).forEach((item) => {
      const key = item[0] as keyof typeof labelsMap;
      const { iconKey, label } = item[1];

      const btn = this.rexUI.add.label({
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
        space: {
          // top: this.utils._px(12),
          // bottom: this.utils._px(12),
          left: this.utils._px(22),
          right: this.utils._px(22),
          iconLeft: this.utils._px(10),
        },
        icon: this.add
          .image(0, 0, iconKey)
          .setDisplaySize(this.utils._px(24), this.utils._px(24)),
        text: this.utils.createText(label, {
          style: {
            fontSize: `${this.utils._px(24)}px`,
            fontStyle: "bold",
            color: "#EC5616",
          },
        }),
        align: "left",
      });
      btn.layout();
      btn.setInteractive().on("pointerdown", () => {
        this.sound.play("click-sound");
        labelsMap[key].action();
      });
      btns.push(btn);
    });

    const container = this.rexUI.add.sizer({
      x: this.utils.gameWidth / 2,
      y: this.utils.gameHeight / 2,
      width: this.utils.gameWidth,
      height: this.utils.gameHeight,
      orientation: "y",
      space: { item: this.utils._px(16) },
    });
    container.addSpace();
    btns.forEach((btn) => container.add(btn, { align: "center" }));
    container.addSpace();
    container.layout();
  }

  private closeMenu() {
    this.tweens.add({
      targets: this.cameras.main,
      alpha: 0,
      duration: 150,
      onComplete: () => {
        this.scene.resume(SCENES.GAME);
        this.scene.stop();
      },
    });
  }
}
