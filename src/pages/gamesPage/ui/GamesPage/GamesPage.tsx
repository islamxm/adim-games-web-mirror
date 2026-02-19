import { games, getGamePage } from "@/core/model";
import { Link } from "react-router";

export const GamesPage = () => {
  return (
    <div>
      <h1>Games Page</h1>
      <ul>
        {Object.entries(games).map(([gameId, data]) => (
          <li key={gameId}>
            <Link to={getGamePage(gameId)}>{data.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
