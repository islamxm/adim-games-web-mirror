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
