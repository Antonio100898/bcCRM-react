import axios from "axios";
import { TOKEN_KEY } from "../Consts/Consts";

export const instance = axios.create({
  baseURL: "http://localhost:56967/CrmWS.asmx/",
  // baseURL: 'https://beecomm-blueslot.azurewebsites.net/crmws.asmx/',
  // baseURL: 'https://beecomm.azurewebsites.net/crmws.asmx/',
  headers: {
    "Content-Type": "application/json",
  },
});

export const workerKey = localStorage.getItem(TOKEN_KEY);