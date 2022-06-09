const axios = require('axios');

axios.get('http://localhost:3000/get_logfile').then(res => {
    console.log(`statusCode: ${res.status}`)
    console.log(res.data);
}).catch(error => {
    console.error(error);
});