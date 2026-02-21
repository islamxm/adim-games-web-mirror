import { SCALE_COEF } from "../model/game";
import { GameUtils } from "./gameUtils";

type BaseSceneConfig = {
  sceneKey: string;
};

export class BaseScene extends Phaser.Scene {
  public utils!: GameUtils;
  constructor({ sceneKey }: BaseSceneConfig) {
    super(sceneKey);
    this.utils = new GameUtils(this);
  }
}
