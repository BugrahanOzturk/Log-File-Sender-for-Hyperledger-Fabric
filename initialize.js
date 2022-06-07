'use strict';

const { init_identity, connect_network } = require('./cc_api.js')

async function initializer() {
    await init_identity();
    await connect_network('testuser5');
}

initializer().then(result => {
    console.log(result);
});