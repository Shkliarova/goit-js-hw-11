import Notiflix from 'notiflix';
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39799799-b8751a2dca689677868dbdc1d';

const selectors = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('[name = "searchQuery"]'),
  gallery: document.querySelector('.gallery'),
  button: document.querySelector('.load-more')
}

selectors.button.style.display = 'none';
let page = 1;

selectors.form.addEventListener('submit', onSubmit);
selectors.button.addEventListener('click', onButtonClick);

async function fetchData(params) {
  try {
      const response = await axios.get(BASE_URL, { params });
      return response.data;
  } catch (error) {
    Notiflix.Notify.failure('An error occurred while fetching data. Please try again later.');
  }
}

function updateGallery(data){
  if (data.hits.length === 0) {
    selectors.gallery.innerHTML = '';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    selectors.gallery.innerHTML = createMarkup(data.hits);

    if (data.totalHits > page * 40) {
        selectors.button.style.display = 'block';
    } else {
        selectors.button.style.display = 'none';
    }

    new SimpleLightbox('.gallery a', {
       close: true
    });
  }
}

async function onSubmit(event){
  event.preventDefault();
  page = 1;

  const searchQuery = selectors.input.value.trim();

    if (!searchQuery) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
        return;
    }

  const params = {
      key: API_KEY,
      q: selectors.input.value,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
  };

  try {
    const data = await fetchData(params);
    updateGallery(data);
  
    if (data.totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }
  
    if (data.totalHits > page * 40) {
      selectors.button.style.display = 'block';
    } else {
      selectors.button.style.display = 'none';
    }
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
}

function createMarkup(arr){
    return arr.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => 
    `<div class="photo-card">
    <a class = "gallery-link" href = "${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" width = "300" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes<br> ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views<br> ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments<br> ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads<br> ${downloads}</b>
      </p>
    </div>
  </div>`
    ).join('');
}

async function onButtonClick(){
    page += 1;

    const params = {
        key: API_KEY,
        q: selectors.input.value,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page
    };

    try {
      const data = await fetchData(params);

      if (data.hits.length === 0) {
          selectors.button.style.display = 'none';
      } else {
          const newPhotosMarkup = createMarkup(data.hits);
          selectors.gallery.insertAdjacentHTML('beforeend', newPhotosMarkup);

          if (data.totalHits > page * 40) {
            selectors.button.style.display = 'block';
          } else {
            selectors.button.style.display = 'none';
            Notiflix.Notify.info(
              "We're sorry, but you've reached the end of search results."
            );
          }

          new SimpleLightbox('.gallery a', {
              close: true
          });
      }
  } catch (error) {
      Notiflix.Notify.failure(error.message);
  }
}