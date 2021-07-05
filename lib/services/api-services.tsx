import axios from 'axios'
import {IResponse, Datum} from "../model/response";
export const baseURL = "/data.json";


export function getData(): Promise<IResponse> {
    return axios.get('/data.json')
}