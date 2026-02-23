import type { GameObjects } from "phaser";
import { SCALE_COEF } from "../model/game";

export class GameUtils {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  get gameWidth() {
    return this.scene.cameras.main?.width;
  }

  get gameHeight() {
    return this.scene.cameras.main?.height;
  }

  get gameWindowSize() {
    return {
      width: this.gameWidth,
      height: this.gameHeight,
    };
  }

  get bounds(): {
    topInset: number;
    bottomInset: number;
    width: number;
    height: number;
  } {
    return (
      this.scene.registry.get("bounds") || {
        topInset: 0,
        bottomInset: 0,
        width: 0,
        height: 0,
      }
    );
  }

  get topInset() {
    return this.bounds.topInset * SCALE_COEF;
  }

  get bottomInset() {
    return this.bounds.bottomInset * SCALE_COEF;
  }

  /** показываем  прогрессбар пока ассеты игры грузяться, надо переделать под новый API */
  showPreloadBar() {
    const barWidth = this.gameWidth * 0.8;
    const barHeight = 48;
    const x = (this.gameWidth - barWidth) / 2;
    const y = (this.gameHeight - barHeight) / 2;

    const bg = this.scene.add.graphics();
    bg.fillStyle(0x222222, 0.8);
    bg.fillRoundedRect(x, y, barWidth, barHeight, 20);

    const bar = this.scene.add.graphics();

    const percentText = this.scene.add
      .text(x + barWidth / 2, y - 10, "0%", {
        fontSize: "80px",
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
      const baseRadius = 20;
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

  createText(
    text: string,
    options?: {
      x?: number;
      y?: number;
      style?: Phaser.Types.GameObjects.Text.TextStyle;
    },
  ): GameObjects.Text {
    const { x = 0, y = 0, style } = options || {};
    const defaultTextStyle = {
      fontSize: `${this._px(16)}px`,
      color: "#fff",
      fontStyle: "normal",
      fontFamily: "Open Sans, sans-serif",
    };
    const textObject = this.scene.add.text(x, y, text, {
      ...defaultTextStyle,
      ...style,
    });
    textObject.setResolution(SCALE_COEF);
    return textObject;
  }

  createSceneBg(imageKey: string): GameObjects.Image {
    const bg = this.scene.add
      .image(this.gameWidth / 2, this.gameHeight / 2, imageKey)
      .setOrigin(0.5, 0.5)
      .setDisplaySize(this.gameWidth, this.gameHeight);
    return bg;
  }

  _px(value: number) {
    return value * SCALE_COEF;
  }

  _getGlobalPosition(object: any) {
    const matrix = object.getWorldTransformMatrix();
    ``;
    return {
      x: matrix.tx,
      y: matrix.ty,
    };
  }

  _hexToDecColor(hex?: string) {
    const color = hex || "#ffffff";
    return Phaser.Display.Color.ValueToColor(color).color;
  }

  /** все методы для анимаций перенести в отдельный класс */
  /** дефолтная анимация смены сцены */
  animatedSceneChange(targetSceneKey: string) {
    this.scene.scene.transition({
      target: targetSceneKey,
      duration: 700,
      moveBelow: false,
      onUpdate: (progress: number) => {
        const easeProgress = Phaser.Math.Easing.Expo.Out(progress);
        // this.scene.cameras.main.scrollX =
        //   this.scene.cameras.main.width * 0.2 * easeProgress;
        this.scene.cameras.main.scrollY =
          -this.scene.cameras.main.height * easeProgress;

        const targetScene = this.scene.scene.get(targetSceneKey);
        if (targetScene && targetScene.cameras.main) {
          targetScene.cameras.main.scrollX =
            -this.scene.cameras.main.width * (1 - easeProgress);
        }
      },
    });
  }

  animateScale(object: any, onComplete?: () => void, delay: number = 300) {
    const wrapper = this.scene.add.container(
      object.x + object.width / 2,
      object.y + object.height / 2,
    );
    object.setPosition(-object.width / 2, -object.height / 2);
    wrapper.add(object);
    wrapper.setScale(0);
    this.scene.tweens.add({
      targets: wrapper,
      scale: 1,
      duration: 400,
      ease: "Back.out",
      delay,
      onComplete,
    });
  }

  animateAlpha(object: any) {
    const wrapper = this.scene.add.container(
      object.x + object.width / 2,
      object.y + object.height / 2,
    );
    object.setPosition(-object.width / 2, -object.height / 2);
    wrapper.add(object);
    wrapper.setAlpha(0);
    this.scene.tweens.add({
      targets: wrapper,
      alpha: 1,
      duration: 400,
      ease: "Back.out",
      delay: 300,
    });
  }

  animateFadeLeft(object: any, onComplete?: () => void) {
    object.setAlpha(0);
    this.scene.tweens.add({
      targets: object,
      alpha: { from: 0, to: 1 },
      x: { from: object.x - 100, to: object.x },
      duration: 600,
      ease: "Cubic.out",
      delay: 300,
      onComplete,
    });
  }

  animateFadeRight(object: any, onComplete?: () => void) {
    object.setAlpha(0);
    this.scene.tweens.add({
      targets: object,
      alpha: { from: 0, to: 1 },
      x: { from: object.x + 100, to: object.x },
      duration: 600,
      ease: "Cubic.out",
      delay: 300,
      onComplete,
    });
  }
}
