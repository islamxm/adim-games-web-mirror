import * as Phaser from "phaser";

import { BootScene } from "./scenes/BootScene";
import { GameScene } from "./scenes/GameScene";
import { HUDScene } from "./scenes/HUDScene";
import { MenuScene } from "./scenes/MenuScene";
import { GameOverScene } from "./scenes/GameOverScene";
import { TutorialScene } from "./scenes/TutorialScene";
import { DYNAMIC_GAME_HEIGHT, DYNAMIC_GAME_WIDTH } from "@/core/model/game";
import { StartScene } from "./scenes/StartScene";
import { BackgroundScene } from "./scenes/BackgroundScene";

export const SCENES = {
  HUD: "HUDScene",
  MENU: "MenuScene",
  BOOT: "BootScene",
  START: "StartScene",
  TUTORIAL: "TutorialScene",
  GAME: "GameScene",
  GAME_OVER: "GameOverScene",
  BACKGROUND: "BackgroundScene",
};

export function createGameConfig(
  parent: string,
  externalData?: Record<string, any>,
): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    width: DYNAMIC_GAME_WIDTH,
    height: DYNAMIC_GAME_HEIGHT,
    parent,
    backgroundColor: "#1a472a",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
      antialias: true,
      pixelArt: false,
    },
    scene: [
      BootScene,
      BackgroundScene,
      StartScene,
      GameScene,
      GameOverScene,
      HUDScene,
      MenuScene,
      TutorialScene,
    ],
    callbacks: {
      postBoot: (game) => {
        if (externalData) {
          Object.entries(externalData).forEach(([key, value]) => {
            game.registry.set(key, value);
          });
        }
      },
    },
  };
}

type CorrectAnswer = "LEFT" | "RIGHT" | "EQUAL";

export type Question = {
  leftStatement: string;
  rightStatement: string;
  correct: CorrectAnswer;
};
