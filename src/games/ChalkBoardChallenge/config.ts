import { BootScene } from "./scenes/BootScene";
import { GameScene } from "./scenes/GameScene";
import { HUDScene } from "./scenes/HUDScene";
import { MenuScene } from "./scenes/MenuScene";
import { GameOverScene } from "./scenes/GameOverScene";
import { TutorialScene } from "./scenes/TutorialScene";
import { SCALE_COEF, type GameWindowBounds } from "@/core/model/game";
import { StartScene } from "./scenes/StartScene";
import { BackgroundScene } from "./scenes/BackgroundScene";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";

export const GAME_NAME = "chalkboard-challenge";

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
  bounds: GameWindowBounds,
  externalData?: Record<string, any>,
): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    width: bounds.width * SCALE_COEF,
    height: bounds.height * SCALE_COEF,
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
      preBoot: (game) => {
        game.registry.set("bounds", bounds);
        if (externalData) {
          Object.entries(externalData).forEach(([key, value]) => {
            game.registry.set(key, value);
          });
        }
      },
    },
    plugins: {
      scene: [
        { key: "rexUI", plugin: RexUIPlugin, start: true, mapping: "rexUI" },
      ],
    },
  };
}

type CorrectAnswer = "LEFT" | "RIGHT" | "EQUAL";

export type Question = {
  leftStatement: string;
  rightStatement: string;
  correct: CorrectAnswer;
};
