const categories = {
  length: {
    units: {
      meter: 1,
      kilometer: 0.001,
      mile: 0.000621371,
      foot: 3.28084,
      inch: 39.3701
    }
  },
  mass: {
    units: {
      gram: 1,
      kilogram: 0.001,
      pound: 0.00220462,
      ounce: 0.035274
    }
  },
  temperature: {
    units: {
      celsius: "C",
      fahrenheit: "F",
      kelvin: "K"
    }
  }
};

let activeCategory = "length";
let history = [];

const inputValue = document.getElementById("inputValue");
const inputUnit = document.getElementById("inputUnit");
const outputValue = document.getElementById("outputValue");
const outputUnit = document.getElementById("outputUnit");
const swapBtn = document.getElementById("swapBtn");
const tabs = document.querySelectorAll(".tab");
const copyBtn = document.getElementById("copyBtn");
const historyList = document.getElementById("historyList");

function populateUnits() {
  inputUnit.innerHTML = "";
  outputUnit.innerHTML = "";

  const units = categories[activeCategory].units;
  for (const unit in units) {
    const opt1 = document.createElement("option");
    opt1.value = unit;
    opt1.textContent = capitalize(unit);
    const opt2 = opt1.cloneNode(true);
    inputUnit.appendChild(opt1);
    outputUnit.appendChild(opt2);
  }

  convert();
  inputValue.focus();
}

function convert() {
  const val = parseFloat(inputValue.value);
  if (isNaN(val)) {
    outputValue.value = "";
    return;
  }

  const from = inputUnit.value;
  const to = outputUnit.value;

  let result;
  if (activeCategory === "temperature") {
    result = convertTemperature(val, from, to);
  } else {
    const fromRate = categories[activeCategory].units[from];
    const toRate = categories[activeCategory].units[to];
    result = (val / fromRate) * toRate;
    result = result.toFixed(4);
  }

  outputValue.value = result;
  updateHistory(`${val} ${from} = ${result} ${to}`);
}

function convertTemperature(val, from, to) {
  let c;
  if (from === "celsius") c = val;
  else if (from === "fahrenheit") c = (val - 32) * (5 / 9);
  else if (from === "kelvin") c = val - 273.15;

  let out;
  if (to === "celsius") out = c;
  else if (to === "fahrenheit") out = c * 9 / 5 + 32;
  else if (to === "kelvin") out = c + 273.15;

  return out.toFixed(2);
}

function updateHistory(entry) {
  history.unshift(entry);
  if (history.length > 5) history.pop();

  historyList.innerHTML = history.map(item => `<li>${item}</li>`).join("");
}

function capitalize(w) {
  return w.charAt(0).toUpperCase() + w.slice(1);
}

swapBtn.addEventListener("click", () => {
  const temp = inputUnit.value;
  inputUnit.value = outputUnit.value;
  outputUnit.value = temp;
  convert();
});

copyBtn.addEventListener("click", () => {
  if (outputValue.value !== "") {
    navigator.clipboard.writeText(outputValue.value);
    copyBtn.textContent = "✅";
    setTimeout(() => (copyBtn.textContent = "📋"), 1000);
  }
});

inputValue.addEventListener("input", convert);
inputUnit.addEventListener("change", convert);
outputUnit.addEventListener("change", convert);

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    activeCategory = tab.dataset.category;
    populateUnits();
  });
});

document.getElementById("toggleTheme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const icon = document.getElementById("toggleTheme");
  icon.textContent = document.body.classList.contains("dark") ? "🌞" : "🌙";
});

// Initial load
populateUnits();
