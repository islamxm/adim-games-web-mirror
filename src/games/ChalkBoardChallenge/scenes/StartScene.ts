import { BaseScene } from "@/core/lib/baseScene";
import { SCENES } from "../config";

export class StartScene extends BaseScene {
  constructor() {
    super({ sceneKey: SCENES.START });
  }

  create() {
    this.utils.createStack({
      align: "center",
      justify: "center",
      direction: "column",
      fillX: true,
      fillY: true,
      gap: this.utils._px(24),
      items: [
        this.utils.createText("Pikirlenşiň tizligini barla", {
          style: {
            fontSize: `${this.utils._px(18)}px`,
          },
        }),
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
              this.utils.createText("Oýuna başla"),
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
              this.utils.animatedSceneChange(SCENES.TUTORIAL);
            },
          },
        ),
      ],
    });
  }
}
