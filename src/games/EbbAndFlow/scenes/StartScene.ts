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
        item: this.utils._px(34),
        left: this.utils._px(34),
        right: this.utils._px(34),
      },
    });

    const scorePanel = this.rexUI.add.sizer({
      width: this.utils.gameWidth - this.utils._px(34 * 2),
      height: this.utils._px(104),
      orientation: "h",
      space: {
        left: this.utils._px(10),
        right: this.utils._px(24),
      },
    });
    scorePanel.addBackground(
      this.rexUI.add
        .roundRectangle(0, 0, 0, 0, this.utils._px(20), 0x0a4540)
        .setStrokeStyle(this.utils._px(2), 0x0d6b5f, 1),
    );
    scorePanel.add(
      this.add
        .image(0, 0, "top-score-icon")
        .setDisplaySize(this.utils._px(100), this.utils._px(100)),
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
          this.utils.createText("IŇ ÝOKARY NETIJE", {
            style: {
              fontFamily: "Nerko-One-Font",
              fontSize: this.utils._px(14),
              color: "#46ECD5",
            },
          }),
          { align: "left" },
        )
        .add(
          this.utils.createText(this.registry.get("top-score"), {
            style: {
              fontFamily: "Nerko-One-Font",
              fontSize: this.utils._px(36),
              color: "#ffffff",
            },
          }),
          { align: "left" },
        ),
    );
    const title = this.utils.createText("Öz reaksiýaň tizligini artdyr!", {
      style: {
        fontSize: this.utils._px(24),
        align: "center",
        fontFamily: "Nerko-One-Font",
      },
    });

    container.addSpace();
    container.add(scorePanel, { align: "center" });
    container.add(title, { align: "center" });
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
      width: this.utils._px(150),
      height: this.utils._px(54),
      background: this.add
        .image(0, 0, "short-yellow-btn-bg")
        .setDisplaySize(this.utils._px(150), this.utils._px(54)),
      text: this.utils.createText("BAŞLA", {
        style: {
          fontSize: `${this.utils._px(24)}px`,
          align: "center",
          fontFamily: "Nerko-One-Font",
        },
      }),
      align: "center",
      space: {
        top: this.utils._px(12),
        bottom: this.utils._px(12),
        left: this.utils._px(12),
        right: this.utils._px(12),
      },
    });
    button.layout();
    button.setInteractive();
    button.on("pointerdown", () => {
      this.sound.play("click-sound");
      this.utils.animatedSceneChange(SCENES.TUTORIAL);
    });
  }
}
