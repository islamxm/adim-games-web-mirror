import { BrowserRouter, Route, Routes } from "react-router";
import { getGamePage } from "@/core/model";
import { lazy } from "react";

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

const BalloonHero = lazy(() =>
  import("@/games/BalloonHero").then((module) => ({
    default: module.BalloonHeroGame,
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
        <Route path={getGamePage("balloon_hero")} element={<BalloonHero />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
