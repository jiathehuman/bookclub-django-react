import axios from 'axios';
import Cookies from "js-cookie";
import {getRefreshedToken, isAccessTokenExpired, setAuthUser} from './auth';
import {API_BASE_URL} from "./helper";

// Pass access token to header when making requests to private routes
const useAxios = () => {
    const access_token = Cookie.get("access_token");
    const refresh_token = Cookie.get("refresh_token");

    // instance with base URL and access token that will be passed to headers
    const axiosInstance = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            Authorization: `Bearer ${access_token}`,
        }
    })
    axiosInstance.interceptors.request.use(async (request) => {
        if(!isAccessTokenExpired){
            // if not expired, return request that we are trying to make a call to
            return request;
        }
        // get a new refresh token
        const response = await getRefreshedToken(refresh_token);
        setAuthUser(response.access, response.refresh);
        request.headers.Authorization = `Bearer ${response.data?.access}`;
        return request
    });

    return axiosInstance
};

export default useAxios;