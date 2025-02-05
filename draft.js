// Version with sequential evaluation, but negative values doesn't work

let equation = "";
let history = [];
let result = "";

const input = document.querySelector("#display");
const buttons = document.querySelectorAll(".btn");
const historyElement = document.querySelector("#records");

document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("keydown", handleKeyPress);
    buttons.forEach(button => {
        button.addEventListener("click", (event) => {
          let value = event.target.getAttribute("data-value");
          if (value) handleButtonPress(value)

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
    if (/[0-9\+\-\*/%()]/.test(value)) {
        equation += value;
  }
  else {
    input.classList.add("error");
    errorMessage.style.display = "block";
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
        result = safeEvaluate(equation);
        history.push(`${equation} = ${result}`);
        equation = result.toString();
    } catch {
        result = "Error";
    }
    updateDisplay();
    updateHistory();
}

function safeEvaluate(expression) {
    let tokens = expression.match(/\d+|[+\-*/%()]/g);
    if (!tokens) return "Error";
    
    let outputQueue = [];
    let operators = [];
    let precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2 };
    
    tokens.forEach(token => {
        if (/\d+/.test(token)) {
            outputQueue.push(parseFloat(token));
        } else if (token in precedence) {
            while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) {
                outputQueue.push(operators.pop());
            }
            operators.push(token);
        } else if (token === '(') {
            operators.push(token);
        } else if (token === ')') {
            while (operators.length && operators[operators.length - 1] !== '(') {
                outputQueue.push(operators.pop());
            }
            operators.pop();
        }
    });
    while (operators.length) {
        outputQueue.push(operators.pop());
    }
    return evaluatePostfix(outputQueue);
}

function evaluatePostfix(queue) {
    let stack = [];
    queue.forEach(token => {
        if (typeof token === 'number') {
            stack.push(token);
        } else {
            let b = stack.pop();
            let a = stack.pop();
            switch (token) {
                case '+': stack.push(a + b); break;
                case '-': stack.push(a - b); break;
                case '*': stack.push(a * b); break;
                case '/': stack.push(a / b); break;
                case '%': stack.push(a % b); break;
            }
        }
    });
    return stack[0];
}

function handleKeyPress(event) {
    let key = event.key;
    if (/\d|[+\-*/%()]/.test(key)) {
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
    input.value = equation;
}

function updateHistory() {
    historyElement.value = history.join("\n");
}