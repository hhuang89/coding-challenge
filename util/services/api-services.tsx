import axios from 'axios'
import {IResponse} from "../../lib/model/response";


export function getData(): Promise<IResponse> {
    return axios.get('/data.json').then(res => res.data)
}