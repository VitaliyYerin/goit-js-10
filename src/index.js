import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from "./fetchCountries"

const DEBOUNCE_DELAY = 300;
const input = document.querySelector("#search-box")
const countryList = document.querySelector(".country-list")
const countryInfo = document.querySelector(".country-info")

input.addEventListener("input", debounce(findCountry, DEBOUNCE_DELAY))

function findCountry(e) {
  const findToCountry = e.target.value.trim();

  if (!findToCountry) {
    clearMarkupList();
    clearMarkupInfo();
    return;
  }

  fetchCountries(findToCountry)
    .then(response => {
        if (response.length > 10) {
          Notify.info("Too many matches found. Please enter a more specific name.")
        }
        clearMarkupList()
        clearMarkupInfo()

        if (response.length === 1) {
          renderCountry(response)
          clearMarkupList()
        } else if (response.length > 1 && response.length <= 10) {
          renderCountryList(response)
        }
      }
    ).catch(() => {
      clearMarkupInfo();
      clearMarkupList();
  });
}

function renderCountry(items) {
  const markup = items.map(({name, capital, population, languages, flags}) =>
    `
       <div class = "wrapp">
       <img src="${flags.svg}" alt = "flag" width = 30px height = 30px>
       <h1 class = "title"> ${name.common}<h1>
       </div>
       <p><strong>Capital:</strong> ${capital}</p>
       <p><strong>Population:</strong> ${population}</p>
       <p><strong>Languages:</strong> ${Object.values(languages).join(', ')}</p>
      `)
  countryInfo.insertAdjacentHTML("afterbegin", markup)
}

function renderCountryList(items) {
  const markupList = items.map(({name, flags}) =>
    `<li>
       <div class = "wrapp">
       <img src="${flags.svg}" alt = "flag" width = 30px height = 30px>
       <h1 class = "title"> ${name.common}<h1>
       </div>
       </li>
      `).join("")
  countryList.insertAdjacentHTML("afterbegin", markupList)
}

function clearMarkupInfo() {
  countryInfo.innerHTML = ""
}

function clearMarkupList() {
  countryList.innerHTML = ""
}