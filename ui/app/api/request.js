import axios from "axios";

const apiUrl = process.env.NODE_ENV === 'production' ? "https://yourprod.com" : "http://127.0.0.1:3002/api";

console.log("apiUrl: " + apiUrl)

// create an axios instance
const service = axios.create({
    baseURL: apiUrl,
    timeout: 50000, // request timeout
    // headers: {
    //     'Content-Type': 'application/json', // header config
    // },
})

export default service