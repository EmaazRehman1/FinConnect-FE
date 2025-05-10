import axios from "axios";
// const server = "https://webkode-server.vercel.app";
const server = "http://localhost:5000";

const finteckApi = axios.create({
  baseURL: `${server}/api`,
  withCredentials: true,
});

export default finteckApi;
