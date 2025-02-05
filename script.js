let equation = "";
let history = [];
let result = "";

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("keydown", handleKeyPress);
  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      let value = event.target.getAttribute("data-value");
      if (value) handleButtonPress(value);
    });
  });
});

function handleButtonPress(value) {
  if (value === "C") clear();
  else if (value === "CE") clearEntry();
  else if (value === "=") calculate();
  else append(value);
}

function append(value) {
  if (/[0-9+\-*/%]/.test(value)) {
    equation += value;
  }
  updateDisplay();
}

function clear() {
  equation = "";
  updateDisplay();
}

function clearEntry() {
  equation = equation.slice(0, -1);
  updateDisplay();
}

function calculate() {
  try {
    result = simpleEvaluate(equation);
    history.push(`${equation} = ${result}`);
    equation = result.toString();
  } catch {
    result = "Error";
  }
  updateDisplay();
  updateHistory();
}

function simpleEvaluate(expression) {
  let match = expression.match(/(-?\d+)([+\-*/%])(-?\d+)/);
  if (!match) return "Error";

  let a = parseFloat(match[1]);
  let operator = match[2];
  let b = parseFloat(match[3]);

  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b !== 0 ? a / b : "Error";
    case "%":
      return b !== 0 ? a % b : "Error";
    default:
      return "Error";
  }
}

function handleKeyPress(event) {
  let key = event.key;
  if (/\d|[+\-*/%]/.test(key)) {
    append(key);
  } else if (key === "Enter") {
    calculate();
  } else if (key === "Backspace") {
    clearEntry();
  } else if (key === "Escape") {
    clear();
  }
}

function updateDisplay() {
  document.getElementById("display").value = equation;
}

function updateHistory() {
  let historyElement = document.getElementById("history");
  historyElement.value = history.join("\n");
}
