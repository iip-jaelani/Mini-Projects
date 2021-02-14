import Axios from "axios";

export const client = () =>
  Axios.create({
    baseURL: "http://192.168.8.101:8989"
  });
