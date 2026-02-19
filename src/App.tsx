import { BrowserRouter, Route, Routes } from "react-router";
import { getGamePage, getGamesPage } from "@/core/model";
import { GamesPage } from "@/pages/gamesPage";
import { ChalkBoardChallengeGame } from "@/games/ChalkBoardChallenge";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GamesPage />} />
        <Route path={getGamesPage()} element={<GamesPage />} />
        <Route
          path={getGamePage("chalkboard_challenge")}
          element={<ChalkBoardChallengeGame />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
