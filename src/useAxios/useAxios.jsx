import axios from "axios";

const useAxios = axios.create({
    // baseURL: 'http://localhost:5000'
    baseURL: 'chat-app-server-beta-ten.vercel.app'

})

const useAxiosPublic = () => {
    return useAxios;
};

export default useAxiosPublic;