import { BaseScene } from "@/core/lib/baseScene";
import { SCENES } from "../config";
import bgImg from "../assets/bg.png";
import wrongIcon from "../assets/wrong-icon.png";
import rightIcon from "../assets/right-icon.png";
import playIcon from "../../../assets/play-icon.png";
import restartIcon from "../../../assets/restart-icon.png";
import quitIcon from "../../../assets/quit-icon.png";
import correctSound from "../../../assets/correct-sound.mp3";
import wrongSound from "../../../assets/wrong-sound.mp3";
import greenLeaf from "../assets/green-leaf.png";
import yellowLeaf from "../assets/yellow-leaf.png";
import longYellowButtonBg from "../assets/long-yellow-btn-bg.png";
import shortYellowButtonBg from "../assets/short-yellow-btn-bg.png";
import iconYellowButtonBg from "../assets/icon-yellow-btn-bg.png";
import nerkoOneFont from "../assets/fonts/NerkoOne-Regular.ttf";
import comboEmptyIcon from "../assets/combo-empty.png";
import comboFilledIcon from "../assets/combo-filled.png";
import topScoreIcon from "../assets/top-score-icon.png";
import tutoriaSwipeUp from "../assets/tutorial-swipe-up.png";
import tutoriaSwipeRight from "../assets/tutorial-swipe-right.png";

export class BootScene extends BaseScene {
  constructor() {
    super({ sceneKey: SCENES.BOOT });
  }

  preload() {
    this.utils.showPreloadBar();

    this.load.image("bg", bgImg);
    this.load.image("wrong-icon", wrongIcon);
    this.load.image("right-icon", rightIcon);
    this.load.image("restart-icon", restartIcon);
    this.load.image("play-icon", playIcon);
    this.load.image("quit-icon", quitIcon);
    this.load.image("green-leaf", greenLeaf);
    this.load.image("yellow-leaf", yellowLeaf);
    this.load.image("long-yellow-btn-bg", longYellowButtonBg);
    this.load.image("short-yellow-btn-bg", shortYellowButtonBg);
    this.load.image("icon-yellow-btn-bg", iconYellowButtonBg);
    this.load.image("combo-empty-icon", comboEmptyIcon);
    this.load.image("combo-filled-icon", comboFilledIcon);
    this.load.image("top-score-icon", topScoreIcon);
    this.load.image("tutorial-swipe-up", tutoriaSwipeUp);
    this.load.image("tutorial-swipe-right", tutoriaSwipeRight);

    this.load.audio("correct-sound", correctSound);
    this.load.audio("wrong-sound", wrongSound);

    this.load.font("Nerko-One-Font", nerkoOneFont);

    this.load.json({
      key: "top-score",
      url: `${import.meta.env.VITE_API_URL}game-api/ebb-flow/score`,
      xhrSettings: {
        header: "Authorization",
        headerValue: `Bearer ${this.registry.get("gameSessionToken")}`,
        responseType: "json",
      },
    });
  }

  create() {
    // const questions = this.cache.json.get("questions");
    const topScore = this.cache.json.get("top-score") || 0;
    this.registry.set("top-score", topScore);
    this.scene.launch(SCENES.BACKGROUND);
    this.utils.animatedSceneChange(SCENES.START);
  }
}
