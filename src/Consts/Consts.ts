import { URL } from "../API/axoisConfig";

export const TOKEN_KEY = "key";

export const FILTER_VALUE = "FILTER_VALUE";

export const IMAGES_PATH_WORKERSX =
  "https://beecomm.azurewebsites.net/Pics/workers/";

export const IMAGES_PATH_WORKERS =
  process.env.NODE_ENV === "production"
    ? URL + "/Pics/workers/"
    : "https://st3.depositphotos.com/1767687/17621/v/450/depositphotos_176214104-stock-illustration-default-avatar-profile-icon.jpg";

export const IMAGES_PATH_PROBLEMSX =
  "https://beecomm.azurewebsites.net/Pics/problems/";

export const IMAGES_PATH_PROBLEMS = "http://localhost:56967/Pics/problems/";

export const sickdaysImagePathX =
  "https://beecomm.azurewebsites.net/Pics/sickDays/";

export const sickdaysImagePath = URL + "Pics/sickDays/";
