import * as Phaser from "phaser";

import { SCENES } from "../config";
import { GameUtils } from "@/core/lib/gameUtils";

export class MenuScene extends Phaser.Scene {
  utils!: GameUtils;

  constructor() {
    super({ key: SCENES.MENU });
  }

  preload() {
    this.utils = new GameUtils(this);
  }

  create() {
    const { width, height } = this.cameras.main;

    // Скрываем камеру в начале для плавного появления
    this.cameras.main.setAlpha(0);
    this.tweens.add({
      targets: this.cameras.main,
      alpha: 1,
      duration: 150,
    });

    // Фоновый прямоугольник, который блокирует клики под собой
    this.add
      .rectangle(0, 0, width, height, 0x1a472a)
      .setOrigin(0, 0)
      .setInteractive();

    const labels = ["Resume", "Restart", "Quit"];
    const iconMap: Record<string, string> = {
      Resume: "play-icon",
      Restart: "restart-icon",
      Quit: "quit-icon",
    };

    const buttonWidth = this.utils._px(270);
    const buttonHeight = this.utils._px(50);
    const gap = this.utils._px(10);

    const btns: Array<any> = [];

    labels.forEach((label) => {
      const btn = this.utils.createPanel(
        this.utils.createStack({
          items: [
            this.utils.createImage(iconMap[label], {
              width: this.utils._px(24),
              height: this.utils._px(24),
            }),
            this.utils.createText(label, {
              style: {
                fontSize: `${this.utils._px(18)}px`,
                color: "#FFFFFF",
              },
            }),
          ],
          gap,
          align: "center",
          justify: "start",
        }),
        {
          backgroundAlpha: 0.4,
          backgroundColor: "#000000",
          width: buttonWidth,
          height: buttonHeight,
        },
      );

      btn.on("pointerdown", () => {
        if (label === "Resume") {
          this.closeMenu();
        }
        if (label === "Restart") {
          this.closeMenu();
          this.game.events.emit("restart");
        }
        if (label === "Quit") {
          this.game.destroy(true);
          this.registry.get("quit")?.();
        }
      });
      btns.push(btn);
    });

    const container = this.utils.createStack({
      fillX: true,
      fillY: true,
      direction: "column",
      align: "center",
      justify: "center",
      gap: this.utils._px(8),
      items: btns,
    });
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
