import axios from 'axios';

export function log(data) {
    console.log(data);
    axios({
        method: 'post',
        url: 'http://localhost:8000/log-action',
        data: data,
    })
    .then((res) => {
        console.log(res);
    })
    .catch((error) => {
        console.error(error);
    });
}
