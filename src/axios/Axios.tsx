import axios from "axios";
// const server = "http://localhost:5000";
const server="https://fin-connect-backend.vercel.app"


const finteckApi = axios.create({
  baseURL: `${server}/api`,
  withCredentials: true,
});

export default finteckApi;
