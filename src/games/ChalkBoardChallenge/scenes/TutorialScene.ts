import { SCENES } from "../config";
import { BaseScene } from "@/core/lib/baseScene";
import type { HUDScene } from "./HUDScene";
import type Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import type Label from "phaser3-rex-plugins/templates/ui/label/Label";

type Steps = Array<{
  target: Sizer | Label;
  message: string;
  buttonText: string;
  placement?: "top" | "bottom";
  reverse?: boolean;
}>;

export class TutorialScene extends BaseScene {
  private gameBoard!: Sizer;

  private overlay!: Phaser.GameObjects.RenderTexture;
  private spotObject!: Phaser.GameObjects.Graphics;
  private lastSpotBounds: { x: number; y: number; w: number; h: number } = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  };
  private label!: Sizer;
  private currentStep = 0;
  private steps: Steps = [
    {
      target: this.gameBoard,
      message: "Bu ýerde jogaplar görkeziler",
      buttonText: "Indiki",
      placement: "bottom",
    },
    {
      target: this.gameBoard,
      message: "Egerde çep trapdaky jogap dogry bolsa",
      buttonText: "Indiki",
      reverse: true,
      placement: "top",
    },
    {
      target: this.gameBoard,
      message: "Egerde iki tarap hem deň bolsa",
      buttonText: "Indiki",
      reverse: true,
      placement: "top",
    },
    {
      target: this.gameBoard,
      message: "Egerde sag tarapdaky jogap dogry bolsa",
      buttonText: "Başla",
      reverse: true,
      placement: "top",
    },
  ];

  constructor() {
    super({ sceneKey: SCENES.TUTORIAL });
  }

  create() {
    this.scene.launch(SCENES.HUD);
    this.time.delayedCall(500, () => {
      this.createGameMock();
      this.createOverlay();
      this.next(this.currentStep);
    });
  }

  createGameMock() {
    this.add
      .rectangle(
        0,
        0,
        this.utils.gameWidth,
        this.utils.gameHeight,
        this.utils._hexToDecColor("#ffffff"),
        0,
      )
      .setOrigin(0, 0)
      .setInteractive();
    const mainContainer = this.rexUI.add.sizer({
      x: this.utils.gameWidth / 2,
      y: this.utils.gameHeight / 2,
      height: this.utils.gameHeight,
      width: this.utils.gameWidth,
      orientation: "y",
      space: {
        item: this.utils._px(24),
        top: this.utils.topInset,
        bottom: this.utils.bottomInset,
      },
    });
    const title = this.utils.createText("Haýsy tarap uly bolsa saýlaň", {
      style: { fontSize: `${this.utils._px(18)}px` },
    });
    const boardsContainer = this.rexUI.add.sizer({
      orientation: "x",
      space: { item: this.utils._px(16) },
    });

    const leftText = this.utils
      .createText("1 + 1", {
        style: {
          color: "#000000",
          fontSize: `${this.utils._px(24)}px`,
          fontStyle: "600",
        },
      })
      .setDepth(1);
    const rightText = this.utils
      .createText("3", {
        style: {
          color: "#000000",
          fontSize: `${this.utils._px(24)}px`,
          fontStyle: "600",
        },
      })
      .setDepth(1);

    const leftPanel = this.rexUI.add.label({
      width: this.utils._px(152),
      height: this.utils._px(100),
      background: this.rexUI.add.roundRectangle(
        0,
        0,
        2,
        2,
        this.utils._px(24),
        0xffffff,
      ),
      text: leftText,
      align: "center",
    });

    const rightPanel = this.rexUI.add.label({
      width: this.utils._px(152),
      height: this.utils._px(100),
      background: this.rexUI.add.roundRectangle(
        0,
        0,
        2,
        2,
        this.utils._px(24),
        0xffffff,
      ),
      text: rightText,
      align: "center",
    });

    boardsContainer.add(leftPanel);
    boardsContainer.add(rightPanel);

    mainContainer.addSpace();
    mainContainer.add(title, { align: "center" });
    mainContainer.add(boardsContainer, { align: "center" });
    mainContainer.addSpace();
    mainContainer.layout();

    this.utils.animateAlpha(title);
    this.utils.animateFadeLeft(leftPanel);
    this.utils.animateFadeRight(rightPanel);
    const hudScene = this.scene.get(SCENES.HUD) as HUDScene;
    this.steps[0].target = boardsContainer;
    this.steps[1].target = hudScene.leftButton;
    this.steps[2].target = hudScene.equalButton;
    this.steps[3].target = hudScene.rightButton;
  }

  createOverlay() {
    const padding = 15;
    this.overlay = this.add.renderTexture(
      0,
      0,
      this.utils.gameWidth,
      this.utils.gameHeight,
    );
    this.overlay.setOrigin(0, 0);
    this.overlay.setDepth(100);
    this.overlay.fill(0x000000, 0.5);

    this.spotObject = this.add.graphics();
    this.spotObject.fillStyle(0xffffff, 1);
    this.spotObject.fillRect(
      this.lastSpotBounds.x - padding,
      this.lastSpotBounds.y - padding,
      this.lastSpotBounds.w + padding * 2,
      this.lastSpotBounds.h + padding * 2,
    );
    this.spotObject.setVisible(false);
  }

  next(step: number) {
    const padding = this.utils._px(15);
    if (this.label) {
      this.label.destroy();
    }
    const target = this.steps[step].target;

    const { x, y } = this.utils._getGlobalPosition(target);
    const targetX = x - padding - target.width / 2;
    const targetY = y - padding - target.height / 2;
    const targetW = target.width + padding * 2;
    const targetH = target.height + padding * 2;

    this.tweens.add({
      targets: this.lastSpotBounds,
      x: targetX,
      y: targetY,
      w: targetW,
      h: targetH,
      duration: 500,
      ease: "Cubic.Out",
      onUpdate: () => {
        this.clearOverlay();
        this.spotObject.fillRect(
          this.lastSpotBounds.x,
          this.lastSpotBounds.y,
          this.lastSpotBounds.w,
          this.lastSpotBounds.h,
        );
        this.overlay.erase(this.spotObject);
      },
      onComplete: () => {
        this.overlay.erase(this.spotObject);
        this.label = this.createLabel(
          this.steps[step].buttonText,
          this.steps[step].message,
          () => {
            if (this.currentStep === this.steps.length - 1) {
              this.scene.start(SCENES.GAME);
              return;
            }
            this.currentStep++;
            this.next(this.currentStep);
          },
          this.steps[step]?.reverse,
        );

        if (this.steps[step].placement === "top") {
          this._setOnTop(this.label, target);
        }
        if (this.steps[step].placement === "bottom") {
          this._setOnBottom(this.label, target);
        }
        this.label.setAlpha(0);
        this.tweens.add({
          targets: this.label,
          alpha: 1,
          duration: 300,
          ease: "Cubic.Out",
        });
      },
    });
  }

  clearOverlay() {
    this.overlay.clear().fill(0x000000, 0.5);
    this.spotObject.clear().fillStyle(0xffffff, 1);
  }

  createLabel(
    buttonText: string,
    messageText: string,
    onClick: () => void,
    reverse?: boolean,
  ) {
    const btn = this.rexUI.add.label({
      background: this.rexUI.add.roundRectangle(
        0,
        0,
        2,
        2,
        this.utils._px(10),
        0xf0c23b,
      ),
      text: this.utils.createText(buttonText, {
        style: {
          color: "#ffffff",
          fontSize: this.utils._px(16),
          align: "center",
        },
      }),
      space: {
        top: this.utils._px(5),
        bottom: this.utils._px(5),
        left: this.utils._px(16),
        right: this.utils._px(16),
      },
      align: "center",
    });

    btn.setInteractive().on("pointerdown", onClick);

    const text = this.utils.createText(messageText, {
      style: {
        color: "#ffffff",
        fontSize: this.utils._px(18),
        wordWrap: { width: this.utils.gameWidth / 2 },
        align: "center",
      },
    });

    const container = this.rexUI.add.sizer({
      orientation: "y",
      width: this.utils.gameWidth / 2,
      space: { item: this.utils._px(12) },
    });

    if (reverse) {
      container.add(btn, { align: "center" });
      container.add(text, { align: "center" });
    } else {
      container.add(text, { align: "center" });
      container.add(btn, { align: "center" });
    }
    container.layout();
    container.setDepth(101);
    return container;
  }

  private _setOnTop(object: Sizer, targetObject: Label | Sizer) {
    const targetObjectPos = this.utils._getGlobalPosition(targetObject);
    const offset = this.utils._px(30);

    // Доступное место сверху = центр мишени - пол-высоты мишени - отступ сверху (safe area)
    const availableSpaceTop =
      targetObjectPos.y - targetObject.height / 2 - this.utils.topInset;

    // Нужно места = высота плашки + отступ от мишени
    const spaceNeeded = object.height + offset;

    const canSetOnTop = availableSpaceTop > spaceNeeded;

    if (!canSetOnTop) {
      return;
    }

    let y =
      targetObjectPos.y - targetObject.height / 2 - offset - object.height / 2;
    let x = targetObjectPos.x;

    const isLeftFloat = x - object.width / 2 < 0;
    const isRightFloat = x + object.width / 2 > this.utils.gameWidth;

    if (isLeftFloat) {
      x = object.width / 2;
    } else if (isRightFloat) {
      x = this.utils.gameWidth - object.width / 2;
    }

    object.setPosition(x, y);
  }

  private _setOnBottom(object: Sizer, targetObject: Label | Sizer) {
    const targetObjectPos = this.utils._getGlobalPosition(targetObject);
    const offset = this.utils._px(15);

    const availableSpaceBottom =
      this.utils.gameHeight -
      (targetObjectPos.y + targetObject.height / 2) -
      this.utils.bottomInset;

    const spaceNeeded = object.height + offset;

    const canSetOnBottom = availableSpaceBottom > spaceNeeded;

    if (!canSetOnBottom) {
      return;
    }

    const y =
      targetObjectPos.y +
      targetObject.height / 2 +
      offset * 2 +
      object.height / 2;
    let x = targetObjectPos.x;

    if (x - object.width / 2 < 0) {
      x = object.width / 2;
    } else if (x + object.width / 2 > this.utils.gameWidth) {
      x = this.utils.gameWidth - object.width / 2;
    }

    object.setPosition(x, y);
  }
}
