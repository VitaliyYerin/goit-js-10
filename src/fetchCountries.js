import { Notify } from "notiflix/build/notiflix-notify-aio";

export default function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,languages,flags`)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      if (response.status === 404) {
        Notify.failure("Oops, there is no country with that name");
      }
      if (response.status >= 500) {
        Notify.failure("Oops, there is no country with that name");
      }
      return Promise.reject(response.text() || response.status);
    });
}