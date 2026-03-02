import { BaseScene } from "@/core/lib/baseScene";
import { SCENES } from "../config";
import type { Physics } from "phaser";

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
  ballons!: Physics.Arcade.Group;

  score = 0;
  difficulty = 1;
  speed = 1;
  count = 1;
  interval = 3000;

  MAX_DIFF = 5;
  MAX_SPEED = 5;
  POINTS_PER_HIT = 5;

  constructor() {
    super({ sceneKey: SCENES.GAME });
  }

  create() {
    this.scene.launch(SCENES.HUD);
    this.createQuestion();
  }

  handleAnswer() {}

  createQuestion() {
    const width = this.utils.gameWidth;
    const height = this.utils.gameHeight;

    // 1. Устанавливаем границы мира Matter, чтобы шары отскакивали от краев
    this.matter.world.setBounds(0, 0, width, height);

    // 2. Получаем данные о формах из загруженного JSON
    // Предполагаем, что ключ загрузки был 'shapes'
    const shapes = this.cache.json.get("shapes");

    for (let i = 0; i < 4; i++) {
      // Генерируем размер (для Matter логика масштабирования немного отличается)
      const rawSize = Phaser.Math.Between(50, 200);
      // utils._px() используем как базовый масштаб
      const targetWidth = this.utils._px(rawSize);

      // Координаты спавна (пока рандом, с Matter сложнее сразу учесть границы сложной формы,
      // лучше спавнить ближе к центру, они сами разлетятся)
      const x = Phaser.Math.Between(width * 0.2, width * 0.8);
      const y = Phaser.Math.Between(height * 0.2, height * 0.8);

      // 3. Создаем объект Matter Image.
      // 'balloon_img' - ключ загруженной картинки.
      // { shape: shapes.balloon } - магия! Мы передаем конкретную форму из JSON.
      const balloon = this.matter.add.image(x, y, "balloon_img", null, {
        shape: shapes.balloon,
      });

      // 4. Масштабируем объект.
      // Matter.js автоматически масштабирует и физическое тело вместе с картинкой.
      const scaleFactor = targetWidth / balloon.width; // Рассчитываем коэффициент масштабирования
      balloon.setScale(scaleFactor);

      // 5. Настройка физики Matter
      // restitution: 1 - полный отскок (как bounce в Arcade)
      // frictionAir: 0 - отсутствие сопротивления воздуха (чтобы парили бесконечно)
      balloon.setRestitution(1);
      balloon.setFrictionAir(0);
      balloon.setFriction(0); // Трение между объектами

      // 6. Задаем случайную скорость
      const speed = 5; // В Matter значения скорости меньше, чем в Arcade
      const angle = Phaser.Math.Range(-Math.PI, Math.PI); // Рандомный угол в радианах

      balloon.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

      // Дополнительно: можно запретить вращение, если шар должен всегда "стоять" ровно
      // balloon.setFixedRotation();
    }
  }
}
