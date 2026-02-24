import { SCALE_COEF, type GameWindowBounds } from "@/core/model/game";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import { BootScene } from "./scenes/BootScene";
import { BackgroundScene } from "./scenes/BackgroundScene";
import GameScene from "./scenes/GameScene";

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
    backgroundColor: "#041716",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
      antialias: true,
      pixelArt: false,
    },
    scene: [BootScene, BackgroundScene, GameScene],
    callbacks: {
      postBoot: (game) => {
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
