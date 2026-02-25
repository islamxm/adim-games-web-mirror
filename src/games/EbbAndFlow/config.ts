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

export const GAME_NAME = "ebb-and-flow";

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
        console.log("URL-dan alanan token: ", externalData?.gameSessionToken);
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

export type Direction = "TOP" | "BOTTOM" | "LEFT" | "RIGHT";
export type LeafType = "yellow" | "green";
export type Question = {
  leafType: LeafType;
  direction: Direction;
  moveDirection: Direction;
  correct: Direction;
};

const colors: Array<LeafType> = ["green", "yellow"];
const directions: Array<Direction> = ["TOP", "BOTTOM", "LEFT", "RIGHT"];

const correctMap: Record<LeafType, "moveDirection" | "direction"> = {
  yellow: "moveDirection",
  green: "direction",
};

export class QuestionObject {
  static generateQuestion() {
    const color = this.color;
    const direction = this.direction;
    const moveDirection = this.direction;
    const raw: Pick<Question, "direction" | "moveDirection"> = {
      direction,
      moveDirection,
    };

    const question: Question = {
      leafType: color,
      direction,
      moveDirection,
      correct: raw[correctMap[color]],
    };
    return question;
  }

  static get color(): LeafType {
    return colors[Math.floor(Math.random() * 2)];
  }

  static get direction(): Direction {
    return directions[Math.floor(Math.random() * 4)];
  }
}
