import { BaseScene } from "@/core/lib/baseScene";
import { SCENES } from "../config";
import type Label from "phaser3-rex-plugins/templates/ui/label/Label";
import type Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import type RoundRectangle from "phaser3-rex-plugins/plugins/roundrectangle";

export class TutorialScene extends BaseScene {
  buttonText: string = "INDIKI";
  button!: Label;
  currentScreen!: Sizer;
  step: number = 1;
  field!: RoundRectangle;

  constructor() {
    super({ sceneKey: SCENES.TUTORIAL });
  }

  create() {
    this.firstStep();
    this.createField();
  }

  firstStep() {
    this.currentScreen = this.rexUI.add.sizer({
      orientation: "y",
      x: this.utils.gameWidth / 2,
      y: this.utils.gameHeight / 2,
      width: this.utils.gameWidth,
      height: this.utils.gameHeight,
      space: { item: this.utils._px(30) },
    });
    const leavesContainer = this.rexUI.add.sizer({
      height: this.utils._px(180),
      width: this.utils._px(230),
      x: 0,
      y: 0,
      orientation: "h",
    });

    leavesContainer.add(
      this.add
        .image(0, 0, "green-leaf")
        .setDisplaySize(this.utils._px(99), this.utils._px(54))
        .setAngle(90),
      { align: "bottom" },
    );
    leavesContainer.add(
      this.add
        .image(0, 0, "green-leaf")
        .setDisplaySize(this.utils._px(99), this.utils._px(54))
        .setAngle(90),
      { align: "top" },
    );
    leavesContainer.add(
      this.add
        .image(0, 0, "green-leaf")
        .setDisplaySize(this.utils._px(99), this.utils._px(54))
        .setAngle(90),
      { align: "bottom" },
    );

    const finger = this.add
      .image(0, 0, "tutorial-swipe-up")
      .setDisplaySize(this.utils._px(75), this.utils._px(306));

    const text = this.utils.createText(
      "Ýaşyl ýapraklaryň ujyna üns beriň! Ujy haýsy tarapa bakýan bolsa şol tarapa barmagyňyz bilen süýşüriň",
      {
        style: {
          align: "center",
          fontSize: this.utils._px(16),
          fontFamily: "Nerko-One-Font",
          wordWrap: { width: this.utils.gameWidth - this.utils._px(100) },
        },
      },
    );

    this.currentScreen.addSpace();
    this.currentScreen.add(leavesContainer);
    this.currentScreen.add(finger, { align: "center" });
    this.currentScreen.add(text, { align: "center" });
    this.currentScreen.addSpace();
    this.currentScreen.layout();

    this.tweens.add({
      targets: finger,
      y: finger.y - this.utils._px(60),
      duration: 700,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    this.currentScreen.setAlpha(0);
    this.tweens.add({
      targets: this.currentScreen,
      alpha: 1,
      duration: 300,
    });
  }

  secondStep() {
    if (this.currentScreen) this.currentScreen.destroy();
    this.currentScreen = this.rexUI.add.sizer({
      orientation: "y",
      x: this.utils.gameWidth / 2,
      y: this.utils.gameHeight / 2,
      width: this.utils.gameWidth,
      height: this.utils.gameHeight,
      space: { item: this.utils._px(30) },
    });
    const leavesContainer = this.rexUI.add.sizer({
      height: this.utils._px(230),
      width: this.utils._px(230),
      x: 0,
      y: 0,
      orientation: "y",
      space: {
        item: this.utils._px(40),
      },
    });

    leavesContainer.add(
      this.add
        .image(0, 0, "yellow-leaf")
        .setDisplaySize(this.utils._px(99), this.utils._px(54)),
      { align: "right" },
    );
    leavesContainer.add(
      this.add
        .image(0, 0, "yellow-leaf")
        .setDisplaySize(this.utils._px(99), this.utils._px(54)),
      { align: "left" },
    );
    leavesContainer.add(
      this.add
        .image(0, 0, "yellow-leaf")
        .setDisplaySize(this.utils._px(99), this.utils._px(54)),
      { align: "right" },
    );

    const finger = this.add
      .image(0, 0, "tutorial-swipe-right")
      .setDisplaySize(this.utils._px(201), this.utils._px(185));

    const text = this.utils.createText(
      "Sary ýapraklaryň ýüzüp barýan ugruna üns beriň! Haýsy tarapa ýüzüp barýan bolsa şol tarapa barmagyňyz bilen süýşüriň",
      {
        style: {
          align: "center",
          fontSize: this.utils._px(16),
          fontFamily: "Nerko-One-Font",
          wordWrap: { width: this.utils.gameWidth - this.utils._px(100) },
        },
      },
    );

    this.currentScreen.addSpace();
    this.currentScreen.add(leavesContainer);
    this.currentScreen.add(finger, { align: "center" });
    this.currentScreen.add(text, { align: "center" });
    this.currentScreen.addSpace();
    this.currentScreen.layout();

    this.tweens.add({
      targets: finger,
      x: finger.x + this.utils._px(60),
      duration: 700,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    this.currentScreen.setAlpha(0);
    this.tweens.add({
      targets: this.currentScreen,
      alpha: 1,
      duration: 300,
    });
  }

  createField() {
    this.field = this.rexUI.add.roundRectangle({
      x: this.utils.gameWidth / 2,
      y: this.utils.gameHeight / 2,
      height: this.utils.gameHeight,
      width: this.utils.gameWidth,
    });
    this.field.setInteractive();

    const swipe = this.rexGestures.add.swipe(this.field, {
      threshold: this.utils._px(50),
      velocityThreshold: this.utils._px(1000),
      dir: "4dir",
    });

    swipe.on("swipe", (swipeObj: any) => {
      this.tweens.killTweensOf([this.currentScreen]);
      if (swipeObj.right) {
        this.utils.animatedSceneChange(SCENES.GAME);
      }
      if (swipeObj.up) {
        this.secondStep();
      }
    });
  }
}
