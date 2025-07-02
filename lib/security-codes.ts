export interface SecurityCode {
  question: string
  answer: string
  type: "math" | "puzzle" | "logic"
}

export function generateSecurityCode(
  type: "math" | "puzzle" | "logic",
  difficulty: "easy' | medium" | "hard",
): SecurityCode {
  switch (type) {
    case "math":
      return generateMathCode(difficulty)
    case "puzzle":
      return generatePuzzleCode(difficulty)
    case "logic":
      return generateLogicCode(difficulty)
    default:
      return generateMathCode(difficulty)
  }
}

function generateMathCode(difficulty: "easy" | "medium" | "hard"): SecurityCode {
  let num1: number, num2: number, operator: string, answer: number

  switch (difficulty) {
    case "easy":
      num1 = Math.floor(Math.random() * 10) + 1
      num2 = Math.floor(Math.random() * 10) + 1
      operator = Math.random() > 0.5 ? "+" : "-"
      if (operator === "+") {
        answer = num1 + num2
      } else {
        if (num1 < num2) [num1, num2] = [num2, num1] // Ensure positive result
        answer = num1 - num2
      }
      break
    case "medium":
      num1 = Math.floor(Math.random() * 50) + 10
      num2 = Math.floor(Math.random() * 12) + 2
      operator = Math.random() > 0.5 ? "*" : "÷"
      if (operator === "*") {
        answer = num1 * num2
      } else {
        const product = num1 * num2
        answer = num1
        num1 = product
      }
      break
    case "hard":
      const operations = ["+", "-", "*"]
      const op1 = operations[Math.floor(Math.random() * operations.length)]
      const op2 = operations[Math.floor(Math.random() * operations.length)]

      const a = Math.floor(Math.random() * 20) + 5
      const b = Math.floor(Math.random() * 15) + 3
      const c = Math.floor(Math.random() * 10) + 2

      let result1: number
      if (op1 === "+") result1 = a + b
      else if (op1 === "-") result1 = Math.max(a, b) - Math.min(a, b)
      else result1 = a * b

      if (op2 === "+") answer = result1 + c
      else if (op2 === "-") answer = Math.max(result1, c) - Math.min(result1, c)
      else answer = result1 * c

      return {
        question: `${a} ${op1} ${b} ${op2} ${c} = ?`,
        answer: answer.toString(),
        type: "math",
      }
  }

  return {
    question: `${num1} ${operator} ${num2} = ?`,
    answer: answer.toString(),
    type: "math",
  }
}

function generatePuzzleCode(difficulty: "easy" | "medium" | "hard"): SecurityCode {
  const puzzles = {
    easy: [
      { question: "What comes next: 2, 4, 6, 8, ?", answer: "10" },
      { question: "If A=1, B=2, C=3, what is D?", answer: "4" },
      { question: "How many sides does a triangle have?", answer: "3" },
    ],
    medium: [
      { question: "What comes next: 1, 1, 2, 3, 5, ?", answer: "8" },
      { question: "If LOVE = 54, what is HATE?", answer: "35" },
      { question: "A clock shows 3:15. What angle is between the hands?", answer: "7.5" },
    ],
    hard: [
      { question: "Complete: 2, 6, 12, 20, 30, ?", answer: "42" },
      { question: "If 1=5, 2=25, 3=125, then 4=?", answer: "625" },
      { question: "Missing number: 16, 06, 68, 88, ?, 98", answer: "87" },
    ],
  }

  const selectedPuzzles = puzzles[difficulty]
  const puzzle = selectedPuzzles[Math.floor(Math.random() * selectedPuzzles.length)]

  return {
    question: puzzle.question,
    answer: puzzle.answer,
    type: "puzzle",
  }
}

function generateLogicCode(difficulty: "easy" | "medium" | "hard"): SecurityCode {
  const logicPuzzles = {
    easy: [
      { question: "True or False: A square has 4 equal sides", answer: "true" },
      { question: "What is the opposite of 'up'?", answer: "down" },
      { question: "How many letters are in 'HELLO'?", answer: "5" },
    ],
    medium: [
      { question: "If all roses are flowers and some flowers are red, are all roses red?", answer: "no" },
      { question: "What day comes 3 days after Monday?", answer: "thursday" },
      { question: "If it's 2 PM, what time was it 5 hours ago?", answer: "9am" },
    ],
    hard: [
      { question: "If A→B and B→C, then A→C. If A→B is false and A→C is true, what is B→C?", answer: "true" },
      {
        question:
          "You have 3 switches and 3 bulbs in another room. How many times must you go to the room to match each switch to its bulb?",
        answer: "1",
      },
      { question: "If today is Wednesday, what day will it be in 100 days?", answer: "friday" },
    ],
  }

  const selectedPuzzles = logicPuzzles[difficulty]
  const puzzle = selectedPuzzles[Math.floor(Math.random() * selectedPuzzles.length)]

  return {
    question: puzzle.question,
    answer: puzzle.answer.toLowerCase(),
    type: "logic",
  }
}

export function validateAnswer(userAnswer: string, correctAnswer: string): boolean {
  return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
}
