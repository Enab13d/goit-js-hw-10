import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './fetchCountries';
const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  countryCard: document.querySelector('.country-info'),
};
const resetListMarkup = () => (refs.list.innerHTML = '');
const resetCardMarkup = () => (refs.countryCard.innerHTML = '');
const infoMsg = 'Too many matches found. Please enter a more specific name.';
const failureMsg = 'Oops, there is no country with that name';
const onInput = e => {
  e.preventDefault();
  let name = e.target.value.trim();
  if (name === '') {
    resetCardMarkup();
    resetListMarkup();
    return;
  }
  fetchCountries(name)
    .then(r => {
      if (!r.ok) {
        throw new Error(r.status);
      }
      return r.json();
    })
    .then(data => {
      if (data.length >= 10) {
        resetCardMarkup();
        resetListMarkup();
        return Notify.info(infoMsg);
      }
      renderMarkup(data);
    })
    .catch(e => Notify.failure(failureMsg));
};

function renderMarkup(data) {
  let markup;
  if (data.length === 1) {
    resetListMarkup();
    markup = data
      .map(
        ({
          capital,
          population,
          languages,
          flags: { svg },
          name: { official },
        }) =>
          `<div class=card-container><img class=icon src=${svg}><h1>${official}</h1></div>
          <ul class=country-list><li><p><span class=accent>Capital: </span>${capital}</p></li><li><p><span class=accent>Population: </span>${population}</p></li><li><p><span class=accent>Languages: </span>${Object.values(
            languages
          )}</p></li></ul>`
      )
      .join('');

    refs.countryCard.innerHTML = markup;
  }
  if (data.length >= 2 && data.length < 10) {
    resetCardMarkup();
    markup = data
      .map(
        ({ flags: { svg }, name: { official } }) =>
          `<li class=list-item><img class=icon src=${svg}><h1 class=list-title>${official}</h1></li>`
      )
      .join('');
    refs.list.innerHTML = markup;
  }
}

const DEBOUNCE_DELAY = 300;
refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
