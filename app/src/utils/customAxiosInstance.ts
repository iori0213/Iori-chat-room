import axios from "axios";
import { getItemAsync, setItemAsync } from "expo-secure-store";
import { AuthAPI } from "../constants/backendAPI";
import { ACCESS_KEY, REFRESH_KEY } from "../constants/securestoreKey";

const customAxiosInstance = axios.create();

// Request interceptor for API calls
customAxiosInstance.interceptors.request.use(
  async (config) => {
    let accessToken;
    try {
      accessToken = await getItemAsync(ACCESS_KEY);
    } catch (e) {
      console.log("Interceptors request handler: " + e);
    }

    if (!!accessToken) {
      if (!!config.headers) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
customAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    let refreshTokenValidationResult: boolean = false;
    if (error.response.status >= 400 && error.response.status < 500) {
      let newAccessToken;
      // refresh access token
      const localRefreshToken = await getItemAsync(REFRESH_KEY);

      try {
        const res = await axios({
          method: "post",
          url: `${AuthAPI}/token/refresh`,
          headers: { Authorization: `Bearer ${localRefreshToken}` },
        });
        newAccessToken = res.data.newAccessToken;
        await setItemAsync(ACCESS_KEY, newAccessToken);
        refreshTokenValidationResult = true;
      } catch (error) {
        console.log("catch Error:" + error);
        refreshTokenValidationResult = false;
      }
    }
    console.log(refreshTokenValidationResult);
    // prettier-ignore
    return refreshTokenValidationResult? customAxiosInstance(originalRequest) : Promise.reject(error);
  }
);

export default customAxiosInstance;
