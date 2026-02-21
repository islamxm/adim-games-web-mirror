import { SCENES } from "../config";
import { BaseScene } from "@/core/lib/baseScene";
import type { HUDScene } from "./HUDScene";

type Steps = Array<{
  target: Phaser.GameObjects.Container;
  message: string;
  buttonText: string;
  placement?: "top" | "bottom";
  reverse?: boolean;
}>;

export class TutorialScene extends BaseScene {
  private gameBoard!: Phaser.GameObjects.Container;
  private leftButton!: Phaser.GameObjects.Container;
  private rightButton!: Phaser.GameObjects.Container;
  private title!: Phaser.GameObjects.Text;

  private overlay!: Phaser.GameObjects.RenderTexture;
  private spotObject!: Phaser.GameObjects.Graphics;
  private lastSpotBounds: { x: number; y: number; w: number; h: number } = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  };
  private label!: Phaser.GameObjects.Container;
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
      message: "Egerde sag trapdaky jogap dogry bolsa",
      buttonText: "Indiki",
      reverse: true,
      placement: "top",
    },
    {
      target: this.gameBoard,
      message: "Egerde çep tarapdaky jogap dogry bolsa",
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
    this.time.delayedCall(0, () => {
      this.createGameMock();
      this.createOverlay();
      this.next(this.currentStep);
    });
  }

  createGameMock() {
    const leftText = this.utils.createText("1 + 1", {
      style: {
        color: "#000000",
        fontSize: `${this.utils._px(24)}px`,
        fontStyle: "600",
      },
    });
    const rightText = this.utils.createText("3", {
      style: {
        color: "#000000",
        fontSize: `${this.utils._px(24)}px`,
        fontStyle: "600",
      },
    });

    const leftButton = this.utils.createPanel(leftText, {
      width: this.utils._px(152),
      height: this.utils._px(100),
      borderRadius: this.utils._px(24),
    });
    const rightButton = this.utils.createPanel(rightText, {
      width: this.utils._px(152),
      height: this.utils._px(100),
      borderRadius: this.utils._px(24),
    });

    this.title = this.utils.createText("Выберите большую сторону", {
      style: {
        fontSize: `${this.utils._px(18)}px`,
      },
    });

    this.gameBoard = this.utils.createStack({
      gap: this.utils._px(16),
      items: [leftButton, rightButton],
    });

    this.utils.createStack({
      fillY: true,
      fillX: true,
      gap: this.utils._px(24),
      justify: "center",
      align: "center",
      direction: "column",
      items: [this.title, this.gameBoard],
    });
    const hudScene = this.scene.get(SCENES.HUD) as HUDScene;
    this.steps[0].target = this.gameBoard;
    this.steps[1].target = hudScene.leftButton;
    this.steps[2].target = hudScene.rightButton;
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
    const padding = 15;
    if (this.label) {
      this.label.destroy();
    }
    const target = this.steps[step].target;
    const { x, y } = this.utils._getGlobalPosition(target);
    const targetX = x - padding;
    const targetY = y - padding;
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
    const button = this.utils.createButton(
      this.utils.createText(buttonText, {
        style: { color: "#ffffff", fontSize: this.utils._px(16) },
      }),
      {
        p: [
          this.utils._px(5),
          this.utils._px(16),
          this.utils._px(5),
          this.utils._px(16),
        ],
        justify: "center",
        align: "center",
        backgroundColor: "#F0C23B",
        onClick,
      },
    );
    const label = this.utils.createStack({
      gap: this.utils._px(12),
      direction: "column",
      justify: "center",
      align: "center",
      items: reverse
        ? [
            button,
            this.utils.createText(messageText, {
              style: { color: "#ffffff", fontSize: this.utils._px(18) },
            }),
          ]
        : [
            this.utils.createText(messageText, {
              style: { color: "#ffffff", fontSize: this.utils._px(18) },
            }),
            button,
          ],
    });
    label.setDepth(101);
    return label;
  }

  private _setOnTop(
    object: Phaser.GameObjects.Container,
    targetObject: Phaser.GameObjects.Container,
  ) {
    const targetObjectPos = this.utils._getGlobalPosition(targetObject);
    const objectPos = this.utils._getGlobalPosition(object);
    const offset = this.utils._px(15);
    const canSetOnTop =
      objectPos.y + object.height + offset < targetObjectPos.y;

    if (!canSetOnTop) {
      this._setOnBottom(object, targetObject);
      return;
    }
    let y = targetObjectPos.y - object.height - offset;
    let x = targetObjectPos.x + targetObject.width / 2 - object.width / 2;

    const isLeftFloat = x < 0;
    const isRightFloat = x + object.width > this.utils.gameWidth;

    if (isLeftFloat) {
      x = 0;
    }

    if (isRightFloat) {
      x = this.utils.gameWidth - object.width;
    }

    object.setPosition(x, y);
  }
  private _setOnBottom(
    object: Phaser.GameObjects.Container,
    targetObject: Phaser.GameObjects.Container,
  ) {
    const targetObjectPos = this.utils._getGlobalPosition(targetObject);
    const objectPos = this.utils._getGlobalPosition(object);
    const offset = this.utils._px(15);
    const canSetOnBottom =
      this.utils.gameHeight - targetObjectPos.y + targetObject.height + offset >
      object.height;
    if (!canSetOnBottom) {
      return;
    }

    const y = targetObjectPos.y + targetObject.height + offset;
    const x = targetObjectPos.x + targetObject.width / 2 - object.width / 2;
    object.setPosition(x, y);
  }
}
