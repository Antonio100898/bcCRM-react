import axios from "axios";

export const URL = "http://localhost:56967/CrmWS.asmx/"

export const instance = axios.create({
  baseURL: URL,
  //baseURL: "https://beecomm-blueslot.azurewebsites.net/crmws.asmx/",
  headers: {
    "Content-Type": "application/json",
  },
});
