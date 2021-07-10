import axios from 'axios'
import {IResponse} from "../model/response";


export function getData(): Promise<IResponse> {
    return axios.get('/data.json').then(res => res.data)
}

export function testCase1(): Promise<IResponse> {
    return axios.get('/testcase1.json').then(res => res.data)
}

export function testCase2(): Promise<IResponse> {
    return axios.get('/testcase2.json').then(res => res.data)
}

export function testCase3(): Promise<IResponse> {
    return axios.get('/testcase3.json').then(res => res.data)
}