import axios from 'axios';
import Cookies from "js-cookie";
import {getRefreshedToken, isAccessTokenExpired, setAuthUser} from './auth';
import {API_BASE_URL} from "./helper";
