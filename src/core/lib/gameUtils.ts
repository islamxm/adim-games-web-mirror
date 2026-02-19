export class GameUtils {
  private scene: Phaser.Scene;
  private width: number;
  private height: number;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.width = scene.cameras.main.width;
    this.height = scene.cameras.main.height;
  }

  /** показываем прелоадер или прогрессбар пока ассеты игры грузяться */
  showPreloadBar() {
    const barWidth = this.width * 0.8;
    const barHeight = 24;
    const x = (this.width - barWidth) / 2;
    const y = (this.height - barHeight) / 2;

    const bg = this.scene.add.graphics();
    bg.fillStyle(0x222222, 0.8);
    bg.fillRoundedRect(x, y, barWidth, barHeight, 10);

    const bar = this.scene.add.graphics();

    const percentText = this.scene.add
      .text(x + barWidth / 2, y - 10, "0%", {
        fontSize: "40px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 1);

    let realValue = 0;
    let visualValue = 0;

    this.scene.load.on("progress", (value: number) => {
      realValue = value;
    });

    const updateListener = () => {
      if (!bar || !bar.active || !percentText.active) return;
      visualValue = Phaser.Math.Linear(visualValue, realValue, 0.1);

      if (Math.abs(realValue - visualValue) < 0.001) {
        visualValue = realValue;
      }

      percentText.setText(Math.floor(visualValue * 100) + "%");

      bar.clear();
      if (visualValue <= 0) return;

      bar.fillStyle(0xffffff, 1);
      const currentWidth = (barWidth - 8) * visualValue;
      const height = barHeight - 8;
      const baseRadius = 6;
      const radius = Math.min(baseRadius, currentWidth / 2);

      bar.fillRoundedRect(x + 4, y + 4, currentWidth, height, radius);
    };

    this.scene.events.on("update", updateListener);

    this.scene.load.on("complete", () => {
      this.scene.tweens.add({
        targets: [bg, bar, percentText],
        alpha: 0,
        duration: 300,
        ease: "Power2",
        onComplete: () => {
          this.scene.events.off("update", updateListener);
          bg.destroy();
          bar.destroy();
          percentText.destroy();
        },
      });
    });
  }

  animatedSceneChange(targetSceneKey: string) {
    this.scene.scene.transition({
      target: targetSceneKey,
      duration: 700,
      moveBelow: false,
      onUpdate: (progress: number) => {
        const easeProgress = Phaser.Math.Easing.Expo.Out(progress);
        this.scene.cameras.main.scrollX =
          this.scene.cameras.main.width * 0.2 * easeProgress;

        const targetScene = this.scene.scene.get(targetSceneKey);
        if (targetScene && targetScene.cameras.main) {
          targetScene.cameras.main.scrollX =
            -this.scene.cameras.main.width * (1 - easeProgress);
        }
      },
    });
  }
}
