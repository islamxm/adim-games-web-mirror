"use client";
import { useEffect, useRef } from "react";

import * as Phaser from "phaser";

import { createGameConfig } from "./config";
import { useNavigate } from "react-router";

const CONTAINER_ID = "chalkboard-challenge-game";

export const Game = () => {
  const navigate = useNavigate();
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return;

    const config = createGameConfig(CONTAINER_ID, {
      quit: () => navigate("/games"),
    });
    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div
      id={CONTAINER_ID}
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    />
  );
};
