import axios from "axios";

// create an axios instance
const service = axios.create({
    baseURL: 'http://127.0.0.1:3002/api', // base url, see it in .env.[mode] file
    timeout: 50000, // request timeout
    headers: {
        'Content-Type': 'application/json', // header config
    },
})

export default service