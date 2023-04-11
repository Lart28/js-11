import Notiflix from 'notiflix';
import PhotoApiService from './gallery-service';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const moreButton = document.querySelector('[data-action-more]');
const photoApiService = new PhotoApiService;
const lightbox = new SimpleLightbox('.gallery a', { /* options */ });
const debounce = require('lodash.debounce');




formEl.addEventListener('submit', onSearch);
// moreButton.addEventListener('click', onMoreButton);
window.addEventListener('scroll', onScroll);

function onSearch(event) {
  event.preventDefault();
  moreButton.classList.add('is-hidden');
  galleryEl.innerHTML = '';
  photoApiService.query = event.target.elements.searchQuery.value;
  photoApiService.resetPage();
  photoApiService.fetchQuery().then(result => {
    photoApiService.incrementPage();
    if (result.hits.length < 1) {
      Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.");
    } else {
      Notiflix.Notify.success(`Hooray! We found ${result.totalHits} images.`);
      createMarkup(result)
      lightbox.refresh();
      moreButton.classList.remove('is-hidden');
      // const { height: cardHeight } = document
      //   .querySelector(".gallery")
      //   .firstElementChild.getBoundingClientRect();
      // window.addEventListener('scroll', () => {
      //   window.scrollBy({
      //     top: cardHeight * 2,
      //     behavior: 'smooth',
      //   });
      // });
    }
  });
}

// function onMoreButton() {
//   photoApiService.fetchQuery().then(result => {
//     if (result.hits.length < 40 && result.hits.length > 0) {
//       moreButton.classList.add('is-hidden');
//       Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
//     }
//     photoApiService.incrementPage();
//     createMarkup(result);
//     lightbox.refresh();
//   });
// }

function createMarkup(data) {
  data.hits.forEach((item) => {
    galleryEl.insertAdjacentHTML('beforeend', `
      <a class="gallery__link" href=${item.largeImageURL}>
        <div>
          <img class="gallery__image" src=${item.webformatURL} alt=${item.tags} loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes:</b><br>${item.likes}
            </p>
            <p class="info-item">
              <b>Views:</b><br>${item.views}
            </p>
            <p class="info-item">
              <b>Comments:</b><br>${item.comments}
            </p>
            <p class="info-item">
              <b>Downloads:</b><br>${item.downloads }
            </p>
          </div>
        </div>
      </a>`);
  });
}

function onScroll() {
  const documentRect = document.documentElement.getBoundingClientRect();
  if (documentRect.bottom < document.documentElement.clientHeight + 280){
    photoApiService.fetchQuery().then(result => {
    if (result.hits.length < 40 && result.hits.length > 0) {
      moreButton.classList.add('is-hidden');
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
    photoApiService.incrementPage();
    createMarkup(result);
    lightbox.refresh();
  });
  }
}