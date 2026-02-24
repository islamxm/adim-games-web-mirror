import { BaseScene } from "@/core/lib/baseScene";
import { SCENES } from "../config";

export class BackgroundScene extends BaseScene {
  constructor() {
    super({ sceneKey: SCENES.BACKGROUND });
  }

  create() {
    this.utils.createSceneBg("bg");
  }
}
