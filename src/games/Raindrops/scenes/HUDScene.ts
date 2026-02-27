import { BaseScene } from "@/core/lib/baseScene";
import { SCENES } from "../config";
import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import type { GameObjects } from "phaser";
import Label from "phaser3-rex-plugins/templates/ui/label/Label";

export class HUDScene extends BaseScene {
  private scoreValue!: Phaser.GameObjects.Text;
  private scorePanel!: Sizer;
  private _value: string = "";
  private inputText!: GameObjects.Text;
  inputLabel!: Label;

  constructor() {
    super({ sceneKey: SCENES.HUD });
  }

  create() {
    this.createPauseBtn();
    this.createControls();
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

  get value(): string {
    return this._value;
  }

  set value(val: string) {
    this._value = val;
    if (this.inputText) {
      this.inputText.setText(val);
    }
  }

  createControls() {
    const container = this.rexUI.add.sizer({
      x: this.utils.gameWidth / 2,
      y: this.utils.gameHeight,
      orientation: "y",
      width: this.utils.gameWidth,
      originY: 1,
      space: { item: this.utils._px(10) },
    });

    this.inputLabel = this.rexUI.add.label({
      height: this.utils._px(60),
      width: this.utils.gameWidth,
      align: "center",
      // text: this.inputText,
    });
    this.inputLabel.addBackground(
      this.rexUI.add.roundRectangle(0, 0, 0, 0, 0, 0x000000),
    );
    this.inputText = this.utils.createText("11321232");
    this.inputLabel.add(this.inputText);

    container.add(this.inputLabel);

    const grid = this.rexUI.add.gridSizer({
      column: 3,
      row: 3,
      space: { column: this.utils._px(10), row: this.utils._px(10) },
    });

    const numberBtnValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const numberBtnSize = this.utils.gameWidth / 3;

    for (let key of numberBtnValues) {
      const str = key.toString();

      const btnLabel = this.rexUI.add.label({
        width: numberBtnSize,
        height: numberBtnSize,
        background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 0, 0x000000),
        align: "center",
        text: this.utils.createText(str),
      });
      btnLabel.layout();
      btnLabel.setInteractive();
      btnLabel.on("pointerdown", () => {
        if (this.value.length === 3) {
          this.value = this.value + str;
        }
      });
      grid.add(btnLabel, {
        column: (key - 1) % 3,
        row: Math.floor((key - 1) / 3),
      });
    }
    container.add(grid);

    const submitButton = this.rexUI.add.label({
      x: 0,
      y: 0,
      height: this.utils._px(60),
      width: this.utils.gameWidth,
      background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 0, 0x000000),
      text: this.utils.createText("SUBMIT", { style: { align: "center" } }),
      align: "center",
    });
    container.add(submitButton);
    container.layout();
  }
}
