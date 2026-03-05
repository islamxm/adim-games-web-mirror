import { BaseScene } from "@/core/lib/baseScene";
import { SCENES } from "../config";

export class BackgroundScene extends BaseScene {
  constructor() {
    super({ sceneKey: SCENES.BACKGROUND });
  }

  create() {
    this.utils.createSceneBg("bg");

    const cloudsCount = 4;
    const zoneHeight = this.utils.gameHeight / cloudsCount;

    for (let i = 0; i < cloudsCount; i++) {
      const y = zoneHeight * i + zoneHeight / 2;
      const x = Phaser.Math.Between(
        this.utils._px(100),
        this.utils.gameWidth - this.utils._px(100),
      );
      const cloud = this.add.image(x, y, "cloud");
      const scale = Phaser.Math.FloatBetween(0.7, 1.3);
      cloud.setScale(scale);
      cloud.setAlpha(Phaser.Math.FloatBetween(0.5, 0.8));

      const speedFactor = scale * 100;

      this.tweens.add({
        targets: cloud,
        x: x + Phaser.Math.Between(-speedFactor, speedFactor),
        duration: Phaser.Math.Between(3000, 5000),
        ease: "Sine.easeInOut",
        yoyo: true,
        repeat: -1,
      });

      this.tweens.add({
        targets: cloud,
        y: y + Phaser.Math.Between(-this.utils._px(10), this.utils._px(10)),
        duration: Phaser.Math.Between(3000, 5000),
        ease: "Sine.easeInOut",
        yoyo: true,
        repeat: -1,
      });
    }
  }
}
