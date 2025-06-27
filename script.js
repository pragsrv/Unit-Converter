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
const customName = document.getElementById("customName");
const customValue = document.getElementById("customValue");
const addCustomBtn = document.getElementById("addCustomBtn");
const customList = document.getElementById("customUnitList");
const customLabel = document.getElementById("customCategoryLabel");

function getBaseUnits(category) {
  return {
    length: {
      meter: 1,
      kilometer: 0.001,
      mile: 0.000621371,
      foot: 3.28084,
      inch: 39.3701
    },
    mass: {
      gram: 1,
      kilogram: 0.001,
      pound: 0.00220462,
      ounce: 0.035274
    }
  }[category] || {};
}

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
  renderCustomUnits();
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

function renderCustomUnits() {
  const units = categories[activeCategory].units;
  const baseUnits = getBaseUnits(activeCategory);
  customList.innerHTML = "";

  for (const unit in units) {
    if (!(unit in baseUnits)) {
      const li = document.createElement("li");
      li.innerHTML = `${unit} <button onclick="deleteCustomUnit('${unit}')">🗑</button>`;
      customList.appendChild(li);
    }
  }

  customLabel.textContent = capitalize(activeCategory);
}

function deleteCustomUnit(unit) {
  delete categories[activeCategory].units[unit];
  populateUnits();
  renderCustomUnits();
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

addCustomBtn.addEventListener("click", () => {
  const name = customName.value.trim().toLowerCase();
  const val = parseFloat(customValue.value);

  if (!name || isNaN(val) || val <= 0) {
    alert("Please enter a valid unit name and positive value.");
    return;
  }

  if (activeCategory === "temperature") {
    alert("Custom units not allowed for temperature.");
    return;
  }

  categories[activeCategory].units[name] = val;
  populateUnits();
  renderCustomUnits();

  customName.value = "";
  customValue.value = "";
  alert(`Custom unit "${name}" added to ${capitalize(activeCategory)}.`);
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
    renderCustomUnits();
  });
});

document.getElementById("toggleTheme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.getElementById("toggleTheme").textContent =
    document.body.classList.contains("dark") ? "🌞" : "🌙";
});

// Initial setup
populateUnits();
