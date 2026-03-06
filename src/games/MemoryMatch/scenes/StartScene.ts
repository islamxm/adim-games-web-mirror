import { BaseScene } from "@/core/lib/baseScene";
import { SCENES } from "../config";

export class StartScene extends BaseScene {
  constructor() {
    super({ sceneKey: SCENES.START });
  }

  create() {
    this.createMainPanel();
    this.createStartButton();
  }

  createMainPanel() {
    const container = this.rexUI.add.sizer({
      orientation: "y",
      width: this.utils.gameWidth,
      height: this.utils.gameHeight,
      x: this.utils.gameWidth / 2,
      y: this.utils.gameHeight / 2,
      space: {
        item: this.utils._px(24),
        // left: this.utils._px(34),
        // right: this.utils._px(34),
      },
    });

    const title = this.utils.createText("Beýniňi türgenleşdir", {
      style: {
        fontSize: this.utils._px(34),
        align: "center",
        fontStyle: "bold",
      },
    });

    const scorePanel = this.rexUI.add.sizer({
      width: this.utils._px(128),
      height: this.utils._px(65),
      orientation: "h",
      space: {
        item: this.utils._px(12),
        left: this.utils._px(10),
        right: this.utils._px(10),
      },
    });
    scorePanel.addBackground(
      this.rexUI.add
        .roundRectangle(0, 0, 0, 0, this.utils._px(18), 0xffffff, 0.2)
        .setStrokeStyle(this.utils._px(1), 0xffdf20, 1),
    );
    scorePanel.add(
      this.add
        .image(0, 0, "topScoreIcon")
        .setDisplaySize(this.utils._px(28), this.utils._px(28)),
    );
    scorePanel.add(
      this.rexUI.add
        .sizer({
          orientation: "v",
          space: {
            item: this.utils._px(2),
          },
        })
        .add(
          this.utils.createText("Rekord", {
            style: {
              fontSize: this.utils._px(12),
              color: "#FFF085",
            },
          }),
          { align: "left" },
        )
        .add(
          this.utils.createText(
            this.registry.get("gameData")?.bestScore || "0",
            {
              style: {
                fontSize: this.utils._px(18),
                color: "#ffffff",
                fontStyle: "bold",
              },
            },
          ),
          { align: "left" },
        ),
    );

    container.addSpace();
    container.add(title, { align: "center" });
    container.add(scorePanel, { align: "center" });
    container.addSpace();
    container.layout();
  }

  createStartButton() {
    const button = this.rexUI.add.label({
      y:
        this.utils.gameHeight -
        this.utils._px(54) / 2 -
        this.utils.bottomInset -
        this.utils._px(60),
      x: this.utils.gameWidth / 2,
      width: this.utils._px(272),
      height: this.utils._px(64),
      background: this.rexUI.add.roundRectangle({
        x: 0,
        y: 0,
        width: this.utils._px(272),
        height: this.utils._px(64),
        color: 0xffffff,
        radius: this.utils._px(32),
      }),
      text: this.utils.createText("Oýuna Başla", {
        style: {
          fontSize: `${this.utils._px(24)}px`,
          align: "center",
          fontStyle: "bold",
          color: "#F54900",
        },
      }),
      icon: this.add
        .image(0, 0, "playIcon")
        .setDisplaySize(this.utils._px(24), this.utils._px(24)),
      align: "center",
      space: {
        iconLeft: this.utils._px(10),
      },
    });
    button.layout();
    button.setInteractive();
    button.on("pointerdown", () => {
      this.sound.play("click-sound");
      // const isFirstTime = this.registry.get("gameData")?.lastScore === 0;
      // if (isFirstTime) {
      //   this.utils.animatedSceneChange(SCENES.TUTORIAL);
      // } else {
      //   this.utils.animatedSceneChange(SCENES.GAME);
      // }
      this.utils.animatedSceneChange(SCENES.GAME);
    });
  }
}
