export const getGamesPage = () => "/games";
export const getGamePage = (gameId: string) => `${getGamesPage()}/${gameId}`;
