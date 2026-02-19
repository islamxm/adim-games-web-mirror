import * as Phaser from "phaser";

import { BootScene } from "./scenes/BootScene";
import { GameScene } from "./scenes/GameScene";
import { HUDScene } from "./scenes/HUDScene";
import { MenuScene } from "./scenes/MenuScene";
import { GameOverScene } from "./scenes/GameOverScene";
import { TutorialScene } from "./scenes/TutorialScene";

export const WIDTH = 600;
export const HEIGHT = 844;

export const SCENES = {
  HUD: "HUDScene",
  MENU: "MenuScene",
  BOOT: "BootScene",
  TUTORIAL: "TutorialScene",
  GAME: "GameScene",
  GAME_OVER: "GameOverScene",
};

export function createGameConfig(parent: string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    parent,
    backgroundColor: "#1a472a",
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
      antialias: true,
      pixelArt: false,
      resolution: window.devicePixelRatio,
    } as any,
    scene: [
      BootScene,
      TutorialScene,
      GameScene,
      HUDScene,
      MenuScene,
      GameOverScene,
    ],
  };
}

type CorrectAnswer = keyof Omit<Question, "correct"> | "equal";

export type Question = {
  left: string;
  right: string;
  correct: CorrectAnswer;
};

export const questionsMock: Array<Question> = [
  {
    left: "5 + 6",
    right: "9",
    correct: "left",
  },
  {
    left: "12 + 5",
    right: "9 + 9",
    correct: "right",
  },
  {
    left: "20",
    right: "10 + 10",
    correct: "equal",
  },
  {
    left: "5 + 6",
    right: "9",
    correct: "left",
  },
  {
    left: "12 + 5",
    right: "9 + 9",
    correct: "right",
  },
  {
    left: "20",
    right: "10 + 10",
    correct: "equal",
  },
  {
    left: "5 + 6",
    right: "9",
    correct: "left",
  },
  {
    left: "12 + 5",
    right: "9 + 9",
    correct: "right",
  },
  {
    left: "20",
    right: "10 + 10",
    correct: "equal",
  },
  {
    left: "5 + 6",
    right: "9",
    correct: "left",
  },
  {
    left: "12 + 5",
    right: "9 + 9",
    correct: "right",
  },
  {
    left: "20",
    right: "10 + 10",
    correct: "equal",
  },
  {
    left: "5 + 6",
    right: "9",
    correct: "left",
  },
  {
    left: "12 + 5",
    right: "9 + 9",
    correct: "right",
  },
  {
    left: "20",
    right: "10 + 10",
    correct: "equal",
  },
  {
    left: "5 + 6",
    right: "9",
    correct: "left",
  },
  {
    left: "12 + 5",
    right: "9 + 9",
    correct: "right",
  },
  {
    left: "20",
    right: "10 + 10",
    correct: "equal",
  },
];
