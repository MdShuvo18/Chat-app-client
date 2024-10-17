import axios from "axios";

const useAxios = axios.create({
    baseURL: 'http://localhost:5000'
})

const useAxiosPublic = () => {
    return useAxios;
};

export default useAxiosPublic;