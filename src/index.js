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
    clearCountryList();
    clearCountryInfo();
    return;
  }

  fetchCountries(findToCountry)
    .then(response => {
        if (response.length > 10) {
          Notify.info("Too many matches found. Please enter a more specific name.")
        }
        clearCountryList()
        clearCountryInfo()

        if (response.length === 1) {
          renderCountry(response)
          clearCountryList()
        } else if (response.length > 1 && response.length <= 10) {
          renderCountryList(response)
        }
      }
    ).catch(() => {
      clearCountryInfo();
      clearCountryList();
  });
}

function renderCountry(items) {
  const countryInfoEl = items.map(({name: {common}, capital, population, languages, flags: {svg}}) =>
    `
       <div class = "country-heading">
       <img src="${svg}" alt = "flag" width = 30px height = 30px>
       <span class = "title"> ${common}</span>
       </div>
       <p><strong>Capital:</strong> ${capital}</p>
       <p><strong>Population:</strong> ${population}</p>
       <p><strong>Languages:</strong> ${Object.values(languages).join(', ')}</p>
      `)
  countryInfo.insertAdjacentHTML("afterbegin", countryInfoEl)
}

function renderCountryList(items) {
  const countryListEl = items.map(({name:{common}, flags:{svg}}) =>
    `<li>
       <div class = "country-heading">
       <img src="${svg}" alt = "flag" width = 30px height = 30px>
       <span class = "title"> ${common}</span>
       </div>
       </li>
      `).join("")
  countryList.insertAdjacentHTML("afterbegin", countryListEl)
}

function clearCountryInfo() {
  countryInfo.innerHTML = ""
}

function clearCountryList() {
  countryList.innerHTML = ""
}