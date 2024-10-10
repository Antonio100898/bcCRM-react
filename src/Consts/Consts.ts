import { server } from "../API/axoisConfig";

export const IMAGES_PATH_PROBLEMSX =
  "https://beecomm.azurewebsites.net/Pics/problems/";

export const IMAGES_PATH_PROBLEMS = "http://localhost:56967/Pics/problems/";

export const JobTypeColors = {
  1: "#E7EFFF",
  2: "#FFF4D9",
  5: "#FFF5FE",
};

export const TOKEN_KEY = "key";

export const FILTER_VALUE = "FILTER_VALUE";

export const IMAGES_PATH_WORKERSX =
  "https://beecomm.azurewebsites.net/Pics/workers/";

export const IMAGES_PATH_WORKERS =
  process.env.NODE_ENV === "production"
    ? server + "/Pics/workers/"
    : "https://st3.depositphotos.com/1767687/17621/v/450/depositphotos_176214104-stock-illustration-default-avatar-profile-icon.jpg";

export const sickdaysImagePathX = server + "/Pics/sickDays/";

export const sickdaysImagePath =
  process.env.NODE_ENV === "production"
    ? server + "Pics/sickDays/"
    : "http://localhost:56967/Pics/sickDays/";

export const color_dark_blue = "#160B57";
export const color_main_light = "#FFE7A8";
export const color_grey = "#F8F8F8";
export const color_blue = "#1C3FBB";
export const color_main = "#FFC121";
export const color_light_blue = "#E7EFFF";
export const color_blue_special = "#3965FF";
export const color_green = "#299F0B";
export const color_green_light = "#D1FFB8";
export const color_pink = "#f092a4";
export const color_yellow = "#f0eb92";
