import { SCALE_COEF, type GameWindowBounds } from "@/core/model/game";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import RexGesturesPlugin from "phaser3-rex-plugins/plugins/gestures-plugin.js";
import { BootScene } from "./scenes/BootScene";
import { BackgroundScene } from "./scenes/BackgroundScene";
import GameScene from "./scenes/GameScene";
import { MenuScene } from "./scenes/MenuScene";
import { HUDScene } from "./scenes/HUDScene";
import { StartScene } from "./scenes/StartScene";
import { TutorialScene } from "./scenes/TutorialScene";
import { GameOverScene } from "./scenes/GameOverScene";

export const GAME_NAME = "balloon_hero_words";

export const SCENES = {
  HUD: "HUDScene",
  MENU: "MenuScene",
  BOOT: "BootScene",
  START: "StartScene",
  TUTORIAL: "TutorialScene",
  GAME: "GameScene",
  GAME_OVER: "GameOverScene",
  BACKGROUND: "BackgroundScene",
};

export function createGameConfig(
  parent: string,
  bounds: GameWindowBounds,
  externalData?: Record<string, any>,
): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    width: bounds.width * SCALE_COEF,
    height: bounds.height * SCALE_COEF,
    parent,
    backgroundColor: "#B1A2C4",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: "arcade",
    },
    render: {
      antialias: true,
      pixelArt: false,
    },
    scene: [
      BootScene,
      BackgroundScene,
      StartScene,
      TutorialScene,
      GameScene,
      HUDScene,
      MenuScene,
      GameOverScene,
    ],
    callbacks: {
      preBoot: (game) => {
        game.registry.set("bounds", bounds);
        if (externalData) {
          Object.entries(externalData).forEach(([key, value]) => {
            game.registry.set(key, value);
          });
        }
      },
    },
    plugins: {
      scene: [
        { key: "rexUI", plugin: RexUIPlugin, start: true, mapping: "rexUI" },
        {
          key: "rexGestures",
          plugin: RexGesturesPlugin,
          start: true,
          mapping: "rexGestures",
        },
      ],
    },
  };
}

export type Question = {
  correct: number;
  value: string;
  variants: Array<string>;
};

export const prepareGameData = (data: Array<Question>) => {
  const shuffledData = JSON.parse(JSON.stringify(data));

  for (let i = shuffledData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
  }

  shuffledData.forEach((item: Question) => {
    const correctAnswer = item.variants[item.correct];

    for (let i = item.variants.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [item.variants[i], item.variants[j]] = [
        item.variants[j],
        item.variants[i],
      ];
    }

    item.correct = item.variants.indexOf(correctAnswer);
  });

  return shuffledData;
};

export const questionsMockRu = [
  { variants: ["cat", "dog", "bird"], correct: 0, value: "кот" },
  { variants: ["apple", "dog", "mouse", "fish"], correct: 1, value: "собака" },
  { variants: ["sun", "moon", "bird", "star"], correct: 2, value: "птица" },
  { variants: ["fish", "meat", "cheese"], correct: 0, value: "рыба" },
  {
    variants: ["car", "bus", "mouse", "train", "bike"],
    correct: 2,
    value: "мышь",
  },
  { variants: ["cow", "pig", "horse"], correct: 0, value: "корова" },
  { variants: ["chicken", "pig", "duck"], correct: 1, value: "свинья" },
  { variants: ["horse", "sheep", "goat", "cow"], correct: 0, value: "лошадь" },
  { variants: ["bear", "wolf", "fox"], correct: 0, value: "медведь" },
  { variants: ["tiger", "lion", "wolf", "bear"], correct: 2, value: "волк" },
  { variants: ["fox", "rabbit", "hare"], correct: 0, value: "лиса" },
  { variants: ["lion", "tiger", "cat", "dog"], correct: 0, value: "лев" },
  { variants: ["elephant", "tiger", "monkey"], correct: 1, value: "тигр" },
  { variants: ["snake", "frog", "monkey"], correct: 2, value: "обезьяна" },
  {
    variants: ["frog", "toad", "snake", "lizard"],
    correct: 0,
    value: "лягушка",
  },
  { variants: ["red", "blue", "green"], correct: 0, value: "красный" },
  {
    variants: ["black", "blue", "white", "yellow"],
    correct: 1,
    value: "синий",
  },
  { variants: ["yellow", "green", "red"], correct: 1, value: "зеленый" },
  {
    variants: ["pink", "black", "yellow", "white"],
    correct: 2,
    value: "желтый",
  },
  { variants: ["white", "black", "gray"], correct: 1, value: "черный" },
  {
    variants: ["brown", "white", "gray", "red", "blue"],
    correct: 1,
    value: "белый",
  },
  { variants: ["gray", "brown", "pink"], correct: 0, value: "серый" },
  {
    variants: ["pink", "purple", "brown", "orange"],
    correct: 2,
    value: "коричневый",
  },
  { variants: ["orange", "pink", "purple"], correct: 0, value: "оранжевый" },
  { variants: ["purple", "pink", "red"], correct: 1, value: "розовый" },
  { variants: ["apple", "banana", "orange"], correct: 0, value: "яблоко" },
  { variants: ["lemon", "banana", "grape"], correct: 1, value: "банан" },
  {
    variants: ["lemon", "orange", "pear", "peach"],
    correct: 0,
    value: "лимон",
  },
  { variants: ["pear", "apple", "peach", "plum"], correct: 0, value: "груша" },
  { variants: ["tomato", "potato", "cucumber"], correct: 0, value: "помидор" },
  { variants: ["carrot", "potato", "onion"], correct: 1, value: "картофель" },
  {
    variants: ["onion", "garlic", "carrot", "pepper"],
    correct: 0,
    value: "лук",
  },
  { variants: ["milk", "water", "juice"], correct: 0, value: "молоко" },
  { variants: ["tea", "water", "coffee", "juice"], correct: 1, value: "вода" },
  { variants: ["coffee", "tea", "milk"], correct: 1, value: "чай" },
  { variants: ["bread", "cheese", "meat"], correct: 0, value: "хлеб" },
  { variants: ["meat", "fish", "cheese", "egg"], correct: 2, value: "сыр" },
  { variants: ["egg", "meat", "chicken"], correct: 1, value: "мясо" },
  { variants: ["soup", "egg", "salad", "pizza"], correct: 1, value: "яйцо" },
  { variants: ["salt", "sugar", "pepper"], correct: 0, value: "соль" },
  { variants: ["sugar", "salt", "flour", "rice"], correct: 0, value: "сахар" },
  { variants: ["tree", "flower", "grass"], correct: 0, value: "дерево" },
  { variants: ["grass", "flower", "leaf"], correct: 1, value: "цветок" },
  { variants: ["leaf", "grass", "tree", "bush"], correct: 1, value: "трава" },
  {
    variants: ["sun", "moon", "star", "cloud", "sky"],
    correct: 0,
    value: "солнце",
  },
  { variants: ["star", "moon", "sun"], correct: 1, value: "луна" },
  { variants: ["cloud", "sky", "star"], correct: 2, value: "звезда" },
  { variants: ["sky", "cloud", "rain", "snow"], correct: 0, value: "небо" },
  { variants: ["rain", "cloud", "wind"], correct: 1, value: "облако" },
  { variants: ["snow", "rain", "wind", "storm"], correct: 1, value: "дождь" },
  { variants: ["ice", "snow", "water"], correct: 1, value: "снег" },
  { variants: ["wind", "storm", "ice", "fire"], correct: 0, value: "ветер" },
  { variants: ["water", "fire", "ice"], correct: 1, value: "огонь" },
  { variants: ["river", "lake", "sea", "ocean"], correct: 0, value: "река" },
  { variants: ["lake", "sea", "river"], correct: 0, value: "озеро" },
  { variants: ["ocean", "lake", "sea", "pool"], correct: 2, value: "море" },
  {
    variants: ["mountain", "hill", "stone", "rock"],
    correct: 0,
    value: "гора",
  },
  { variants: ["stone", "sand", "mountain"], correct: 0, value: "камень" },
  { variants: ["sand", "stone", "earth"], correct: 0, value: "песок" },
  { variants: ["house", "room", "door"], correct: 0, value: "дом" },
  {
    variants: ["door", "room", "window", "wall"],
    correct: 1,
    value: "комната",
  },
  { variants: ["window", "door", "wall"], correct: 1, value: "дверь" },
  { variants: ["wall", "roof", "window", "floor"], correct: 2, value: "окно" },
  { variants: ["floor", "wall", "roof"], correct: 1, value: "стена" },
  { variants: ["roof", "floor", "ceiling", "door"], correct: 1, value: "пол" },
  { variants: ["table", "chair", "bed"], correct: 0, value: "стол" },
  { variants: ["bed", "chair", "sofa", "table"], correct: 1, value: "стул" },
  { variants: ["sofa", "bed", "chair"], correct: 1, value: "кровать" },
  { variants: ["book", "pen", "pencil", "paper"], correct: 0, value: "книга" },
  { variants: ["pencil", "pen", "paper"], correct: 1, value: "ручка" },
  {
    variants: ["paper", "pen", "pencil", "book"],
    correct: 2,
    value: "карандаш",
  },
  { variants: ["letter", "paper", "book"], correct: 1, value: "бумага" },
  { variants: ["bag", "box", "cup", "plate"], correct: 0, value: "сумка" },
  { variants: ["box", "bag", "glass"], correct: 0, value: "коробка" },
  { variants: ["plate", "cup", "glass"], correct: 1, value: "чашка" },
  { variants: ["glass", "plate", "cup", "bowl"], correct: 1, value: "тарелка" },
  { variants: ["knife", "fork", "spoon"], correct: 0, value: "нож" },
  { variants: ["spoon", "fork", "knife", "plate"], correct: 1, value: "вилка" },
  { variants: ["fork", "spoon", "knife"], correct: 1, value: "ложка" },
  { variants: ["clock", "watch", "time", "hour"], correct: 0, value: "часы" },
  { variants: ["phone", "computer", "tv"], correct: 0, value: "телефон" },
  {
    variants: ["tv", "radio", "computer", "phone"],
    correct: 2,
    value: "компьютер",
  },
  { variants: ["car", "bus", "train", "bike"], correct: 0, value: "машина" },
  { variants: ["train", "bus", "car"], correct: 1, value: "автобус" },
  { variants: ["plane", "train", "boat", "bus"], correct: 1, value: "поезд" },
  { variants: ["boat", "plane", "car"], correct: 1, value: "самолет" },
  { variants: ["ship", "boat", "plane", "train"], correct: 1, value: "лодка" },
  { variants: ["bike", "car", "bus"], correct: 0, value: "велосипед" },
  { variants: ["boy", "girl", "man", "woman"], correct: 0, value: "мальчик" },
  { variants: ["woman", "girl", "boy", "man"], correct: 1, value: "девочка" },
  { variants: ["man", "woman", "boy"], correct: 0, value: "мужчина" },
  { variants: ["girl", "man", "woman", "boy"], correct: 2, value: "женщина" },
  { variants: ["father", "mother", "brother"], correct: 0, value: "отец" },
  {
    variants: ["brother", "mother", "father", "sister"],
    correct: 1,
    value: "мать",
  },
  { variants: ["sister", "brother", "son"], correct: 1, value: "брат" },
  {
    variants: ["brother", "sister", "daughter", "son"],
    correct: 1,
    value: "сестра",
  },
  { variants: ["son", "daughter", "father"], correct: 0, value: "сын" },
  {
    variants: ["son", "daughter", "mother", "sister"],
    correct: 1,
    value: "дочь",
  },
  { variants: ["friend", "enemy", "brother"], correct: 0, value: "друг" },
  { variants: ["head", "hand", "leg", "arm"], correct: 0, value: "голова" },
  { variants: ["leg", "arm", "hand"], correct: 2, value: "рука" },
  { variants: ["arm", "leg", "foot", "hand"], correct: 1, value: "нога" },
  { variants: ["eye", "ear", "nose"], correct: 0, value: "глаз" },
  { variants: ["nose", "eye", "ear", "mouth"], correct: 2, value: "ухо" },
  { variants: ["ear", "mouth", "nose"], correct: 2, value: "нос" },
  { variants: ["mouth", "nose", "eye", "tooth"], correct: 0, value: "рот" },
  { variants: ["hair", "tooth", "mouth"], correct: 1, value: "зуб" },
  { variants: ["face", "hair", "head", "eye"], correct: 1, value: "волосы" },
  { variants: ["head", "face", "hair"], correct: 1, value: "лицо" },
  { variants: ["heart", "blood", "bone"], correct: 0, value: "сердце" },
  {
    variants: ["shirt", "pants", "dress", "skirt"],
    correct: 0,
    value: "рубашка",
  },
  { variants: ["dress", "skirt", "shirt"], correct: 1, value: "юбка" },
  {
    variants: ["skirt", "pants", "dress", "coat"],
    correct: 2,
    value: "платье",
  },
  { variants: ["coat", "jacket", "shirt"], correct: 0, value: "пальто" },
  { variants: ["shoe", "sock", "hat", "glove"], correct: 2, value: "шапка" },
  { variants: ["hat", "shoe", "sock"], correct: 1, value: "обувь" },
  { variants: ["sock", "shoe", "glove", "hat"], correct: 0, value: "носок" },
  { variants: ["day", "night", "morning"], correct: 0, value: "день" },
  {
    variants: ["evening", "night", "day", "morning"],
    correct: 1,
    value: "ночь",
  },
  { variants: ["morning", "evening", "night"], correct: 0, value: "утро" },
  {
    variants: ["night", "morning", "evening", "day"],
    correct: 2,
    value: "вечер",
  },
  { variants: ["week", "month", "year"], correct: 0, value: "неделя" },
  { variants: ["year", "week", "month", "day"], correct: 2, value: "месяц" },
  { variants: ["month", "year", "week"], correct: 1, value: "год" },
  {
    variants: ["today", "tomorrow", "yesterday"],
    correct: 0,
    value: "сегодня",
  },
  { variants: ["yesterday", "today", "tomorrow"], correct: 2, value: "завтра" },
  { variants: ["tomorrow", "yesterday", "today"], correct: 1, value: "вчера" },
  { variants: ["time", "hour", "minute"], correct: 0, value: "время" },
  { variants: ["minute", "second", "hour"], correct: 2, value: "час" },
  {
    variants: ["hour", "minute", "second", "time"],
    correct: 1,
    value: "минута",
  },
  { variants: ["good", "bad", "big"], correct: 0, value: "хороший" },
  { variants: ["small", "good", "bad", "big"], correct: 2, value: "плохой" },
  { variants: ["big", "small", "long"], correct: 0, value: "большой" },
  {
    variants: ["long", "short", "big", "small"],
    correct: 3,
    value: "маленький",
  },
  { variants: ["short", "long", "tall"], correct: 1, value: "длинный" },
  { variants: ["long", "tall", "short", "big"], correct: 2, value: "короткий" },
  { variants: ["new", "old", "young"], correct: 0, value: "новый" },
  { variants: ["young", "new", "old", "fast"], correct: 2, value: "старый" },
  { variants: ["old", "young", "new"], correct: 1, value: "молодой" },
  { variants: ["hot", "cold", "warm"], correct: 0, value: "горячий" },
  { variants: ["warm", "cold", "hot", "cool"], correct: 1, value: "холодный" },
  { variants: ["cold", "hot", "warm"], correct: 2, value: "теплый" },
  { variants: ["fast", "slow", "quick"], correct: 0, value: "быстрый" },
  {
    variants: ["quick", "fast", "slow", "good"],
    correct: 2,
    value: "медленный",
  },
  { variants: ["hard", "easy", "soft"], correct: 0, value: "трудный" },
  { variants: ["soft", "hard", "easy", "simple"], correct: 2, value: "легкий" },
  { variants: ["clean", "dirty", "wet"], correct: 0, value: "чистый" },
  { variants: ["wet", "clean", "dirty", "dry"], correct: 2, value: "грязный" },
  { variants: ["dry", "wet", "clean"], correct: 1, value: "мокрый" },
  { variants: ["wet", "dry", "dirty", "clean"], correct: 1, value: "сухой" },
  { variants: ["happy", "sad", "angry"], correct: 0, value: "счастливый" },
  {
    variants: ["angry", "happy", "sad", "tired"],
    correct: 2,
    value: "грустный",
  },
  { variants: ["sad", "angry", "happy"], correct: 1, value: "злой" },
  { variants: ["beautiful", "ugly", "nice"], correct: 0, value: "красивый" },
  {
    variants: ["nice", "beautiful", "ugly", "bad"],
    correct: 2,
    value: "уродливый",
  },
  { variants: ["strong", "weak", "fast"], correct: 0, value: "сильный" },
  { variants: ["weak", "strong", "slow", "bad"], correct: 0, value: "слабый" },
  { variants: ["expensive", "cheap", "rich"], correct: 0, value: "дорогой" },
  { variants: ["rich", "expensive", "cheap"], correct: 2, value: "дешевый" },
  { variants: ["poor", "rich", "cheap"], correct: 1, value: "богатый" },
  { variants: ["rich", "poor", "sad", "bad"], correct: 1, value: "бедный" },
  { variants: ["do", "make", "take"], correct: 0, value: "делать" },
  { variants: ["take", "give", "have", "do"], correct: 1, value: "давать" },
  { variants: ["give", "take", "get"], correct: 1, value: "брать" },
  { variants: ["go", "come", "run", "walk"], correct: 0, value: "идти" },
  { variants: ["walk", "run", "go"], correct: 1, value: "бежать" },
  { variants: ["jump", "run", "walk", "fly"], correct: 0, value: "прыгать" },
  { variants: ["fly", "swim", "jump"], correct: 0, value: "летать" },
  { variants: ["run", "fly", "swim", "go"], correct: 2, value: "плавать" },
  { variants: ["see", "look", "watch"], correct: 0, value: "видеть" },
  {
    variants: ["watch", "see", "hear", "listen"],
    correct: 2,
    value: "слышать",
  },
  { variants: ["say", "speak", "tell"], correct: 0, value: "сказать" },
  { variants: ["tell", "say", "speak", "talk"], correct: 2, value: "говорить" },
  { variants: ["read", "write", "listen"], correct: 0, value: "читать" },
  {
    variants: ["read", "listen", "write", "speak"],
    correct: 2,
    value: "писать",
  },
  { variants: ["think", "know", "understand"], correct: 0, value: "думать" },
  {
    variants: ["understand", "think", "know", "remember"],
    correct: 2,
    value: "знать",
  },
  { variants: ["love", "like", "hate"], correct: 0, value: "любить" },
  {
    variants: ["like", "hate", "love", "want"],
    correct: 1,
    value: "ненавидеть",
  },
  { variants: ["want", "need", "like"], correct: 0, value: "хотеть" },
  { variants: ["eat", "drink", "cook", "sleep"], correct: 0, value: "есть" },
  { variants: ["cook", "eat", "drink"], correct: 2, value: "пить" },
  { variants: ["sleep", "wake", "drink", "eat"], correct: 0, value: "спать" },
  { variants: ["play", "work", "rest"], correct: 0, value: "играть" },
  {
    variants: ["rest", "play", "work", "study"],
    correct: 2,
    value: "работать",
  },
  { variants: ["buy", "sell", "pay"], correct: 0, value: "покупать" },
  { variants: ["pay", "buy", "sell", "take"], correct: 2, value: "продавать" },
  { variants: ["open", "close", "break"], correct: 0, value: "открывать" },
  {
    variants: ["break", "open", "close", "fix"],
    correct: 2,
    value: "закрывать",
  },
  { variants: ["start", "stop", "finish"], correct: 0, value: "начинать" },
  {
    variants: ["finish", "start", "stop", "end"],
    correct: 2,
    value: "останавливать",
  },
  { variants: ["help", "use", "find"], correct: 0, value: "помогать" },
  { variants: ["use", "help", "find", "lose"], correct: 2, value: "находить" },
  { variants: ["lose", "find", "use"], correct: 0, value: "терять" },
  { variants: ["ask", "answer", "tell"], correct: 0, value: "спрашивать" },
  { variants: ["tell", "ask", "answer", "say"], correct: 2, value: "отвечать" },
  { variants: ["laugh", "cry", "smile"], correct: 0, value: "смеяться" },
  { variants: ["smile", "laugh", "cry", "sad"], correct: 2, value: "плакать" },
  { variants: ["live", "die", "born"], correct: 0, value: "жить" },
  { variants: ["die", "live", "grow", "born"], correct: 0, value: "умирать" },
  { variants: ["music", "song", "dance"], correct: 0, value: "музыка" },
  { variants: ["dance", "song", "music", "art"], correct: 1, value: "песня" },
  { variants: ["art", "dance", "song"], correct: 1, value: "танец" },
  { variants: ["book", "movie", "game", "art"], correct: 1, value: "фильм" },
  { variants: ["game", "movie", "book"], correct: 0, value: "игра" },
  {
    variants: ["city", "town", "village", "street"],
    correct: 0,
    value: "город",
  },
  { variants: ["street", "city", "road"], correct: 0, value: "улица" },
  {
    variants: ["road", "street", "bridge", "city"],
    correct: 0,
    value: "дорога",
  },
  { variants: ["park", "garden", "forest"], correct: 0, value: "парк" },
  { variants: ["forest", "park", "garden", "tree"], correct: 0, value: "лес" },
  { variants: ["school", "university", "class"], correct: 0, value: "школа" },
  {
    variants: ["class", "school", "student", "teacher"],
    correct: 3,
    value: "учитель",
  },
  { variants: ["teacher", "student", "class"], correct: 1, value: "ученик" },
  {
    variants: ["doctor", "nurse", "hospital", "patient"],
    correct: 0,
    value: "врач",
  },
  { variants: ["hospital", "doctor", "clinic"], correct: 0, value: "больница" },
];

export const questionsMockTkm = [
  { variants: ["cat", "dog", "bird"], correct: 0, value: "pişik" },
  { variants: ["apple", "dog", "mouse", "fish"], correct: 1, value: "it" },
  { variants: ["sun", "moon", "bird", "star"], correct: 2, value: "guş" },
  { variants: ["fish", "meat", "cheese"], correct: 0, value: "balyk" },
  {
    variants: ["car", "bus", "mouse", "train", "bike"],
    correct: 2,
    value: "syçan",
  },
  { variants: ["cow", "pig", "horse"], correct: 0, value: "sygyr" },
  { variants: ["chicken", "pig", "duck"], correct: 1, value: "doňuz" },
  { variants: ["horse", "sheep", "goat", "cow"], correct: 0, value: "at" },
  { variants: ["bear", "wolf", "fox"], correct: 0, value: "aýy" },
  { variants: ["tiger", "lion", "wolf", "bear"], correct: 2, value: "möjek" },
  { variants: ["fox", "rabbit", "hare"], correct: 0, value: "tilki" },
  { variants: ["lion", "tiger", "cat", "dog"], correct: 0, value: "ýolbars" },
  { variants: ["elephant", "tiger", "monkey"], correct: 1, value: "gaplaň" },
  { variants: ["snake", "frog", "monkey"], correct: 2, value: "maýmyn" },
  {
    variants: ["frog", "toad", "snake", "lizard"],
    correct: 0,
    value: "gurbaga",
  },
  { variants: ["red", "blue", "green"], correct: 0, value: "gyzyl" },
  { variants: ["black", "blue", "white", "yellow"], correct: 1, value: "gök" },
  { variants: ["yellow", "green", "red"], correct: 1, value: "ýaşyl" },
  { variants: ["pink", "black", "yellow", "white"], correct: 2, value: "sary" },
  { variants: ["white", "black", "gray"], correct: 1, value: "gara" },
  {
    variants: ["brown", "white", "gray", "red", "blue"],
    correct: 1,
    value: "ak",
  },
  { variants: ["gray", "brown", "pink"], correct: 0, value: "çal" },
  {
    variants: ["pink", "purple", "brown", "orange"],
    correct: 2,
    value: "goňur",
  },
  { variants: ["orange", "pink", "purple"], correct: 0, value: "mämişi" },
  { variants: ["purple", "pink", "red"], correct: 1, value: "gülgüne" },
  { variants: ["apple", "banana", "orange"], correct: 0, value: "alma" },
  { variants: ["lemon", "banana", "grape"], correct: 1, value: "banan" },
  {
    variants: ["lemon", "orange", "pear", "peach"],
    correct: 0,
    value: "limon",
  },
  { variants: ["pear", "apple", "peach", "plum"], correct: 0, value: "armyt" },
  { variants: ["tomato", "potato", "cucumber"], correct: 0, value: "pomidor" },
  { variants: ["carrot", "potato", "onion"], correct: 1, value: "ýeralma" },
  {
    variants: ["onion", "garlic", "carrot", "pepper"],
    correct: 0,
    value: "sogan",
  },
  { variants: ["milk", "water", "juice"], correct: 0, value: "süýt" },
  { variants: ["tea", "water", "coffee", "juice"], correct: 1, value: "suw" },
  { variants: ["coffee", "tea", "milk"], correct: 1, value: "çaý" },
  { variants: ["bread", "cheese", "meat"], correct: 0, value: "çörek" },
  { variants: ["meat", "fish", "cheese", "egg"], correct: 2, value: "peýnir" },
  { variants: ["egg", "meat", "chicken"], correct: 1, value: "et" },
  {
    variants: ["soup", "egg", "salad", "pizza"],
    correct: 1,
    value: "ýumurtga",
  },
  { variants: ["salt", "sugar", "pepper"], correct: 0, value: "duz" },
  { variants: ["sugar", "salt", "flour", "rice"], correct: 0, value: "şeker" },
  { variants: ["tree", "flower", "grass"], correct: 0, value: "agaç" },
  { variants: ["grass", "flower", "leaf"], correct: 1, value: "gül" },
  { variants: ["leaf", "grass", "tree", "bush"], correct: 1, value: "ot" },
  {
    variants: ["sun", "moon", "star", "cloud", "sky"],
    correct: 0,
    value: "gün",
  },
  { variants: ["star", "moon", "sun"], correct: 1, value: "aý" },
  { variants: ["cloud", "sky", "star"], correct: 2, value: "ýyldyz" },
  { variants: ["sky", "cloud", "rain", "snow"], correct: 0, value: "asman" },
  { variants: ["rain", "cloud", "wind"], correct: 1, value: "bulut" },
  { variants: ["snow", "rain", "wind", "storm"], correct: 1, value: "ýagyş" },
  { variants: ["ice", "snow", "water"], correct: 1, value: "gar" },
  { variants: ["wind", "storm", "ice", "fire"], correct: 0, value: "şemal" },
  { variants: ["water", "fire", "ice"], correct: 1, value: "ot" },
  { variants: ["river", "lake", "sea", "ocean"], correct: 0, value: "derýa" },
  { variants: ["lake", "sea", "river"], correct: 0, value: "köl" },
  { variants: ["ocean", "lake", "sea", "pool"], correct: 2, value: "deňiz" },
  { variants: ["mountain", "hill", "stone", "rock"], correct: 0, value: "dag" },
  { variants: ["stone", "sand", "mountain"], correct: 0, value: "daş" },
  { variants: ["sand", "stone", "earth"], correct: 0, value: "çäge" },
  { variants: ["house", "room", "door"], correct: 0, value: "öý" },
  { variants: ["door", "room", "window", "wall"], correct: 1, value: "otag" },
  { variants: ["window", "door", "wall"], correct: 1, value: "gapy" },
  {
    variants: ["wall", "roof", "window", "floor"],
    correct: 2,
    value: "penjire",
  },
  { variants: ["floor", "wall", "roof"], correct: 1, value: "diwar" },
  { variants: ["roof", "floor", "ceiling", "door"], correct: 1, value: "pol" },
  { variants: ["table", "chair", "bed"], correct: 0, value: "stol" },
  { variants: ["bed", "chair", "sofa", "table"], correct: 1, value: "oturgyç" },
  { variants: ["sofa", "bed", "chair"], correct: 1, value: "krowat" },
  { variants: ["book", "pen", "pencil", "paper"], correct: 0, value: "kitap" },
  { variants: ["pencil", "pen", "paper"], correct: 1, value: "ruçka" },
  { variants: ["paper", "pen", "pencil", "book"], correct: 2, value: "galam" },
  { variants: ["letter", "paper", "book"], correct: 1, value: "kagyz" },
];
