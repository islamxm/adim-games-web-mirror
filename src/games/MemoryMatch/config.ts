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

export const GAME_NAME = "memory_match";

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
    backgroundColor: "#F54900",
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
  imageKey: string;
  value: string;
  id: number;
};

export const questionsMock: Array<Question> = [
  { id: 1, imageKey: "card1img", value: "1" },
  { id: 2, imageKey: "card1img", value: "1" },
  { id: 3, imageKey: "card2img", value: "2" },
  { id: 4, imageKey: "card2img", value: "2" },
  { id: 5, imageKey: "card3img", value: "3" },
  { id: 6, imageKey: "card3img", value: "3" },
  { id: 7, imageKey: "card4img", value: "4" },
  { id: 8, imageKey: "card4img", value: "4" },
  { id: 9, imageKey: "card5img", value: "5" },
  { id: 10, imageKey: "card5img", value: "5" },
  { id: 11, imageKey: "card6img", value: "6" },
  { id: 12, imageKey: "card6img", value: "6" },
];

export const shuffleQuestions = (questions: Array<Question>) => {
  const shuffledQuestions = JSON.parse(JSON.stringify(questions));
  return Phaser.Utils.Array.Shuffle(shuffledQuestions) as Array<Question>;
};
