import Notiflix from 'notiflix';
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39799799-b8751a2dca689677868dbdc1d';

const form = document.querySelector('.search-form');
const input = form.querySelector('[name = "searchQuery"]');
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', onSubmit);

 async function onSubmit(event){
    event.preventDefault();

    const params = new URLSearchParams({
        key: API_KEY,
        q: input.value,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true
    });

    try {
        const response = await fetch(`${BASE_URL}?${params}`);

        if(!response.ok){
            throw new Error(response.statusText);
        }

        const data = await response.json();

        if (data.hits.length === 0) {
            gallery.innerHTML = '';
            Notiflix.Notify.failure(
              'Sorry, there are no images matching your search query. Please try again.'
            );
          } else {
            gallery.innerHTML = createMarkup(data.hits);

            new SimpleLightbox('.gallery a', {
               close: true
            });
          }

    } catch(error) {
        Notiflix.Notify.failure('An error occurred while fetching data. Please try again later.');
    }
}

function createMarkup(arr){
    return arr.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => 
    `<div class="photo-card">
    <a class = "gallery-link" href = "${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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

