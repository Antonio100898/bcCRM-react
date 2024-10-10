import axios from "axios";

export const server = "https://beecomm-blueslot.azurewebsites.net/";
export const URL =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:56967/CrmWS.asmx/"
    : server + "crmws.asmx/";

export const instance = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
  },
});
