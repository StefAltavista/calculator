const input = document.querySelector("#display");
const buttons = document.querySelectorAll(".btn");
const historyElement = document.querySelector("#history");
const errorMessage = document.querySelector(".error");
const keys = document.querySelector('#keypad');

const calculator = {
  displayValue: '0',
  first: null,
  waitingForsecond: false,
  operator: null,
  equation: "",
  history: [],
  result: "",
  equel: false,
  isDot: false,
};

function inputDigit(digit) {
  const { displayValue, waitingForsecond } = calculator;

  if (waitingForsecond === true) {
      calculator.displayValue = digit;
      calculator.waitingForsecond = false;
  } else {
      calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
  }
}

function inputDecimal(dot) {
  if (calculator.waitingForsecond === true) return;

  if (!calculator.displayValue.includes(dot)) {
    calculator.displayValue += dot;
    calculator.isDot = true;
  }
}

function handleInput(nextOperator) {
  const { first, displayValue, operator } = calculator;
  const inputValue = parseFloat(displayValue);

  if (operator && calculator.waitingForsecond) {
      calculator.operator = nextOperator;
      return;
  }

  if (first == null && !isNaN(inputValue)) {
      calculator.first = inputValue;
  } else if (operator || calculator.equel) {
    const operation = performCalculation[operator](first, inputValue);
    if (operation === "Error") showError();

    let result = !Number.isInteger(operator) ? parseFloat(operation.toFixed(4)) : operation;
  
 
    calculator.equation = `${first} ${operator} ${inputValue} = ${result}`;
    calculator.history.push(`${first} ${operator} ${inputValue} = ${result}`);
    updateHistory();
    calculator.displayValue = result;
    calculator.first = result;
   
  }

  calculator.waitingForsecond = true;
  calculator.operator = nextOperator;
  calculator.equel = false;
  calculator.isDot = false;
}

const performCalculation = {
  '/': (first, second) => (first!=="Error" && second!=="Error" && second !== 0)?(first / second):"Error",
  '*': (first, second) => (first!=="Error" && second!=="Error")?(first * second):"Error",
  '+': (first, second) => (first!=="Error" && second!=="Error")?(first + second):"Error",
  '-': (first, second) => (first!=="Error" && second!=="Error")?(first - second):"Error",
};

function resetCalculator() {
  calculator.displayValue = '0';
  calculator.first = null;
  calculator.waitingForsecond = false;
  calculator.operator = null;
  calculator.equation = '';
  calculator.equel = false;
  calculator.result = "";
  calculator.isDot = false;
}

function updateDisplay() {
  input.value = calculator.displayValue;
}

function updateHistory() {
  historyElement.value = calculator.history.join("\n");
}

function clearEntry() {
  calculator.displayValue = calculator.displayValue.toString().slice(0, -1);
  updateDisplay();
  calculator.first = parseFloat(calculator.displayValue);
}

function showError() {
  errorMessage.classList.remove("hide");

  setTimeout(() => {
    errorMessage.classList.add("hide");
  }, 1000);
}

function handleKeyPress(event) {
  let key = event.key;

  if (/\d/.test(key)) {
    inputDigit(key);
    updateDisplay();
  } else if (/[+\-*/]/.test(key)) {
    handleInput(key);
    updateDisplay();
  } else if (key === "Enter" || key === "=") {
    calculator.equel = true;
    handleInput(calculator.operator);
    updateDisplay();
  } else if (key === "Backspace") { 
    clearEntry();
    updateDisplay();
  } else if (key === "Delete" || key === "Escape") {
    resetCalculator();
    updateDisplay();
  } else if (key === ".") {
    inputDecimal(".");
    updateDisplay();
  } else if (key === "Shift") {
    updateDisplay();
  }
  else showError()
}


updateDisplay();

keys.addEventListener('click', (event) => {
  const { target } = event;
  if (!target.matches('button')) {
      return;
  }

  if (target.classList.contains('operator')) {
      handleInput(target.value);
      updateDisplay();
      return;
  }
  
  if (target.classList.contains('equal-sign')) {
    calculator.equel = true;
    handleInput();
    updateDisplay();
    return;
  }


  if (target.classList.contains('decimal')) {
      inputDecimal(target.value);
      updateDisplay();
      return;
  }

  if (target.classList.contains('all-clear')) {
      resetCalculator();
      updateDisplay();
      return;
  }

  if (target.classList.contains('clear')) {
    clearEntry();
    updateDisplay();
    return;
}

  inputDigit(target.value);
  updateDisplay();
});


document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("keydown", handleKeyPress);
});