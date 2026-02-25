import { SCENES } from "../config";
import { BaseScene } from "@/core/lib/baseScene";

export class GameOverScene extends BaseScene {
  constructor() {
    super({ sceneKey: SCENES.GAME_OVER });
  }

  create() {
    this.saveScore();
    const container = this.rexUI.add.sizer({
      orientation: "y",
      width: this.utils.gameWidth,
      height: this.utils.gameHeight,
      space: {
        item: this.utils._px(34),
      },
      y: this.utils.gameHeight / 2,
      x: this.utils.gameWidth / 2,
    });

    const button = this.rexUI.add.label({
      background: this.rexUI.add.roundRectangle(
        0,
        0,
        0,
        0,
        this.utils._px(16),
        this.utils._hexToDecColor("#F0C23B"),
      ),
      space: {
        top: this.utils._px(14),
        bottom: this.utils._px(14),
        left: this.utils._px(24),
        right: this.utils._px(24),
      },
      icon: this.add
        .image(0, 0, "play-icon")
        .setDisplaySize(this.utils._px(24), this.utils._px(24)),
      text: this.utils.createText("Täzeden oýna", {
        style: { fontSize: this.utils._px(18) },
      }),
      align: "center",
    });
    button.layout();
    button.setInteractive().on("pointerdown", () => {
      this.registry.set("score", 0);
      this.scene.start(SCENES.GAME);
      this.game.events.emit("restart");
    });

    const score = this.rexUI.add.label({
      background: this.rexUI.add.roundRectangle(
        0,
        0,
        0,
        0,
        this.utils._px(16),
        this.utils._hexToDecColor("#ffffff"),
      ),
    });

    const scoreContainer = this.rexUI.add.sizer({
      orientation: "x",
      space: {
        item: this.utils._px(35),
        top: this.utils._px(10),
        bottom: this.utils._px(10),
        left: this.utils._px(16),
        right: this.utils._px(16),
      },
    });

    const scoreLabel = this.utils.createText("Utuk", {
      style: { color: "#000000", fontSize: this.utils._px(24) },
    });

    const scoreValue = this.utils.createText(this.registry.get("score"), {
      style: { color: "#000000", fontSize: this.utils._px(24) },
    });

    scoreContainer.add(scoreLabel, { align: "center" });
    scoreContainer.add(scoreValue, { align: "center" });

    score.add(scoreContainer, { align: "center" });
    score.layout();

    container.addSpace();
    container.add(score, { align: "center" });
    container.add(button, { align: "center" });
    container.addSpace();
    container.layout();
  }

  async saveScore() {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}game-api/chalkboard/score`, {
        method: "POST",
        body: JSON.stringify({
          score: this.registry.get("score"),
        }),
      });
    } catch (err) {
      console.error("SAVE SCORE ERROR");
    }
  }
}
