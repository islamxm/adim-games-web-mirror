import { BaseScene } from "@/core/lib/baseScene";
import { SCENES } from "../config";

const SCORE_BASE = 5;

type Question = {
  id: number;
  text: string;
  answer: number;
  speed: number;
};

export default class GameScene extends BaseScene {
  private gameDuration = 60;
  private startCountdown = 3;
  private scoreMultiplier = 1;
  private comboCount = 0;

  score = 0;
  difficulty = 1;
  speed = 1;
  count = 1;
  interval = 3;

  MAX_DIFF = 5;
  MAX_SPEED = 400;
  POINTS_PER_HIT = 5;

  constructor() {
    super({ sceneKey: SCENES.GAME });
  }

  create() {
    this.scene.launch(SCENES.HUD);
  }

  generateQuestion(): Question {
    this.count++;

    if (this.count % 5 === 0) {
      this.difficulty = Math.min(this.difficulty + 1, this.MAX_DIFF);
    }
    if (this.count % 10 === 0) {
      this.speed = Math.min(this.speed + 1, this.MAX_SPEED);
    }

    return this.createProblem();
  }

  createProblem(): Question {
    let a, b, answer;

    const operators = ["+"];
    if (this.difficulty >= 2) operators.push("-");
    if (this.difficulty >= 3) operators.push("*");

    const operator = Phaser.Utils.Array.GetRandom(operators);

    if (operator === "+") {
      const maxSum = Math.min(20 * this.difficulty, 99);
      a = Phaser.Math.Between(1, maxSum - 1);
      b = Phaser.Math.Between(1, maxSum - a);
      answer = a + b;
    } else if (operator === "-") {
      const maxVal = Math.min(20 * this.difficulty, 99);
      a = Phaser.Math.Between(10, maxVal);
      b = Phaser.Math.Between(1, a);
      answer = a - b;
    } else if (operator === "*") {
      const maxFactorA = Math.min(2 + this.difficulty, 9);
      const maxFactorB = Math.min(5 + this.difficulty, 11);

      a = Phaser.Math.Between(2, maxFactorA);
      b = Phaser.Math.Between(2, maxFactorB);

      if (Math.random() > 0.5) [a, b] = [b, a];

      answer = a * b;
    }
    return {
      text: `${a}${operator}${b}`,
      answer: answer as number,
      id: Date.now(),
      speed: this.speed,
    };
  }
}
