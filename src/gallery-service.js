const axios = require('axios').default;
const BASE_URL = 'https://pixabay.com/api/';
const KEY = '35199241-1ce149cef2c4e9fde3ee4bd95';
export default class PhotoApiService{
  constructor(){
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchQuery() {
    try {
      const response = await axios.get(`${BASE_URL}`, {
        params: {
          key: KEY,
          q: this.searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          per_page: 40,
          page: this.page
        }
      })

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  
  incrementPage(){
    this.page += 1;
  }

  resetPage(){
    this.page = 1;
  }

  get query(){
    return this.searchQuery;
  }

  set query(newQuery){
    this.searchQuery = newQuery;
  }
}