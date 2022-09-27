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
    if (error.response.status >= 400 && error.response.status < 500) {
      let newAccessToken;
      // refresh access token
      const localRefreshToken = await getItemAsync(REFRESH_KEY);
      axios({
        method: "post",
        url: `${AuthAPI}/token/refresh`,
        headers: { Authorization: `Bearer ${localRefreshToken}` },
      })
        .then((res) => {
          try {
            newAccessToken = res.data.data.newAccessToken;
            setItemAsync(ACCESS_KEY, newAccessToken);
            // prettier-ignore
            customAxiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
          } catch (error) {
            console.log("catch Error:" + error);
          }
          return customAxiosInstance(originalRequest);
        })
        .catch((error) => {
          // prettier-ignore
          console.log("Interceptors Response Error: " + error.response.data.message);
        });
    }
    return Promise.reject(error);
  }
);

export default customAxiosInstance;
