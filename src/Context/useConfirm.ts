import { ConfirmContext } from "./ConfirmContext";
import {useContext} from "react"

export const useConfirm = () => useContext(ConfirmContext);