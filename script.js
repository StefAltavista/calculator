const display = document.querySelector("#display");
const buttons = document.querySelectorAll(".btn");

let currentInput = "";
let previousInput = "";
let operator;

function updateDisplay() {
  display.value = currentInput || previousInput || "0";
}

buttons.forEach((button) => {
  button.addEventListener("click", function () {
    const buttonValue = button.getAttribute("data-value");
    console.log(typeof buttonValue);

    if (buttonValue >= "0" && buttonValue <= "9") {
      currentInput += buttonValue;
      updateDisplay();
    } else if (["+", "-", "*", "/"].includes(buttonValue)) {
      previousInput = currentInput;
      currentInput = "";
      operator = buttonValue;
    } else if (buttonValue === "=") {
      if (operator && previousInput && currentInput) {
        previousInput = Number(previousInput, 10);
        currentInput = Number(currentInput, 10);
        currentInput = operate(previousInput, currentInput, operator);
        previousInput = "";
        operator = "";
        updateDisplay();
      }
    } else if (buttonValue === "C") {
      currentInput = "";
      previousInput = "";
      operator = "";
      updateDisplay();
    }
  });
});

function operate(num1, num2, operator) {
  switch (operator) {
    case "+":
      return num1 + num2;

    case "-":
      return num1 - num2;

    case "*":
      return num1 * num2;

    case "/":
      return num1 / num2;

    default:
  }
}
