import { BrowserRouter, Route, Routes } from "react-router";
import { getGamePage } from "@/core/model";
import { lazy } from "react";
import { GAME_NAME as MEMORY_MATCH_GAME_NAME } from "@/games/MemoryMatch";

const EbbAndFlowGame = lazy(() =>
  import("@/games/EbbAndFlow").then((module) => ({
    default: module.EbbAndFlowGame,
  })),
);
const ChalkBoardChallengeGame = lazy(() =>
  import("@/games/ChalkBoardChallenge").then((module) => ({
    default: module.ChalkBoardChallengeGame,
  })),
);

const BalloonHeroGame = lazy(() =>
  import("@/games/BalloonHero").then((module) => ({
    default: module.BalloonHeroGame,
  })),
);

const BalloonHeroWordsGame = lazy(() =>
  import("@/games/BalloonHeroWords").then((module) => ({
    default: module.BalloonHeroWordsGame,
  })),
);

const BuildByWordGame = lazy(() =>
  import("@/games/BuildByWord").then((module) => ({
    default: module.BuildByWordGame,
  })),
);

const MemoryMatchGame = lazy(() =>
  import("@/games/MemoryMatch").then((module) => ({
    default: module.MemoryMatchGame,
  })),
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<></>} />
        <Route
          path={getGamePage("chalkboard_challenge")}
          element={<ChalkBoardChallengeGame />}
        />
        <Route
          path={getGamePage("ebb_and_flow")}
          element={<EbbAndFlowGame />}
        />
        <Route
          path={getGamePage("balloon_hero")}
          element={<BalloonHeroGame />}
        />
        <Route
          path={getGamePage("balloon_hero_words")}
          element={<BalloonHeroWordsGame />}
        />
        <Route
          path={getGamePage("build_by_word")}
          element={<BuildByWordGame />}
        />
        <Route
          path={getGamePage(MEMORY_MATCH_GAME_NAME)}
          element={<MemoryMatchGame />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
