export { selectors };
import axios from 'axios';
import { fetchBreeds, fetchCatByBreed } from './cat-api';

const AUTH_TOKEN =
  'live_LwXQqvhez6FBJLuZVyOHtVtVqx93hOoRN3G2q8h1Mu6QbQTE2PJybSYzZwXi2IgQ';

axios.defaults.baseURL = 'https://api.thecatapi.com/v1/';
axios.defaults.headers.common['x-api-key'] = AUTH_TOKEN;

const selectors = {
  select: document.querySelector('.breed-select'),
  info: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
};

selectors.select.hidden = true;
selectors.error.hidden = true;

fetchBreeds()
  .then(data => {
    selectors.select.hidden = false;
    data.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      selectors.select.appendChild(option);
    });
  })
  .catch(error => {
    selectors.error.hidden = false;
    console.log(error);
  })
  .finally(() => {
    selectors.loader.hidden = true;
  });

selectors.select.addEventListener('change', onChangeClick);

async function onChangeClick() {
  const selected = selectors.select.value;
  selectors.error.hidden = true;
  selectors.loader.hidden = false;
  selectors.info.hidden = true;

  try {
    const data = await fetchCatByBreed(selected);
    const [catData] = data;

    selectors.info.innerHTML = `
      <img src="${catData.url}" alt="${catData.breeds[0].name}" width="400">
      <h1>${catData.breeds[0].name}</h1>
      <p>${catData.breeds[0].temperament}</p>
      <p>${catData.breeds[0].description}</p>
    `;
  } catch (err) {
    selectors.error.hidden = false;
    selectors.info.innerHTML = '';
    console.error(err);
  } finally {
    selectors.loader.hidden = true;
    selectors.info.hidden = false;
  }
}
