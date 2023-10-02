import Notiflix from 'notiflix';
import axios from "axios";

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39799799-b8751a2dca689677868dbdc1d';

const form = document.querySelector('.search-form');
const input = form.querySelector('[name = "searchQuery"]')

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
        return data;
    } catch(error) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
}
