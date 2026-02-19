import * as Phaser from "phaser";
import { SCENES } from "../config";

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.GAME_OVER });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Фон как в GameScene
    this.add.image(0, 0, "bg").setOrigin(0, 0).setDisplaySize(width, height);

    // Центрированный текст GAME OVER
    this.add
      .text(width / 2, height / 2, "GAME OVER", {
        fontSize: "48px",
        color: "#ffffff",
        fontStyle: "bold",
        fontFamily: "Open Sans, sans-serif",
      })
      .setOrigin(0.5)
      .setResolution(window.devicePixelRatio || 2);
  }
}
