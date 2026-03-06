import { BaseScene } from "@/core/lib/baseScene";
import { SCENES } from "../config";
import bgImg from "../assets/bg.png";
import correctSound from "../assets/correct-sound.mp3";
import wrongSound from "../../../assets/wrong-sound.mp3";
import pauseIcon from "../../../assets/pause-icon.png";
import playIcon from "../assets/play-icon.png";
import quitIcon from "../assets/quit-icon.png";
import restartIcon from "../assets/restart-icon.png";
import topScoreIcon from "../assets/top-score-icon.png";
import cardFrontBg from "../assets/card-front.png";
import cardBackBg from "../assets/card-back.png";
import card1img from "../assets/card-1.png";
import card2img from "../assets/card-2.png";
import card3img from "../assets/card-3.png";
import card4img from "../assets/card-4.png";
import card5img from "../assets/card-5.png";
import card6img from "../assets/card-6.png";
import flipSound from "../assets/flip-card-sound.mp3";
import victorySound from "../assets/victory-sound.mp3";

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
    this.load.image("card1img", card1img);
    this.load.image("card2img", card2img);
    this.load.image("card3img", card3img);
    this.load.image("card4img", card4img);
    this.load.image("card5img", card5img);
    this.load.image("card6img", card6img);

    this.load.audio("correctSound", correctSound);
    this.load.audio("wrongSound", wrongSound);
    this.load.audio("flipSound", flipSound);
    this.load.audio("victorySound", victorySound);
  }

  create() {
    this.scene.launch(SCENES.BACKGROUND);
    // this.scene.launch(SCENES.GAME);
    this.utils.animatedSceneChange(SCENES.START);
  }
}
