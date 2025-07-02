// Simple security code generator for student project
export interface SecurityCode {
  question: string
  answer: string
  type: "math" | "puzzle"
}

export function generateCode(type: "math" | "puzzle", difficulty: "easy" | "medium" | "hard"): SecurityCode {
  if (type === "math") {
    return generateMathProblem(difficulty)
  } else {
    return generatePuzzle(difficulty)
  }
}

function generateMathProblem(difficulty: "easy" | "medium" | "hard"): SecurityCode {
  let num1: number, num2: number, operator: string, answer: number

  switch (difficulty) {
    case "easy":
      // Simple addition/subtraction with numbers 1-10
      num1 = Math.floor(Math.random() * 10) + 1
      num2 = Math.floor(Math.random() * 10) + 1
      operator = "+"
      answer = num1 + num2
      break

    case "medium":
      // Addition/subtraction with larger numbers
      num1 = Math.floor(Math.random() * 50) + 10
      num2 = Math.floor(Math.random() * 30) + 5
      operator = Math.random() > 0.5 ? "+" : "-"
      if (operator === "+") {
        answer = num1 + num2
      } else {
        // Ensure positive result
        if (num1 < num2) [num1, num2] = [num2, num1]
        answer = num1 - num2
      }
      break

    case "hard":
      // Multiplication with smaller numbers
      num1 = Math.floor(Math.random() * 12) + 2
      num2 = Math.floor(Math.random() * 12) + 2
      operator = "×"
      answer = num1 * num2
      break
  }

  return {
    question: `${num1} ${operator} ${num2} = ?`,
    answer: answer.toString(),
    type: "math",
  }
}

function generatePuzzle(difficulty: "easy" | "medium" | "hard"): SecurityCode {
  const puzzles = {
    easy: [
      { question: "What comes next: 2, 4, 6, 8, ?", answer: "10" },
      { question: "How many days in a week?", answer: "7" },
      { question: "What is 5 + 5?", answer: "10" },
    ],
    medium: [
      { question: "What comes next: 1, 1, 2, 3, 5, ?", answer: "8" },
      { question: "How many minutes in an hour?", answer: "60" },
      { question: "What is half of 50?", answer: "25" },
    ],
    hard: [
      { question: "Complete: 2, 6, 12, 20, ?", answer: "30" },
      { question: "If today is Monday, what day is it in 10 days?", answer: "thursday" },
      { question: "What is 15% of 100?", answer: "15" },
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

// Check if the user's answer is correct
export function checkAnswer(userAnswer: string, correctAnswer: string): boolean {
  return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
}
