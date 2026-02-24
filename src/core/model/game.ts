type GameMeta = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  // image?: any
};

export const games: Record<string, GameMeta> = {
  chalkboard_challenge: {
    id: "chalkboard_challenge",
    name: "Chalkboard Challenge",
    shortName: "Chalkboard Challenge",
    description: "Chalkboard Challenge",
  },
};

export type GameId = keyof typeof games;

export const SCALE_COEF = 2;
export const GAME_WIDTH = 390;
export const GAME_HEIGHT = 844;
export const DYNAMIC_GAME_WIDTH = window.innerWidth;
export const DYNAMIC_GAME_HEIGHT = window.innerHeight;

export type GameWindowBounds = {
  width: number;
  height: number;
  topInset: number;
  bottomInset: number;
};
