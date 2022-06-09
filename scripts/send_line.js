const axios = require('axios');
var fs = require('fs');

axios.post('http://localhost:3000/dummy_tx', {
}).then(res => {
    console.log(`statusCode: ${res.status}`);
    console.log(res.data);
}).catch(error => {
    console.error(error);
});

fs.readFile("../logfiles/Total_Instantiation_Time.txt", (error, data) => {
    if(error) {
        throw error;
    }
    axios.post('http://localhost:3000/send_line', {
        line: data.toString()
    }).then(res => {
        console.log(`statusCode: ${res.status}`);
        console.log(res.data);
    }).catch(error => {
        console.error(error);
    });
});

/*axios.post('http://localhost:3000/send_line', {
    line: 'test_tx_stop'
}).then(res => {
    console.log(`statusCode: ${res.status}`);
    console.log(res.data);
}).catch(error => {
    console.error(error);
});*/