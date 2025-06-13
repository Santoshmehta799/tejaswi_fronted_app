import axios from "axios";
import Cookies from "js-cookie";

export const refreshToken = async () => {
    try {
        const getRefresh = Cookies.get("refresh");
        const response = await axios.post(
            `${process.env.REACT_APP_API_KEY}/auth/refresh-token/`,
            {
                refresh: getRefresh,
            }
        );

        const newAccessToken = response?.data?.access_token;
        Cookies.set("access", newAccessToken);
        return newAccessToken;
    } catch (error) {
        console.log(error);
        // Cookies.remove("access");
        // window.location.href = "/login";
    }
};