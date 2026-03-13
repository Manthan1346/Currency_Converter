const BASE_URL =
  "https://v6.exchangerate-api.com/v6/bcc74a830aca016d795bc002/latest";

let btn = document.querySelector("form button");
let dropdowns = document.querySelectorAll(".dropdown select");
let msg = document.querySelector(".msg");
let fromCurr = document.querySelector(".from select");
let toCurr = document.querySelector(".To select");
let swapBtn = document.querySelector(".fa-arrow-right-arrow-left");


// Populate dropdowns
for (let select of dropdowns) {

  for (let currCode in countryList) {

    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "INR") {
      newOption.selected = "selected";
    } 
    else if (select.name === "to" && currCode === "USD") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  // Update flag + convert on currency change
  select.addEventListener("change", (evt) => {
    UpdateFlag(evt.target);
    convertCurrency();
  });

}

// Update flag function
const UpdateFlag = (element) => {

  let currCode = element.value;
  let countryCode = countryList[currCode];

  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

  let img = element.parentElement.querySelector("img");
  img.src = newSrc;

};

// Conversion function
async function convertCurrency() {

  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  msg.innerText = "Fetching exchange rate...";

  const URL = `${BASE_URL}/${fromCurr.value}`;
  
  try {

    let response = await fetch(URL);
    let data = await response.json();
    let rate = data.conversion_rates[toCurr.value];
    let finalAmt = amtVal * rate;
    finalAmt = finalAmt.toFixed(2);

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmt} ${toCurr.value}`;
  }
  
  catch (error) {
    msg.innerText = "Error fetching exchange rate";
  }
}


// Button click conversion
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  convertCurrency();
});


// Swap currencies
swapBtn.addEventListener("click", () => {

  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  UpdateFlag(fromCurr);
  UpdateFlag(toCurr);
  convertCurrency();
});

//Auto page load
window.addEventListener("load", () => {
  convertCurrency();
})