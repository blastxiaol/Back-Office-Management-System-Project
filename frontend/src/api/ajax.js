/*
 The Module can send asynchronous ajax request.
 Use axios library.
 Returned Values is a promise object.
 */
import axios from 'axios';
import { message } from 'antd'

export default function ajax(url, data={}, type='GET') {
    return new Promise((reslove, reject) => {
        // Excuter
        let promise;
        if (type === 'GET') {
            promise = axios.get(url, {
                params: data
            });
        } else {
            promise = axios.post(url, data);
        }
        promise.then((response) => {
            reslove(response);
        }).catch((error) => {
            message.error('Failed Request: ' + error.message);
        })
    }) 
}