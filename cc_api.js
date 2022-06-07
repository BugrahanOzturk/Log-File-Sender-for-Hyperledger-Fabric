/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('./AppUtil.js');

const channelName = 'mychannel';
const chaincodeName = 'basic';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
//const org1UserId = 'appUser9';

var ccp;
var caClient;
var wallet;
var gateway;
var network;
var contract;

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

exports.init_identity = async () => {
	try {
		ccp = buildCCPOrg1();
		caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
		wallet = await buildWallet(Wallets, walletPath);
	} catch(error) {
		console.error(`******** FAILED to initiliaze Identity for Hyperledger Fabric Connection: ${error}`);
	}
}

exports.connect_network = async (org1UserId) => {
	try {
		await enrollAdmin(caClient, wallet, mspOrg1);
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

		gateway = new Gateway();

		await gateway.connect(ccp, {
			wallet,
			identity: org1UserId,
			discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
		});

		// Build a network instance based on the channel where the smart contract is deployed
		network = await gateway.getNetwork(channelName);

		// Get the contract from the network.
		contract = network.getContract(chaincodeName);

	} catch(error) {
		console.error(`******** FAILED to initiliaze Hyperledger Fabric Connection: ${error}`);
	}
}

exports.get_logfile = async () => {
	try{
		console.log('\n--> Evaluate Transaction: Return_LogFile, function returns the current logfile in ledger state')
		let result = await contract.evaluateTransaction('Return_LogFile');
		console.log(`*** Result: ${result}`);
		return result.toString();
	} catch(error) {
		console.error(`******** FAILED to retrieve the current logfile from the ledger state: ${error}`);
	}
}
