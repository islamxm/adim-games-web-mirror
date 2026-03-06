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
      .rectangle(0, 0, this.utils.gameWidth, this.utils.gameHeight, 0x81cfff)
      .setOrigin(0, 0)
      .setInteractive();

    const labels = ["Dowam Et", "Täzeden Başla", "Oýundan Çyk"];

    const btns: Array<any> = [];

    labels.forEach((label) => {
      const btn = this.rexUI.add.label({
        width: this.utils._px(248),
        height: this.utils._px(54),
        background: this.add
          .image(0, 0, "btnBigBg")
          .setDisplaySize(this.utils._px(248), this.utils._px(50)),
        space: {
          top: this.utils._px(12),
          bottom: this.utils._px(12),
          left: this.utils._px(22),
          right: this.utils._px(22),
        },
        text: this.utils.createText(label, {
          style: {
            fontSize: `${this.utils._px(24)}px`,
            color: "#FFFFFF",
            fontFamily: "Nerko-One-Font",
          },
        }),
        align: "center",
      });
      btn.layout();
      btn.setInteractive().on("pointerdown", () => {
        this.sound.play("click-sound");
        if (label === "Dowam Et") {
          this.closeMenu();
        }
        if (label === "Täzeden Başla") {
          this.closeMenu();
          this.registry.set("score", 0);
          this.game.events.emit("restart");
          this.scene.start(SCENES.GAME);
        }
        if (label === "Oýundan Çyk") {
          this.nativeBridge.close();
        }
      });
      btns.push(btn);
    });

    const container = this.rexUI.add.sizer({
      x: this.utils.gameWidth / 2,
      y: this.utils.gameHeight / 2,
      width: this.utils.gameWidth,
      height: this.utils.gameHeight,
      orientation: "y",
      space: { item: this.utils._px(20) },
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
