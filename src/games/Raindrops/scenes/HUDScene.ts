import { BaseScene } from "@/core/lib/baseScene";
import { SCENES } from "../config";
import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";

export class HUDScene extends BaseScene {
  private scoreValue!: Phaser.GameObjects.Text;
  private scorePanel!: Sizer;

  constructor() {
    super({ sceneKey: SCENES.HUD });
  }

  create() {
    this.createPauseBtn();
  }

  createPauseBtn() {
    const button = this.rexUI.add
      .label({
        x: this.utils._px(34),
        y: this.utils.topInset + this.utils._px(34),
        background: this.add
          .image(0, 0, "icon-yellow-btn-bg")
          .setDisplaySize(this.utils._px(38), this.utils._px(38)),
        space: {
          top: this.utils._px(9),
          bottom: this.utils._px(9),
          left: this.utils._px(9),
          right: this.utils._px(9),
        },
      })
      .add(
        this.add
          .image(0, 0, "pause-icon")
          .setDisplaySize(this.utils._px(20), this.utils._px(20)),
      )
      .setOrigin(0)
      .layout();
    button.setInteractive().on("pointerdown", () => {
      this.sound.play("click-sound");
      this.scene.pause(SCENES.GAME);
      this.scene.launch(SCENES.MENU);
    });
    this.utils.animateAlpha(button);
  }

  createScorePanel() {
    const scorePanel = this.rexUI.add.sizer({
      orientation: "h",
      space: {
        item: this.utils._px(5),
        top: this.utils._px(5),
        bottom: this.utils._px(5),
        left: this.utils._px(18),
        right: this.utils._px(18),
      },
      width: this.utils._px(102),
      height: this.utils._px(35),
    });
    scorePanel.addBackground(
      this.rexUI.add
        .roundRectangle(0, 0, 0, 0, this.utils._px(20), 0x0a4540)
        .setStrokeStyle(this.utils._px(2), 0x0d6b5f, 1),
    );
    scorePanel.add(
      this.utils.createText("Utuk:", {
        style: { fontFamily: "Nerko-One-Font", fontSize: this.utils._px(16) },
      }),
    );
    scorePanel.addSpace();
    this.scoreValue = this.utils.createText("0", {
      style: { fontFamily: "Nerko-One-Font", fontSize: this.utils._px(16) },
    });
    scorePanel.add(this.scoreValue, { align: "center" });
    scorePanel.layout();

    this.game.events.on("update-score", (score: number) => {
      this.scoreValue.setText(score.toString());
      scorePanel.layout();
    });

    this.scorePanel = scorePanel;
    return scorePanel;
  }
}
