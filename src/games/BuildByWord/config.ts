import { SCALE_COEF, type GameWindowBounds } from "@/core/model/game";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import RexGesturesPlugin from "phaser3-rex-plugins/plugins/gestures-plugin.js";
import { BootScene } from "./scenes/BootScene";
import { BackgroundScene } from "./scenes/BackgroundScene";
import GameScene from "./scenes/GameScene";
import { MenuScene } from "./scenes/MenuScene";
import { HUDScene } from "./scenes/HUDScene";
import { StartScene } from "./scenes/StartScene";
import { TutorialScene } from "./scenes/TutorialScene";
import { GameOverScene } from "./scenes/GameOverScene";

export const GAME_NAME = "build_by_word";

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
    backgroundColor: "#81CFFF",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: "arcade",
    },
    render: {
      antialias: true,
      pixelArt: false,
    },
    scene: [
      BootScene,
      BackgroundScene,
      StartScene,
      TutorialScene,
      GameScene,
      HUDScene,
      MenuScene,
      GameOverScene,
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
        {
          key: "rexGestures",
          plugin: RexGesturesPlugin,
          start: true,
          mapping: "rexGestures",
        },
      ],
    },
  };
}

export type Question = {
  correct: number;
  value: number;
  variants: Array<string>;
};
