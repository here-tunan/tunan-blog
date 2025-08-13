import axios from "axios";
import { API_URL } from "@/lib/config";

console.log("apiUrl: " + API_URL)

// create an axios instance
const service = axios.create({
    baseURL: API_URL,
    timeout: 50000, // request timeout
    // headers: {
    //     'Content-Type': 'application/json', // header config
    // },
})

export default service