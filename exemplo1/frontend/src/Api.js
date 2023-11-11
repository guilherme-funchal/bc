import axios from "axios";


const api = axios.create({
baseURL:process.env.REACT_APP_REST_HOST+ '/'

})

export default api;