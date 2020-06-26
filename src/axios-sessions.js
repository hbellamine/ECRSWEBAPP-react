import axios from 'axios';

const instance = axios.create( {
    baseURL: 'https://ecrs-bbfdf.firebaseio.com/'

})

export default instance;
