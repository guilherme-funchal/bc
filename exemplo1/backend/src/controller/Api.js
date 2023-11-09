import axios from "axios";


console.log(process.env.REST_HOST);

const api = axios.create({
baseURL:process.env.REST_HOST+ '/'

})

export default api;