import axios from 'axios'
import {API_BASE_URL} from "./helper"

// Extend axios
const apiInstance = axios.create({
    baseURL: API_BASE_URL,
    // if no value returned after 20s, terminate the call
    timeout: 20000,
    headers: {
        'Content-Type': "application/json",
        Accept: "application/json"
    }
})

export default apiInstance