import { BaseScene } from "@/core/lib/baseScene";
import { SCENES } from "../config";
import bgImg from "../assets/bg.png";
import cloudImg from "../assets/cloud.png";
import btnBigBg from "../assets/btn-big-bg.png";
import btnSmallBg from "../assets/btn-small-bg.png";
import gameOverImg from "../assets/game-over-img.png";
import balloonImg from "../assets/balloon.png";
import balloonDeflateSound from "../assets/balloon-deflate-sound.mp3";
import balloonPopSound from "../assets/balloon-pop-sound.mp3";
import nerkoOneFont from "../assets/fonts/NerkoOne-Regular.ttf";
import comboEmptyIcon from "../assets/combo-empty.png";
import comboFilledIcon from "../assets/combo-filled.png";
import wrongIcon from "../assets/wrong-icon.png";
import correctIcon from "../assets/right-icon.png";
import correctSound from "../../../assets/correct-sound.mp3";
import wrongSound from "../../../assets/wrong-sound.mp3";

export class BootScene extends BaseScene {
  constructor() {
    super({ sceneKey: SCENES.BOOT });
  }

  preload() {
    this.utils.showPreloadBar();

    this.load.image("bg", bgImg);
    this.load.image("cloud", cloudImg);
    this.load.image("btnBigBg", btnBigBg);
    this.load.image("btnSmallBg", btnSmallBg);
    this.load.image("gameOverImg", gameOverImg);
    this.load.image("balloonImg", balloonImg);
    this.load.image("comboEmptyIcon", comboEmptyIcon);
    this.load.image("comboFilledIcon", comboFilledIcon);
    this.load.image("wrongIcon", wrongIcon);
    this.load.image("correctIcon", correctIcon);

    this.load.audio("balloonDeflateSound", balloonDeflateSound);
    this.load.audio("balloonPopSound", balloonPopSound);
    this.load.audio("wrongSound", wrongSound);
    this.load.audio("correctSound", correctSound);

    this.load.font("Nerko-One-Font", nerkoOneFont);

    this.load.json({
      key: "gameData",
      url: `${import.meta.env.VITE_API_URL}game-api/math-balloon/score`,
      xhrSettings: {
        header: "Authorization",
        headerValue: `Bearer ${this.registry.get("gameSessionToken")}`,
        responseType: "",
      },
    });

    this.load.json({
      key: "questions",
      url: `${import.meta.env.VITE_API_URL}game-api/math-balloon/questions`,
      xhrSettings: {
        header: "Authorization",
        headerValue: `Bearer ${this.registry.get("gameSessionToken")}`,
        responseType: "",
      },
    });
  }

  create() {
    const gameData = this.cache.json.get("gameData");
    const questions = this.cache.json.get("questions");
    this.registry.set("gameData", gameData);
    this.registry.set("questions", questions?.questions || []);
    this.scene.launch(SCENES.BACKGROUND);
    this.utils.animatedSceneChange(SCENES.START);
  }
}
