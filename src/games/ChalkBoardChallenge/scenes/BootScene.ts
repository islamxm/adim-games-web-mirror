import bgImg from "../assets/chalkboard-challenge-bg.png";
import pauseIcon from "../assets/pause-icon.png";
import wrongIcon from "../assets/wrong-icon.svg";
import rightIcon from "../assets/right-icon.svg";
import playIcon from "../assets/play-icon.png";
import restartIcon from "../assets/restart-icon.png";
import quitIcon from "../assets/quit-icon.png";
import arrowLeftIcon from "../assets/arrow-left-icon.png";
import arrowRightIcon from "../assets/arrow-right-icon.png";
import correctSound from "../assets/correct-sound.mp3";
import wrongSound from "../assets/wrong-sound.mp3";

import { SCENES } from "../config";
import { BaseScene } from "@/core/lib/baseScene";

export class BootScene extends BaseScene {
  constructor() {
    super({ sceneKey: SCENES.BOOT });
  }

  preload() {
    this.utils.showPreloadBar();

    this.load.image("bg", bgImg);
    this.load.image("pause-icon", pauseIcon);
    this.load.image("wrong-icon", wrongIcon);
    this.load.image("right-icon", rightIcon);
    this.load.image("restart-icon", restartIcon);
    this.load.image("quit-icon", quitIcon);
    this.load.image("arrow-left-icon", arrowLeftIcon);
    this.load.image("arrow-right-icon", arrowRightIcon);
    this.load.image("play-icon", playIcon);

    this.load.audio("correct-sound", correctSound);
    this.load.audio("wrong-sound", wrongSound);

    this.load.json(
      "questions",
      `${import.meta.env.VITE_API_URL}games/chalkboard/questions`,
    );
  }

  create() {
    const questions = this.cache.json.get("questions");
    this.registry.set("questions", questions?.questions || []);
    this.scene.launch(SCENES.BACKGROUND);
    this.utils.animatedSceneChange(SCENES.TUTORIAL);
  }
}
