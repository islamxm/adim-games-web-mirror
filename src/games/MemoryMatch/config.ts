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
import { VictoryScene } from "./scenes/VictoryScene";

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
  VICTORY: "VictoryScene",
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
      VictoryScene,
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

export type Level = {
  label: string;
  size: {
    col: number;
    row: number;
    cardHeight: number;
    cardWidth: number;
    gap: number;
  };
  questions: Array<Question>;
};
export const levels: Array<Level> = [
  {
    label: "1 level",
    size: { col: 2, row: 2, cardHeight: 120, cardWidth: 99, gap: 12 },
    questions: [
      { id: 1, imageKey: "card1img", value: "1" },
      { id: 2, imageKey: "card1img", value: "1" },
      { id: 3, imageKey: "card2img", value: "2" },
      { id: 4, imageKey: "card2img", value: "2" },
    ],
  },
  {
    label: "2 level",
    size: { col: 3, row: 3, cardHeight: 120, cardWidth: 99, gap: 12 },
    questions: [
      { id: 1, imageKey: "card1img", value: "1" },
      { id: 2, imageKey: "card1img", value: "1" },
      { id: 3, imageKey: "card2img", value: "2" },
      { id: 4, imageKey: "card2img", value: "2" },
      { id: 5, imageKey: "card3img", value: "3" },
      { id: 6, imageKey: "card3img", value: "3" },
    ],
  },
  {
    label: "3 level",
    size: { col: 3, row: 4, cardHeight: 120, cardWidth: 99, gap: 12 },
    questions: [
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
    ],
  },
  {
    label: "4 level",
    size: {
      col: 4,
      row: 6,
      cardHeight: 120 * 0.7,
      cardWidth: 99 * 0.7,
      gap: 4,
    },
    questions: [
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
      { id: 13, imageKey: "card7img", value: "7" },
      { id: 14, imageKey: "card7img", value: "7" },
      { id: 15, imageKey: "card8img", value: "8" },
      { id: 16, imageKey: "card8img", value: "8" },
      { id: 17, imageKey: "card9img", value: "9" },
      { id: 18, imageKey: "card9img", value: "9" },
      { id: 19, imageKey: "card10img", value: "10" },
      { id: 20, imageKey: "card10img", value: "10" },
      { id: 21, imageKey: "card11img", value: "11" },
      { id: 22, imageKey: "card11img", value: "11" },
      { id: 23, imageKey: "card12img", value: "12" },
      { id: 24, imageKey: "card12img", value: "12" },
    ],
  },
];
