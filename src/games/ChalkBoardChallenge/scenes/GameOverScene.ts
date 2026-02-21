import * as Phaser from "phaser";
import { SCENES } from "../config";
import { BaseScene } from "@/core/lib/baseScene";

export class GameOverScene extends BaseScene {
  constructor() {
    super({ sceneKey: SCENES.GAME_OVER });
  }

  create() {
    this.utils.createSceneBg("bg");
    this.utils.createStack({
      fillX: true,
      fillY: true,
      justify: "center",
      align: "center",
      direction: "column",
      gap: this.utils._px(34),
      items: [
        this.utils.createPanel(
          this.utils.createStack({
            direction: "row",
            align: "center",
            items: [
              this.utils.createText("Score ", {
                style: {
                  fontSize: this.utils._px(24),
                  color: "#000000",
                },
              }),
              this.utils.createText(this.registry.get("score"), {
                style: {
                  fontSize: this.utils._px(24),
                  color: "#000000",
                },
              }),
            ],
          }),
          {
            p: [
              this.utils._px(10),
              this.utils._px(16),
              this.utils._px(10),
              this.utils._px(16),
            ],
            borderRadius: this.utils._px(10),
          },
        ),
        this.utils.createButton(
          this.utils.createStack({
            direction: "row",
            align: "center",
            justify: "center",
            gap: this.utils._px(10),
            items: [
              this.utils.createImage("play-icon", {
                height: this.utils._px(24),
                width: this.utils._px(24),
              }),
              this.utils.createText("Täzeden oýna"),
            ],
          }),
          {
            p: [
              this.utils._px(14),
              this.utils._px(24),
              this.utils._px(14),
              this.utils._px(24),
            ],
            backgroundColor: "#ffcc00",
            borderRadius: this.utils._px(16),
            align: "center",
            justify: "center",
            onClick: () => {
              this.registry.set("score", 0);
              this.scene.start(SCENES.GAME);
              this.game.events.emit("restart");
            },
          },
        ),
      ],
    });
  }
}
