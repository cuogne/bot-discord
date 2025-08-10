import { CGVTheater } from "../CGVTheater.js";
import { getCurrentDate } from "./getCurrentDate.js";

export function setFileName(province, cinemaName) {
    // dd-mm-yyyy-id_file-cgv-data.json
    const date = getCurrentDate()
    const id_file = CGVTheater[province][cinemaName].id_file
    return `${date}-${id_file}-cgv-data.json`
}