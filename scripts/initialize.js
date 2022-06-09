const axios = require('axios');

axios.get('http://localhost:3000/initial_connection').then(res => {
    console.log(`statusCode: ${res.status}`)
    console.log(res.data);
}).catch(error => {
    console.error(error);
});