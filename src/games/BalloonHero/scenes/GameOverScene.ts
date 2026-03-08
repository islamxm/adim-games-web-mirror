import { BaseScene } from "@/core/lib/baseScene";
import { SCENES } from "../config";

export class GameOverScene extends BaseScene {
  constructor() {
    super({ sceneKey: SCENES.GAME_OVER });
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

    const img = this.add.image(0, 0, "gameOverImg");
    const title = this.utils.createText("Wagt gutardy", {
      style: {
        fontFamily: "Nerko-One-Font",
        fontSize: `${this.utils._px(34)}px`,
        align: "center",
      },
    });
    const score = this.utils.createText(
      `Utuk:  ${this.registry.get("score") || 0}`,
      {
        style: {
          fontFamily: "Nerko-One-Font",
          fontSize: `${this.utils._px(24)}px`,
          align: "center",
        },
      },
    );

    container.addSpace();
    container.add(img, { align: "center" });
    container.add(title, { align: "center" });
    container.add(score, { align: "center" });
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

    // const exitBtn = this.rexUI.add
    //   .label({
    //     y: this.utils.gameHeight,
    //     x: this.utils.gameWidth,
    //     width: this.utils._px(221),
    //     height: this.utils._px(53),
    //     background: this.add
    //       .image(0, 0, "btnBigBg")
    //       .setDisplaySize(this.utils._px(221), this.utils._px(53)),
    //     text: this.utils.createText("Oýundan Çyk", {
    //       style: {
    //         fontFamily: "Nerko-One-Font",
    //         align: "center",
    //         fontSize: `${this.utils._px(24)}px`,
    //       },
    //     }),
    //     align: "center",
    //   })
    //   .setInteractive()
    //   .onClick(() => {
    //     this.sound.play("click-sound");
    //     console.log("quit");
    //   })
    //   .setAlpha(0);
    // this.tweens.add({
    //   targets: exitBtn,
    //   duration: 500,
    //   alpha: 1,
    //   delay: 200,
    //   ease: "Back.easeOut",
    // });
  }

  async saveScore() {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}game-api/math-balloon/score`,
        {
          method: "POST",
          body: JSON.stringify({
            score: this.registry.get("score"),
          }),
          headers: {
            Authorization: `Bearer ${this.registry.get("gameSessionToken")}`,
          },
        },
      );
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}game-api/math-balloon/score`,
        {
          headers: {
            Authorization: `Bearer ${this.registry.get("gameSessionToken")}`,
          },
        },
      );
      const gameData = await res.json();
      this.registry.set("gameData", gameData);
    } catch (err) {
      console.error("SAVE SCORE ERROR");
    }
  }
}
