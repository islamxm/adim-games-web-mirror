import { BaseScene } from "@/core/lib/baseScene";
import { SCENES } from "../config";

export class StartScene extends BaseScene {
  constructor() {
    super({ sceneKey: SCENES.START });
  }

  create() {
    const stack = this.rexUI.add.sizer({
      x: this.utils.gameWidth / 2,
      y: this.utils.gameHeight / 2,
      width: this.utils.gameWidth,
      height: this.utils.gameHeight,
      orientation: "y",
      space: {
        item: this.utils._px(24),
        top: this.utils.topInset,
        bottom: this.utils.bottomInset,
      },
    });
    const title = this.rexUI.add.label({
      text: this.utils.createText("Pikirlenşiň tizligini barla", {
        style: { fontSize: `${this.utils._px(18)}px` },
      }),
    });
    const button = this.rexUI.add.label({
      background: this.rexUI.add.roundRectangle(
        0,
        0,
        2,
        2,
        this.utils._px(16),
        0xffcc00,
      ),
      icon: this.add
        .image(0, 0, "play-icon")
        .setDisplaySize(this.utils._px(24), this.utils._px(24)),
      text: this.utils.createText("Oýuna başla", {
        style: { fontSize: `${this.utils._px(18)}px` },
      }),
      space: {
        icon: this.utils._px(10),
        left: this.utils._px(24),
        right: this.utils._px(24),
        top: this.utils._px(14),
        bottom: this.utils._px(14),
      },
      align: "center",
    });
    const bestScore = this.rexUI.add.label({
      background: this.rexUI.add.roundRectangle(
        0,
        0,
        2,
        2,
        this.utils._px(10),
        0xffffff,
      ),
      icon: this.add
        .image(0, 0, "fire-icon")
        .setDisplaySize(this.utils._px(20), this.utils._px(20)),
      text: this.utils.createText(
        this.registry.get("top-score")?.bestScore || "0",
        {
          style: { color: "#000000" },
        },
      ),
      space: {
        icon: this.utils._px(10),
        left: this.utils._px(8),
        right: this.utils._px(8),
        top: this.utils._px(8),
        bottom: this.utils._px(8),
      },
      align: "center",
    });
    stack.addSpace();
    stack.add(title, { align: "center" });
    stack.add(button, { align: "center" });
    stack.add(bestScore, { align: "center" });
    stack.addSpace();
    stack.layout();
    button.setInteractive().on("pointerdown", () => {
      this.utils.animatedSceneChange(SCENES.TUTORIAL);
    });
  }
}
