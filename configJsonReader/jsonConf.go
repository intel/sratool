package configJsonReader

import (
    "encoding/json"
    "io/ioutil"
    "log"
    "os"
)

type configParams struct {
    tcpserver, port string
}

func ReadConfig(filename string, parametro string) (string, error) {
   file, e := ioutil.ReadFile(filename)   
   if e != nil {
      /* Logging */
         flog2, err := os.OpenFile("logfile.log", os.O_APPEND|os.O_CREATE|os.O_RDWR, 0666)
         if err != nil {
           //TODO -> NO logging file - problems creating or opening
           log.Println("INFO: No Config File was found..." + e.Error())
           return "-1, No LogFile", e
         }
         log.Println("INFO: Config File WAS found..." + e.Error())
         log.SetOutput(flog2)
         log.Println("INFO: No Config File was found..." + e.Error())
         defer flog2.Close()
         return "-1", e
    }

     
    var paramValues map[string]interface{} //configParams
    json.Unmarshal(file, &paramValues)
    num := paramValues[parametro].(string)
    return num, nil
}
