import { GameUtils } from "./gameUtils";
import clickSound from "../../assets/click-sound.mp3";
import tickSound from "../../assets/tick-sound.wav";
import clockIcon from "../../assets/clock-icon.png";
import pauseIcon from "../../assets/pause-icon.png";

type BaseSceneConfig = {
  sceneKey: string;
};

export class BaseScene extends Phaser.Scene {
  public utils!: GameUtils;
  constructor({ sceneKey }: BaseSceneConfig) {
    super(sceneKey);
    this.utils = new GameUtils(this);
  }

  preload() {
    this.load.image("clock-icon", clockIcon);
    this.load.image("pause-icon", pauseIcon);

    this.load.audio("click-sound", clickSound);
    this.load.audio("tick-sound", tickSound);
  }

  createCountdown(duration: number, onComplete: () => void) {
    let count = duration;
    const panelSize = this.utils._px(100);

    const countText = this.utils
      .createText(count.toString(), {
        style: {
          fontSize: `${this.utils._px(48)}px`,
          fontStyle: "600",
          color: "#000000",
        },
      })
      .setOrigin(0.5)
      .setDepth(100);

    const panel = this.rexUI.add.label({
      width: panelSize,
      height: panelSize,
      background: this.rexUI.add.roundRectangle(
        0,
        0,
        2,
        2,
        panelSize / 2,
        0xffffff,
      ),
      align: "center",
      text: countText,
    });

    const container = this.rexUI.add.sizer({
      width: this.utils.gameWidth,
      height: this.utils.gameHeight,
      x: this.utils.gameWidth / 2,
      y: this.utils.gameHeight / 2,
    });

    container.addSpace();
    container.add(panel, { align: "center" });
    container.addSpace();
    container.layout();

    panel.setAlpha(0);
    this.tweens.add({
      targets: panel,
      alpha: 1,
      duration: 200,
      ease: "Back.out",
    });
    this.sound.play("tick-sound");
    const timer = this.time.addEvent({
      delay: 1000,
      repeat: count - 1,
      callback: () => {
        count--;
        if (count > 0) {
          this.sound.play("tick-sound");
          countText.setText(count.toString());
          panel.layout();
          this.tweens.add({
            targets: countText,
            scale: { from: 0, to: 1 },
            duration: 200,
            ease: "Back.out",
          });
        } else {
          this.tweens.add({
            targets: panel,
            alpha: 0,
            duration: 200,
            ease: "Back.in",
            onComplete: () => {
              container.destroy();
              onComplete();
            },
          });
        }
      },
    });
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
}
