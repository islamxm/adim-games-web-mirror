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
      .rectangle(0, 0, this.utils.gameWidth, this.utils.gameHeight, 0x1a472a)
      .setOrigin(0, 0)
      .setInteractive();

    const labels = ["Resume", "Restart", "Quit"];
    const iconMap: Record<string, string> = {
      Resume: "play-icon",
      Restart: "restart-icon",
      Quit: "quit-icon",
    };

    const btns: Array<any> = [];

    labels.forEach((label) => {
      const btn = this.rexUI.add.label({
        width: this.utils._px(270),
        background: this.rexUI.add
          .roundRectangle(0, 0, 0, 0, 0, this.utils._hexToDecColor("#000000"))
          .setAlpha(0.4),
        space: {
          iconLeft: this.utils._px(16),
          top: this.utils._px(12),
          bottom: this.utils._px(12),
          left: this.utils._px(16),
          right: this.utils._px(16),
        },
        icon: this.add
          .image(0, 0, iconMap[label])
          .setDisplaySize(this.utils._px(24), this.utils._px(24)),
        text: this.utils.createText(label, {
          style: { fontSize: `${this.utils._px(18)}px`, color: "#FFFFFF" },
        }),
        align: "left",
      });
      btn.layout();
      btn.setInteractive().on("pointerdown", () => {
        this.sound.play("click-sound");
        if (label === "Resume") {
          this.closeMenu();
        }
        if (label === "Restart") {
          this.closeMenu();
          this.registry.set("score", 0);
          this.scene.start(SCENES.GAME);
          this.game.events.emit("restart");
        }
        if (label === "Quit") {
          this.game.destroy(true);
          this.registry.get("quit")?.();
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
      space: { item: this.utils._px(8) },
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
