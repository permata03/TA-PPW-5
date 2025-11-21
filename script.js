const display = document.getElementById("display");
const historyBox = document.getElementById("history");

let current = "";
let memory = 0;
let history = [];

function updateDisplay(value) {
  display.textContent = value;
}

document.querySelectorAll(".num").forEach(btn => {
  btn.addEventListener("click", () => {
    if (current === "0" && btn.textContent !== ".") current = "";
    current += btn.textContent;
    updateDisplay(current);
  });
});

document.querySelectorAll(".operator").forEach(btn => {
  btn.addEventListener("click", () => {
    let action = btn.dataset.action;
    let op = btn.dataset.op;

    if (action === "C") {
      current = "";
      updateDisplay("0");
    }

    else if (action === "CE") {
      current = current.slice(0, -1);
      updateDisplay(current || "0");
    }

    else if (op) {
      current += ` ${op} `;
      updateDisplay(current);
    }
  });
});

document.querySelector(".equals").addEventListener("click", () => {
  try {
    let expr = current.replace(/×/g, "*").replace(/÷/g, "/");

    let result = Function("return " + expr)();

    if (result === Infinity || isNaN(result)) throw "Error";

    updateDisplay(result);

    history.unshift(`${current} = ${result}`);
    if (history.length > 5) history.pop();

    historyBox.innerHTML = history.map(h => `<li>${h}</li>`).join("");

    current = String(result);
  } catch {
    updateDisplay("Error");
    current = "";
  }
});

document.querySelectorAll(".mem").forEach(btn => {
  btn.addEventListener("click", () => {
    let action = btn.dataset.action;
    let value = Number(display.textContent);

    if (action === "MC") memory = 0;
    if (action === "MR") updateDisplay(memory);
    if (action === "M+") memory += value;
    if (action === "M-") memory -= value;
  });
});

document.addEventListener("keydown", e => {
  const allowedKeys = "0123456789+-*/.=EnterBackspace";

  if (!allowedKeys.includes(e.key)) return;

  if (!isNaN(e.key)) {
    current += e.key;
    updateDisplay(current);
  }

  if (["+", "-", "*", "/"].includes(e.key)) {
    let op = e.key === "*" ? "×" : e.key === "/" ? "÷" : e.key;
    current += ` ${op} `;
    updateDisplay(current);
  }

  if (e.key === ".") {
    current += ".";
    updateDisplay(current);
  }

  if (e.key === "Enter" || e.key === "=") {
    document.querySelector(".equals").click();
  }

  if (e.key === "Backspace") {
    current = current.slice(0, -1);
    updateDisplay(current || "0");
  }
});
