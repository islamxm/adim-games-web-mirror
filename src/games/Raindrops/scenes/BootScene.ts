import { BaseScene } from "@/core/lib/baseScene";
import { SCENES } from "../config";

export class BootScene extends BaseScene {
  constructor() {
    super({ sceneKey: SCENES.BOOT });
  }

  preload() {
    this.utils.showPreloadBar();
  }

  create() {
    // this.scene.launch(SCENES.BACKGROUND);
    this.utils.animatedSceneChange(SCENES.GAME);
  }
}
