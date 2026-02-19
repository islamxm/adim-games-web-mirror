import * as Phaser from "phaser";
import { GameUtils } from "@/core/lib/gameUtils";
import { SCENES } from "../config";

export class TutorialScene extends Phaser.Scene {
  private utils!: GameUtils;

  constructor() {
    super({ key: SCENES.TUTORIAL });
  }

  preload() {
    this.utils = new GameUtils(this);
  }

  create() {
    const { width, height } = this.cameras.main;

    this.add.image(0, 0, "bg").setOrigin(0, 0).setDisplaySize(width, height);

    this.add
      .text(width / 2, height / 2 - 60, "ChalkBoard Challenge", {
        fontSize: "28px",
        color: "#ffffff",
        fontStyle: "bold",
        fontFamily: "sans-serif",
      })
      .setOrigin(0.5, 1);

    this._createStartBtn();
  }

  private _createStartBtn() {
    const { width, height } = this.cameras.main;
    const btnW = 200;
    const btnH = 60;

    const bg = this.add.graphics();
    bg.fillStyle(0xffcc00, 1);
    bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 15);

    const txt = this.add
      .text(0, 0, "START", {
        fontSize: "24px",
        color: "#ffffff",
        fontStyle: "bold",
        fontFamily: "sans-serif",
      })
      .setOrigin(0.5);

    const btn = this.add.container(width / 2, height / 2, [bg, txt]);
    btn.setSize(btnW, btnH);
    btn.setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => btn.setScale(1.05));
    btn.on("pointerout", () => btn.setScale(1));
    btn.on("pointerdown", () => {
      this.utils.animatedSceneChange(SCENES.GAME);
    });

    btn.setScale(0);
    this.tweens.add({
      targets: btn,
      scale: 1,
      duration: 500,
      ease: "Back.out",
      delay: 200,
    });
  }
}
