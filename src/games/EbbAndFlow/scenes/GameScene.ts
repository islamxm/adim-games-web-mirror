import { BaseScene } from "@/core/lib/baseScene";
import { SCENES } from "../config";
import type { GameObjects } from "phaser";

export default class GameScene extends BaseScene {
  private leafWidth: number = this.utils._px(94);
  private leafHeight: number = this.utils._px(94);
  private gap: number = this.utils._px(50);
  private speed: number = this.utils._px(2);
  private leaves!: GameObjects.Group;
  private wrapWidth!: number;
  constructor() {
    super({ sceneKey: SCENES.GAME });
  }

  create() {
    this.scene.launch(SCENES.MENU);
    const { width, height } = this.scale;

    this.rexUI.add
      .sizer({
        x: width / 2,
        y: height / 2,
        width: width,
        height: height,
        orientation: "vertical",
      })
      .layout();

    this.leaves = this.add.group();

    const cols = Math.ceil(width / (this.leafWidth + this.gap)) + 2;
    const rows = Math.ceil(height / (this.leafHeight + this.gap)) + 1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const xOffset = r % 2 === 0 ? 0 : (this.leafWidth + this.gap) / 2;

        const posX = c * (this.leafWidth + this.gap) + xOffset;
        const posY = r * (this.leafHeight + this.gap);

        const leaf = this.add.image(posX, posY, "green-leaf");
        leaf.setOrigin(0.5);

        this.leaves.add(leaf);
      }
    }

    this.wrapWidth = cols * (this.leafWidth + this.gap);
  }

  update(time: any, delta: any) {
    // @ts-ignore
    this.leaves.children.iterate((leaf: any) => {
      leaf.x -= this.speed;

      if (leaf.x < -this.leafWidth) {
        leaf.x += this.wrapWidth;
      }

      leaf.y += Math.sin(time / 1000 + leaf.x) * 0.2;
    });
  }
}
