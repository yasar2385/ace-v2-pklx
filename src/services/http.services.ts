import axios from "axios";

const http = axios.create({
    baseURL: import.meta.env.VITE_APP_API_BASE_URL,
    headers: {
        "Content-type": "application/json"
    }
});

const excludeTokenPaths = ['api_get_countries'];

http.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("user")!);
    const url: string | undefined = config.url;

    if (user && user.access_token && url) {

        const isExcluded = excludeTokenPaths.some((path) => url.includes(path));

        if (!isExcluded) {
            config.headers.Authorization = `Bearer ${user.access_token}`;
        }
    }
    console.log("http.interceptors.request", JSON.stringify(config))
    return config;
}, (error) => {
    return Promise.reject(error);
});



http.interceptors.response.use((response) => {
    return response;
},
    async (error) => {
        console.error("There was an error!", error);
        if (error.response && error.response.status === 401) {
            localStorage.clear();
            window.location.href = '/';
        }
        return Promise.reject(error);
    })

export default http;
