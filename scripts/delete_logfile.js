const axios = require('axios');

axios.post('http://localhost:3000/delete_logfile', {
}).then(res => {
    console.log(`statusCode: ${res.status}`);
    console.log(res.data);
}).catch(error => {
    console.error(error);
});