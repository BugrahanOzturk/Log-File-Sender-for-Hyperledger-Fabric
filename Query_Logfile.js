'use strict';

const { get_logfile } = require('./cc_api.js')

get_logfile().then(result => {
    console.log(result);
})