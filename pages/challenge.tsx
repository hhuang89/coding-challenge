import axios from 'axios'
import { useEffect } from 'react'
import { getData } from '../lib/services/api-services'
import { IResponse } from '../lib/model/response'

export default function codeChallenge() {
    useEffect(() => {
        getData().then((res: IResponse) => {
            console.log(res)
        })
    })
    return (<div>hello</div>)
}