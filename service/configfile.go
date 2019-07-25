package main

import (
	"configJsonReader"
	"fmt"
	"log"
)

// GetConfigParam Bring parameters from JSON file
func GetConfigParam(configParamName string, configFile string) (string, error) {
	paramVal, err := configJsonReader.ReadConfig(configFile, configParamName)
	if err != nil {
		fmt.Println("Error reading ConfigFile :", err.Error(), configFile)
		log.Fatal("FATAL: Error Obtaining Config Param")
	}
	return paramVal, nil
}
