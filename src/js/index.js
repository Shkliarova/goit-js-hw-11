import Notiflix from 'notiflix';
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39799799-b8751a2dca689677868dbdc1d';

const form = document.querySelector('.search-form');
const input = form.querySelector('[name = "searchQuery"]');
const gallery = document.querySelector('.gallery');
const button = document.querySelector('.load-more');

button.style.display = 'none';
let page = 1;

form.addEventListener('submit', onSubmit);
button.addEventListener('click', onButtonClick);

 async function onSubmit(event){
    event.preventDefault();
    page = 1;

    const params = {
        key: API_KEY,
        q: input.value,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40
    };

    try {
        const response = await axios.get(BASE_URL, { params });

        if(response.status !== 200){
            throw new Error(response.statusText);
        }

        const data = response.data;

        if (data.hits.length === 0) {
            gallery.innerHTML = '';
            Notiflix.Notify.failure(
              'Sorry, there are no images matching your search query. Please try again.'
            );
          } else {
            gallery.innerHTML = createMarkup(data.hits);

            if (data.totalHits > page * 40) {
                button.style.display = 'block';
            } else {
                button.style.display = 'none';
            }

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

async function onButtonClick(){
    page++;

    const params = {
        key: API_KEY,
        q: input.value,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page
    };

    try {
        const response = await axios.get(BASE_URL, { params });

        if(response.status !== 200){
            throw new Error(response.statusText);
        }

        const data = response.data;

        if (data.hits.length === 0) {
            Notiflix.Notify.failure(
              "We're sorry, but you've reached the end of search results."
            );
            button.style.display = 'none';
          } else {
            gallery.innerHTML += createMarkup(data.hits);

            new SimpleLightbox('.gallery a', {
               close: true
            });
          }

    } catch(error) {
        Notiflix.Notify.failure('An error occurred while fetching data. Please try again later.');
    }
}