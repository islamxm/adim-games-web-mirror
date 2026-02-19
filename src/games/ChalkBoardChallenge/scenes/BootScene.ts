import * as Phaser from "phaser";
import { GameUtils } from "@/core/lib/gameUtils";
import bgImg from "../assets/chalkboard-challenge-bg.png";
import pauseIcon from "../assets/pause-icon.svg";
import wrongIcon from "../assets/wrong-icon.svg";
import rightIcon from "../assets/right-icon.svg";
import menuResumeIcon from "../assets/menu-resume-icon.svg";
import menuRestartIcon from "../assets/menu-restart-icon.svg";
import menuQuitIcon from "../assets/menu-quit-icon.svg";
import leftArrowIcon from "../assets/left-arrow-icon.svg";
import rightArrowIcon from "../assets/right-arrow-icon.svg";
import correctSound from "../assets/correct-sound.mp3";
import wrongSound from "../assets/wrong-sound.mp3";

import { questionsMock, SCENES } from "../config";

export class BootScene extends Phaser.Scene {
  private utils!: GameUtils;

  constructor() {
    super({ key: SCENES.BOOT });
  }

  preload() {
    this.utils = new GameUtils(this);
    this.utils.showPreloadBar();

    this.load.image("bg", bgImg);
    this.load.image("pause-icon", pauseIcon);
    this.load.image("wrong-icon", wrongIcon);
    this.load.image("right-icon", rightIcon);
    this.load.image("menu-resume-icon", menuResumeIcon);
    this.load.image("menu-restart-icon", menuRestartIcon);
    this.load.image("menu-quit-icon", menuQuitIcon);
    this.load.image("left-arrow-icon", leftArrowIcon);
    this.load.image("right-arrow-icon", rightArrowIcon);

    this.load.audio("correct-sound", correctSound);
    this.load.audio("wrong-sound", wrongSound);

    this.registry.set("questions", questionsMock);
  }

  create() {
    this.utils.animatedSceneChange(SCENES.TUTORIAL);
  }
}
