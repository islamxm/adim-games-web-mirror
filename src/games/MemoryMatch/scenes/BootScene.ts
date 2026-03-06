import { BaseScene } from "@/core/lib/baseScene";
import { SCENES } from "../config";
import bgImg from "../assets/bg.png";
import correctSound from "../../../assets/correct-sound.mp3";
import wrongSound from "../../../assets/wrong-sound.mp3";
import pauseIcon from "../../../assets/pause-icon.png";
import playIcon from "../assets/play-icon.png";
import quitIcon from "../assets/quit-icon.png";
import restartIcon from "../assets/restart-icon.png";
import topScoreIcon from "../assets/top-score-icon.png";
import cardFrontBg from "../assets/card-front.png";
import cardBackBg from "../assets/card-back.png";

export class BootScene extends BaseScene {
  constructor() {
    super({ sceneKey: SCENES.BOOT });
  }

  preload() {
    this.utils.showPreloadBar();

    this.load.image("bg", bgImg);
    this.load.image("playIcon", playIcon);
    this.load.image("pauseIcon", pauseIcon);
    this.load.image("quitIcon", quitIcon);
    this.load.image("restartIcon", restartIcon);
    this.load.image("topScoreIcon", topScoreIcon);
    this.load.image("cardFrontBg", cardFrontBg);
    this.load.image("cardBackBg", cardBackBg);

    this.load.audio("correct-sound", correctSound);
    this.load.audio("wrong-sound", wrongSound);
  }

  create() {
    this.scene.launch(SCENES.BACKGROUND);
    // this.scene.launch(SCENES.GAME);
    this.utils.animatedSceneChange(SCENES.START);
  }
}
