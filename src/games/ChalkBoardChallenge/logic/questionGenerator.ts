export interface Question {
  leftExpression: string;
  leftValue: number;
  rightExpression: string;
  rightValue: number;
  /** "left" | "right" | "equal" */
  correctAnswer: "left" | "right" | "equal";
}

type Operator = "+" | "-" | "×";

const OPERATORS: Operator[] = ["+", "-", "×"];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateExpression(difficulty: number): { text: string; value: number } {
  const maxNum = Math.min(5 + difficulty * 3, 50);
  const op = OPERATORS[randomInt(0, Math.min(difficulty, OPERATORS.length - 1))];

  let a: number, b: number, value: number, text: string;

  switch (op) {
    case "+":
      a = randomInt(1, maxNum);
      b = randomInt(1, maxNum);
      value = a + b;
      text = `${a} + ${b}`;
      break;
    case "-":
      a = randomInt(1, maxNum);
      b = randomInt(1, a); // b <= a чтобы не было отрицательных
      value = a - b;
      text = `${a} - ${b}`;
      break;
    case "×":
      a = randomInt(1, Math.min(maxNum, 12));
      b = randomInt(1, Math.min(maxNum, 12));
      value = a * b;
      text = `${a} × ${b}`;
      break;
    default:
      a = randomInt(1, maxNum);
      b = randomInt(1, maxNum);
      value = a + b;
      text = `${a} + ${b}`;
  }

  return { text, value };
}

export function generateQuestion(difficulty: number): Question {
  const left = generateExpression(difficulty);
  const right = generateExpression(difficulty);

  let correctAnswer: Question["correctAnswer"];
  if (left.value > right.value) {
    correctAnswer = "left";
  } else if (left.value < right.value) {
    correctAnswer = "right";
  } else {
    correctAnswer = "equal";
  }

  return {
    leftExpression: left.text,
    leftValue: left.value,
    rightExpression: right.text,
    rightValue: right.value,
    correctAnswer,
  };
}
