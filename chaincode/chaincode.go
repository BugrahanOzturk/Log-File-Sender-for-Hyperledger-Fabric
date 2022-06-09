package main

import (
	"fmt"
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}

func (s *SmartContract) Receive_Line(ctx contractapi.TransactionContextInterface, line string) error {
	// Get ID of submitting client identity
	caller, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return fmt.Errorf("failed to get client id: %v", err)
	}

	currentLogFile_bytes, err := ctx.GetStub().GetState(caller)
	if err != nil {
		return fmt.Errorf("failed to read current logfile from the world state: %v", err)
	}

	var new_log string

	// Concatanate the new line with the existing logfile
	new_log = line + string(currentLogFile_bytes)

	// Write the New Logfile to the ledger state
	err = ctx.GetStub().PutState(caller, []byte(new_log))
	if err != nil {
		return err
	}

	log.Printf("Succesfully added a log line to the existing logfile")
	return nil
}

func (s *SmartContract) Return_LogFile(ctx contractapi.TransactionContextInterface) (string, error) {
	// Get ID of submitting client identity
	caller, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return "", fmt.Errorf("failed to get client id: %v", err)
	}

	currentLogFile_bytes, err := ctx.GetStub().GetState(caller)
	if err != nil {
		return "", fmt.Errorf("failed to read the current logfile from the world state: %v", err)
	}

	var current_log string

	current_log = string(currentLogFile_bytes)

	log.Printf("Current logfile in the ledger state is %s", current_log)
	return current_log, nil
}

func (s *SmartContract) Delete_LogFile(ctx contractapi.TransactionContextInterface) error {
	// Get ID of submitting client identity
	caller, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return fmt.Errorf("failed to get client id: %v", err)
	}

	logfile := ""
	// Write empty Logfile to the ledger state
	err = ctx.GetStub().PutState(caller, []byte(logfile))
	if err != nil {
		return err
	}

	log.Printf("Succesfully deleted the existing logfile!")
	return nil
}

func (s *SmartContract) Dummy_Tx(ctx contractapi.TransactionContextInterface) error {
	// Get ID of submitting client identity
	caller, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return fmt.Errorf("failed to get client id: %v", err)
	}

	// Create compositeKey for the token owner
	comp_key, err := ctx.GetStub().CreateCompositeKey("dummy_tx", []string{caller})
	if err != nil {
		return fmt.Errorf("failed to create withdraw key for prefix %s: %v", "dummy_tx", err)
	}

	err = ctx.GetStub().PutState(comp_key, []byte(""))
	if err != nil {
		return err
	}

	log.Printf("Succesfully added a dummy tx")
	return nil
}

func main() {
	logFileChaincode, err := contractapi.NewChaincode(&SmartContract{})
	if err != nil {
		log.Panicf("Error creating logfile writer chaincode: %v", err)
	}

	if err := logFileChaincode.Start(); err != nil {
		log.Panicf("Error starting logfile writer chaincode: %v", err)
	}
}
