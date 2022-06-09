const express = require('express');
const app = express();

const { init_identity, connect_network, get_logfile, receive_line, delete_logfile, dummy_tx } = require('./includes/cc_api.js');

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({extended:false}));

app.get('/initial_connection', (req, res) => {
    let result = init_identity();
    return res.send(result);
});

app.post('/connect_network', async (req, res) => {
    let result = await connect_network(JSON.stringify(req.body.test));    
    return res.send("Succesfully connected user")
    //return res.json({requestBody: req.body.test})
});

app.get('/get_logfile', async (req, res) => {
    let result = await get_logfile();
    return res.send(result);
});

app.post('/send_line', async (req, res) => {
    let result = await receive_line(req.body.line);
    return res.send(result);
});

app.post('/delete_logfile', async (req, res) => {
    let result = await delete_logfile();
    return res.send(result);
});

app.post('/dummy_tx', async (req, res) => {
    let result = await dummy_tx();
    return res.send(result);
});

app.listen(3000, () => {
    console.log('REST API Server is listening on port 3000!');
});