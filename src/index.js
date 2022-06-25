import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import  fetchCountries from "./fetchCountries"

const DEBOUNCE_DELAY = 300;
const input = document.querySelector("#search-box")
const countryList = document.querySelector(".country-list")
const countryInfo = document.querySelector(".country-info")
console.log(input);
console.log(countryList);
console.log(countryInfo);




input.addEventListener("input", debounce(findCountry, DEBOUNCE_DELAY))


function findCountry(e) {

  const findToCountry = e.target.value.trim()
  const findToCountryData = e.data


  // console.log(findToCountry);
  if (findToCountry !== "" && findToCountryData !== " ") {

    fetchCountries(findToCountry)
      .then(response => {

          if (Number(response.status) === 404) {
            Notify.failure("Oops, there is no country with that name");
          }
          if (response.length > 10) {
            Notify.info("Too many matches found. Please enter a more specific name.")
          }
          if (findToCountry === "") {
            clearMarcupList()
            clearMarcupInfo()
          }
          clearMarcupList()
          clearMarcupInfo()

          if (response.length === 1) {
            renderCountry(response)
            // console.log(response.length);
            clearMarcupList()

          }
          else if (response.length > 1 && response.length <= 10) {
            renderCountryList(response)

          }

        }
      )

      .catch(error => {
        console.log(error);
      })
  }
}
function renderCountry(items) {
  const marcup = items.map(({ name, capital, population, languages, flags }) =>
    `
       <div class = "wrapp">
       <img src="${flags.svg}" alt = "flag" width = 60px height = 30px>
       <h1 class = "title"> ${name.official}<h1>
       </div>
       <p>Capital: ${capital}</p>
       <p>Population: ${population}</p>
       <p>Languages: ${Object.values(languages)}</p>
      `).join("")
  countryInfo.insertAdjacentHTML("afterbegin", marcup)
}

function renderCountryList(items) {
  const marcupList = items.map(({ name, flags }) =>
    `<li>
       <div class = "wrapp">
       <img src="${flags.svg}" alt = "flag" width = 30px height = 15px>
       <h1 class = "title"> ${name.official}<h1>
       </div>
       </li>
      `).join("")
  countryList.insertAdjacentHTML("afterbegin", marcupList)
}
function clearMarcupInfo() {
  countryInfo.innerHTML = ""
}

function clearMarcupList() {
  countryList.innerHTML = ""
}