import Axios from "axios";

export const client = () =>
  Axios.create({
    baseURL: "http://localhost:8989"
  });
