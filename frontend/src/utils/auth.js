import {userAuthStore} from "../store/auth";
import axios from './axios';
import jwt_decode from "jwt-decode";
import Cookie from "js-cookie";
import Swal from "sweetalert2";

const getErrorMessages = (error) => {
    if (!error.response?.data) return ["Something is wrong."];
    const messages = [];
    if (error.response.data.email) messages.push(error.response.data.email);
    if (error.response.data.password) messages.push(error.response.data.password);
    if (error.response.data.repeat_password) messages.push(error.response.data.repeat_password);
    // console.log("In getErrorMessages", messages)

    return messages.length ? messages : ["Something is wrong."];
};

export const login = async (email, password) => {
    try {
        // consume django rest endpoint
        const {data, status} = await axios.post("user/token/",
            {
                email, password,
            }
        );
        if (status==200){
            console.log("Good login")
            setAuthUser(data.access, data.refresh);
        }
        return {data, error: null}

    } catch (error) {
        console.log(error)
        return {data:null, error: getErrorMessages(error)}
    }
};


export const register = async (full_name, email, password, repeat_password) => {
    try {
        const {data} = await axios.post("user/register/", {
            full_name,
            email,
            password,
            repeat_password,
        });
        // log user in
        await login(email, password);
        return {data, error: null};
    } catch (error) {
        console.error("Registration Error:", error.response?.data || error.message);  // Log error details
        return {data:null,
            error: getErrorMessages(error)}
    }
};

export const logout = () => {
    Cookie.remove("access_token");
    Cookie.remove("refresh_token");
    userAuthStore.getState().setUser(null)
}

export const setUser = async () => {
    const access_token = Cookie.get('access_token');
    const refresh_token = Cookie.get('refresh_token');

    if (!access_token || !refresh_token){
        return; // exit
    }
    if (isAccessTokenExpired(access_token)){
        const response = getRefreshedToken(refresh_token);
        setAuthUser(response.access, response.refresh);
    }
    else{ // cookie has not expired
        setAuthUser(access_token, refresh_token)
    }
}

export const setAuthUser = (access_token, refresh_token) => {
    Cookie.set('access_token', access_token,{
        expires: 1, // access token expires after 1 day
        secure: true
    });
    Cookie.set('refresh_token', refresh_token,{
        expires: 14, // access token expires after 14 days
        secure: true
    });

    // jwt_decode decodes a JWT token
    // ?? null (Nullish Coalescing Operator) ensures that user is assigned null if jwt_decode returns undefined or null
    const user = jwt_decode(access_token) ?? null

    if(user){
        userAuthStore.getState().setUser(user);
    } else {
        setAuthUser.getState().setLoading(false);
    };
};

export const getRefreshedToken = async() => {
    const refresh_token = Cookie.get("refresh_token");
    const response = await axios.post("user/token/refresh/", {
        refresh: refresh_token,
    })
    return response.data;
}

export const isAccessTokenExpired = (access_token) => {
    try {
        const decodeToken = jwt_decode(access_token)
        return decodeToken.exp < Date.now() / 1000 // if has expired
    } catch (error) {
        console.log(error);
        return true;
    }
}