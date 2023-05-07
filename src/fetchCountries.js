export default function fetchCountries(name) {
const BASE_URL = `https://restcountries.com/v3.1/name/${name}`;
const params = new URLSearchParams ({
    fields: `name,capital,population,flags,languages`
});
return fetch(`${BASE_URL}?${params}`);
};