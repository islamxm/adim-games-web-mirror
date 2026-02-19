import * as Phaser from "phaser";

import { SCENES } from "../config";
import { GameUtils } from "@/core/lib/gameUtils";

export class MenuScene extends Phaser.Scene {
  utils!: GameUtils;

  constructor() {
    super({ key: SCENES.MENU });
  }

  preload() {
    this.utils = new GameUtils(this);
  }

  create() {
    const { width, height } = this.cameras.main;

    // Скрываем камеру в начале для плавного появления
    this.cameras.main.setAlpha(0);
    this.tweens.add({
      targets: this.cameras.main,
      alpha: 1,
      duration: 300,
    });

    // Фоновый прямоугольник, который блокирует клики под собой
    this.add
      .rectangle(0, 0, width, height, 0x1a472a)
      .setOrigin(0, 0)
      .setInteractive();

    const labels = ["Resume", "Restart", "Quit"];
    const iconMap: Record<string, string> = {
      Resume: "menu-resume-icon",
      Restart: "menu-restart-icon",
      Quit: "menu-quit-icon",
    };

    const buttonWidth = 270;
    const buttonHeight = 50;
    const gap = 16;

    labels.forEach((label, index) => {
      // Вычисляем Y позицию, чтобы группа была по центру
      const totalHeight = (buttonHeight + gap) * labels.length - gap;
      const startY = (height - totalHeight) / 2 + buttonHeight / 2;
      const y = startY + index * (buttonHeight + gap);

      // Фон кнопки
      const bg = this.add.graphics();
      bg.fillStyle(0x000000, 0.4);
      bg.fillRoundedRect(
        -buttonWidth / 2,
        -buttonHeight / 2,
        buttonWidth,
        buttonHeight,
        10,
      );

      // Сконфигурируем отступы для выравнивания по левому краю
      const padding = 20;
      const leftEdge = -buttonWidth / 2 + padding;

      // Иконка (выравниваем по левому краю + отступ)
      const icon = this.add.image(leftEdge + 12, 0, iconMap[label]);
      icon.setDisplaySize(24, 24);

      // Текст кнопки (ставим origin слева и сдвигаем после иконки)
      const text = this.add
        .text(leftEdge + 36, 0, label, {
          fontSize: "24px",
          color: "#ffffff",
          fontFamily: "Open Sans, sans-serif",
        })
        .setOrigin(0, 0.5);

      // Контейнер (кнопка)
      const btn = this.add.container(width / 2, y, [bg, icon, text]);
      btn.setSize(buttonWidth, buttonHeight);
      btn.setInteractive({ useHandCursor: true });

      // Анимация появления
      btn.setScale(0);
      this.tweens.add({
        targets: btn,
        scale: 1,
        duration: 400,
        ease: "Back.out",
        delay: index * 100, // Поочередная задержка
      });

      btn.on("pointerdown", () => {
        if (label === "Resume") {
          this.closeMenu();
        }
      });
    });
  }

  private closeMenu() {
    this.tweens.add({
      targets: this.cameras.main,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        this.scene.resume(SCENES.GAME);
        this.scene.stop();
      },
    });
  }
}
