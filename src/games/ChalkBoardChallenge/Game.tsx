"use client";
import { useEffect, useRef } from "react";

import * as Phaser from "phaser";

import { createGameConfig } from "./config";
import { useSearchParams } from "react-router";
import type { GameWindowBounds } from "@/core/model";

const CONTAINER_ID = "chalkboard-challenge-game";

export const Game = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const [searchParams] = useSearchParams();

  const width = searchParams.get("width");
  const height = searchParams.get("height");
  const topInset = searchParams.get("topInset");
  const bottomInset = searchParams.get("bottomInset");
  const gameSessionToken = searchParams.get("gameSessionToken");

  const isAvilableBounds = !!(
    width &&
    height &&
    topInset &&
    bottomInset &&
    gameSessionToken
  );

  useEffect(() => {
    if (gameRef.current || !isAvilableBounds) return;

    const bounds: GameWindowBounds = {
      width: Number(width),
      height: Number(height),
      topInset: Number(topInset),
      bottomInset: Number(bottomInset),
    };
    const config = createGameConfig(CONTAINER_ID, bounds, {
      quit: () => console.log("SEND EVENT TO NATIVE DEVICE"),
      gameSessionToken,
    });
    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [isAvilableBounds]);

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
