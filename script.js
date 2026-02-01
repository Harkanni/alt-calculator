const buttons = document.querySelectorAll(".calculator-buttons button");
const inputField = document.getElementById("calculatorInput");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.querySelector(".clear-history-btn");

let calculations = [];

// Click event handlers for buttons
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    handleButtonInput(button.textContent);
  });
});

// Keyboard event handling
document.addEventListener("keydown", (e) => {
  const key = e.key;

  // Prevent default behavior for keys we're handling
  if (
    ["Enter", "Backspace", "Escape"].includes(key) ||
    /^[0-9+\-*/.%^]$/.test(key)
  ) {
    e.preventDefault();
  }

  if (key === "Enter" || key === "=") {
    handleButtonInput("=");
  } else if (key === "Backspace" || key === "←") {
    handleButtonInput("←");
  } else if (key === "Escape" || key === "c" || key === "C") {
    handleButtonInput("C");
  } else if (key === "+") {
    handleButtonInput("+");
  } else if (key === "-" || key === "_") {
    handleButtonInput("−");
  } else if (key === "*") {
    handleButtonInput("×");
  } else if (key === "/") {
    handleButtonInput("÷");
  } else if (key === "%") {
    handleButtonInput("%");
  } else if (key === "^") {
    handleButtonInput("^");
  } else if (key === ".") {
    handleButtonInput(".");
  } else if (/^[0-9]$/.test(key)) {
    handleButtonInput(key);
  }
});

function handleButtonInput(buttonText) {
  if (buttonText === "C") {
    inputField.value = "";
  } else if (buttonText === "←") {
    inputField.value = inputField.value.slice(0, -1);
  } else if (buttonText === "=") {
    try {
      const expression = inputField.value
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/−/g, "-")
        .replace(/\^/g, "**");

      const result = eval(expression);

      // Store in history
      const displayExpression = inputField.value;
      calculations.push({
        expression: displayExpression,
        result: result,
      });

      updateHistory();
      inputField.value = result;
    } catch {
      inputField.value = "Error";
    }
  } else {
    inputField.value += buttonText;
  }

  autoResizeInput();
}

clearHistoryBtn.addEventListener("click", () => {
  calculations = [];
  updateHistory();
});

function updateHistory() {
  historyList.innerHTML = "";

  if (calculations.length === 0) {
    historyList.innerHTML =
      '<div class="history-empty">No calculations yet</div>';
    return;
  }

  calculations.forEach((calc, index) => {
    const historyItem = document.createElement("div");
    historyItem.className = "history-item";
    historyItem.innerHTML = `
            <div class="history-expression">${escapeHtml(calc.expression)}</div>
            <div class="history-result">= ${escapeHtml(calc.result.toString())}</div>
          `;

    historyItem.addEventListener("click", () => {
      inputField.value = calc.result;
      autoResizeInput();
    });

    historyList.appendChild(historyItem);
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function autoResizeInput() {
  const maxFont = 32;
  const minFont = 14;

  let size = maxFont;
  inputField.style.fontSize = size + "px";

  while (inputField.scrollWidth > inputField.clientWidth && size > minFont) {
    size--;
    inputField.style.fontSize = size + "px";
  }
}
