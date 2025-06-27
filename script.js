const inputValue = document.getElementById("inputValue");
const inputUnit = document.getElementById("inputUnit");
const outputValue = document.getElementById("outputValue");
const outputUnit = document.getElementById("outputUnit");
const swapBtn = document.getElementById("swapBtn");

// Length conversion rates relative to meters
const lengthRates = {
  meter: 1,
  kilometer: 0.001,
  mile: 0.000621371,
  foot: 3.28084,
  inch: 39.3701
};

function convertLength() {
  const value = parseFloat(inputValue.value);
  if (isNaN(value)) {
    outputValue.value = "";
    return;
  }

  const fromRate = lengthRates[inputUnit.value];
  const toRate = lengthRates[outputUnit.value];

  const result = (value / fromRate) * toRate;
  outputValue.value = result.toFixed(4);
}

inputValue.addEventListener("input", convertLength);
inputUnit.addEventListener("change", convertLength);
outputUnit.addEventListener("change", convertLength);

swapBtn.addEventListener("click", () => {
  const tempUnit = inputUnit.value;
  inputUnit.value = outputUnit.value;
  outputUnit.value = tempUnit;
  convertLength();
});

// Initial conversion
convertLength();
    const inputValue = document.getElementById("inputValue");
const inputUnit = document.getElementById("inputUnit");
const outputValue = document.getElementById("outputValue");
const outputUnit = document.getElementById("outputUnit");
const swapBtn = document.getElementById("swapBtn");

// Length conversion rates relative to meters
const lengthRates = {
  meter: 1,
  kilometer: 0.001,
  mile: 0.0006