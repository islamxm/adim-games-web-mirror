import type { Game, GameObjects } from "phaser";
import { SCALE_COEF } from "../model/game";
import { hexToDecColor } from "./hexToDecColor";

type Object = GameObjects.GameObject &
  GameObjects.Components.GetBounds &
  GameObjects.Components.Origin &
  GameObjects.Components.Transform &
  GameObjects.Components.ComputedSize;

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

  /** дефолтная анимация смены сцены */
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

  /** создание текста */
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
    this._normalizeOrigin(textObject);
    return textObject;
  }

  /** создание фонового изображение на весь экран */
  createSceneBg(imageKey: string): GameObjects.Image {
    const bg = this.scene.add
      .image(this.gameWidth / 2, this.gameHeight / 2, imageKey)
      .setOrigin(0.5, 0.5)
      .setDisplaySize(this.gameWidth, this.gameHeight);
    return bg;
  }

  /** создание кнопки */
  createButton(
    innerElement: GameObjects.Text | GameObjects.Image | GameObjects.Container,
    options?: {
      backgroundColor?: string;
      borderRadius?: number;
      backgroundAlpha?: number;
      p?: [number, number, number, number];
      align?: "center" | "start" | "end";
      justify?: "center" | "start" | "end";
      x?: number;
      y?: number;
      onClick?: () => void;
    },
  ) {
    const {
      backgroundColor = "#ffffff",
      borderRadius = 16,
      backgroundAlpha = 1,
      p = [5, 5, 5, 5],
      justify = "center",
      align = "center",
      x = 0,
      y = 0,
      onClick,
    } = options || {};
    const [paddingTop, paddingRight, paddingBottom, paddingLeft] = p;

    // 1. Получаем локальный размер.
    // Т.к. origin 0,0, эти значения идеально описывают занимаемую площадь от точки x,y
    const elementWidth =
      (innerElement as any).displayWidth ?? innerElement.width ?? 0;
    const elementHeight =
      (innerElement as any).displayHeight ?? innerElement.height ?? 0;

    const buttonWidth = elementWidth + paddingLeft + paddingRight;
    const buttonHeight = elementHeight + paddingTop + paddingBottom;

    // 2. Создаем фон
    const panel = this.scene.add
      .graphics()
      .fillStyle(hexToDecColor(backgroundColor), backgroundAlpha)
      .fillRoundedRect(0, 0, buttonWidth, buttonHeight, borderRadius);

    // 3. Создаем контейнер-кнопку
    const button = this.scene.add
      .container(x, y, [panel, innerElement])
      .setSize(buttonWidth, buttonHeight);

    // 4. Позиционируем элемент (Математика для origin 0,0)
    // Мы просто вычисляем свободное место и делим его пополам, учитывая паддинги
    if (justify === "center") {
      innerElement.x =
        paddingLeft +
        (buttonWidth - paddingLeft - paddingRight - elementWidth) / 2;
    } else if (justify === "start") {
      innerElement.x = paddingLeft;
    } else if (justify === "end") {
      innerElement.x = buttonWidth - paddingRight - elementWidth;
    }

    if (align === "center") {
      innerElement.y =
        paddingTop +
        (buttonHeight - paddingTop - paddingBottom - elementHeight) / 2;
    } else if (align === "start") {
      innerElement.y = paddingTop;
    } else if (align === "end") {
      innerElement.y = buttonHeight - paddingBottom - elementHeight;
    }

    button.setInteractive(
      new Phaser.Geom.Rectangle(
        buttonWidth / 2,
        buttonHeight / 2,
        buttonWidth,
        buttonHeight,
      ),
      Phaser.Geom.Rectangle.Contains,
    );
    if (onClick) {
      button.on("pointerdown", onClick);
    }

    return button;
  }

  createImage(
    imageKey: string,
    options?: {
      width?: number;
      height?: number;
      x?: number;
      y?: number;
    },
  ) {
    const {
      x = 0,
      y = 0,
      width = this._px(20),
      height = this._px(20),
    } = options || {};
    const image = this.scene.add.image(x, y, imageKey);
    image.setDisplaySize(width, height);
    // image.setSize(width, height);
    this._normalizeOrigin(image);
    return image;
  }

  /** создание панели с возможностью задать ширину и высоту */
  createPanel(
    innerElement: GameObjects.Text | GameObjects.Image | GameObjects.Container,
    options?: {
      backgroundColor?: string;
      borderRadius?: number;
      backgroundAlpha?: number;
      p?: [number, number, number, number];
      align?: "center" | "start" | "end";
      justify?: "center" | "start" | "end";
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      onClick?: () => void;
    },
  ) {
    const {
      x = 0,
      y = 0,
      align = "center",
      justify = "center",
      p = [this._px(5), this._px(5), this._px(5), this._px(5)],
      backgroundAlpha = 1,
      borderRadius = 0,
      backgroundColor = "#ffffff",
      onClick,
    } = options || {};
    const [paddingTop, paddingRight, paddingBottom, paddingLeft] = p;

    const elementWidth =
      (innerElement as any).displayWidth ?? innerElement.width ?? 0;
    const elementHeight =
      (innerElement as any).displayHeight ?? innerElement.height ?? 0;

    const mustHaveWidth = elementWidth + paddingLeft + paddingRight;
    const mustHaveHeight = elementHeight + paddingTop + paddingBottom;

    const realWidth = Math.max(mustHaveWidth, options?.width || 0);
    const realHeight = Math.max(mustHaveHeight, options?.height || 0);

    const bg = this.scene.add
      .graphics()
      .fillStyle(hexToDecColor(backgroundColor), backgroundAlpha)
      .fillRoundedRect(0, 0, realWidth, realHeight, borderRadius);

    const panel = this.scene.add
      .container(x, y, [bg, innerElement])
      .setSize(realWidth, realHeight);

    if (justify === "center") {
      innerElement.x = (realWidth - elementWidth) / 2;
    } else if (justify === "start") {
      innerElement.x = paddingLeft;
    } else if (justify === "end") {
      innerElement.x = realWidth - elementWidth - paddingRight;
    }

    if (align === "center") {
      innerElement.y = (realHeight - elementHeight) / 2;
    } else if (align === "start") {
      innerElement.y = paddingTop;
    } else if (align === "end") {
      innerElement.y = realHeight - elementHeight - paddingBottom;
    }

    panel.setInteractive(
      new Phaser.Geom.Rectangle(
        realWidth / 2,
        realHeight / 2,
        realWidth,
        realHeight,
      ),
      Phaser.Geom.Rectangle.Contains,
    );

    if (onClick) {
      panel.on("pointerdown", onClick);
      panel.input!.cursor = "pointer";
    }

    return panel;
  }

  /** создание стэка (горизонтального или вертикального), без возможности переноса или растяжения */
  createStack(options: {
    x?: number;
    y?: number;
    items: Array<Object | GameObjects.Container | GameObjects.Arc>;
    direction?: "row" | "column";
    align?: "start" | "center" | "end";
    justify?: "start" | "center" | "end";
    fillX?: boolean;
    fillY?: boolean;
    gap?: number;
  }): GameObjects.Container {
    const { width: gameWidth, height: gameHeight } = this.gameWindowSize;
    const {
      x = 0,
      y = 0,
      items = [],
      direction = "row",
      align = "start",
      justify = "start",
      fillX = false,
      fillY = false,
      gap = 0,
    } = options;
    const container = this.scene.add.container(x, y);

    items.forEach((item) => {
      this._normalizeOrigin(item);
    });

    let totalContentWidth = 0;
    let maxItemHeight = 0;
    let totalContentHeight = 0;
    let maxItemWidth = 0;

    let currentX = 0;
    let currentY = 0;

    items.forEach((item) => {
      const { width, height } = this._getItemSize(item);

      if (direction === "row") {
        item.x = currentX;
        currentX += width + gap;
        maxItemHeight = Math.max(maxItemHeight, height);
      } else {
        item.y = currentY;
        currentY += height + gap;
        maxItemWidth = Math.max(maxItemWidth, width);
      }
    });

    const finalContentWidth =
      direction === "row" ? Math.max(0, currentX - gap) : maxItemWidth;
    const finalContentHeight =
      direction === "column" ? Math.max(0, currentY - gap) : maxItemHeight;

    container.setSize(
      fillX ? container.parentContainer?.width || gameWidth : finalContentWidth,
      fillY
        ? container.parentContainer?.height || gameHeight
        : finalContentHeight,
    );

    let offsetX = 0;
    let offsetY = 0;
    if (justify === "center") {
      offsetX = (container.width - finalContentWidth) / 2;
      offsetY = (container.height - finalContentHeight) / 2;
    } else if (justify === "end") {
      offsetX = container.width - finalContentWidth;
      offsetY = container.height - finalContentHeight;
    }

    items.forEach((item) => {
      const { width, height } = this._getItemSize(item);

      if (direction === "row") {
        item.x += offsetX;
        if (align === "center") item.y = (container.height - height) / 2;
        if (align === "end") item.y = container.height - height;
      } else {
        item.y += offsetY;
        if (align === "center") item.x = (container.width - width) / 2;
        if (align === "end") item.x = container.width - width;
      }
    });

    container.add(items);
    return container;
  }

  _normalizeOrigin(object: any) {
    if ("setOrigin" in object) {
      object.setOrigin?.(0, 0);
    }
  }

  _px(value: number) {
    return value * SCALE_COEF;
  }
  private _getItemSize(item: any) {
    return {
      // Берем displayWidth (если есть), иначе обычный width
      width: item.displayWidth ?? item.width ?? 0,
      height: item.displayHeight ?? item.height ?? 0,
    };
  }

  _getGlobalPosition(object: Phaser.GameObjects.Container) {
    const matrix = object.getWorldTransformMatrix();
    ``;
    return {
      x: matrix.tx,
      y: matrix.ty,
    };
  }

  /** все методы для анимаций перенести в отдельный класс */
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
