package main

import (
    "strings"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"	
	"github.com/gorilla/mux"
)

// Gets All projects from SRA DB
func sraProjects(w http.ResponseWriter, r *http.Request) {

	theprojects, err := getSRAProjects()
	if err != nil {
		fmt.Print(err.Error())
	}
	fmt.Fprintf(w, theprojects)
}

// Gets Role of User on auth Header
func sraRole(w http.ResponseWriter, r *http.Request) {

	fmt.Println(displayName)
	theprojects, err := getSRARole(displayName)
	if err != nil {
		fmt.Print(err.Error())
	}
	fmt.Fprintf(w, theprojects)
}

// Gets specific project from SRA DB
func sraProjectsWithId(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	prjId := vars["prjId"]
	theprojects, err := getSRAProjectsGralInfo(prjId)
	if err != nil {
		fmt.Print(err.Error())
	}
	fmt.Fprintf(w, theprojects)
}

func sraSummarybystatus(w http.ResponseWriter, r *http.Request) {

	theprojects, err := getSRASummaryByStatus()
	if err != nil {
		fmt.Print(err.Error())
	}
	fmt.Fprintf(w, theprojects)
}

func sraPSECSummary(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	psecId := vars["psecId"]
	theprojects, err := getSRASummaryByPSEC(psecId)
	if err != nil {
		fmt.Print(err.Error())
	}
	fmt.Fprintf(w, theprojects)
}

func sdlSummarybystatus(w http.ResponseWriter, r *http.Request) {

	theprojects, err := getSDLSummaryByStatus()
	if err != nil {
		fmt.Print(err.Error())
	}
	fmt.Fprintf(w, theprojects)
}
func sdlSummarybyBU(w http.ResponseWriter, r *http.Request) {

	theprojects, err := getSDLSummaryByBU()
	if err != nil {
		fmt.Print(err.Error())
	}
	fmt.Fprintf(w, theprojects)
}

func sraRiskfactortypes(w http.ResponseWriter, r *http.Request) {

	theprojects, err := getSRARiskFactorTypes()
	if err != nil {
		fmt.Print(err.Error())
	}
	fmt.Fprintf(w, theprojects)
}

//SDL STATUS REPORT - SDL related - Support for Tibbs Reports

func sdlStatusReport(w http.ResponseWriter, r *http.Request) {

	theprojects, err := getSdlStatusReport()
	if err != nil {
		fmt.Print(err.Error())
	}
	fmt.Fprintf(w, theprojects)
}

// Gets detail from an specific SELECT a.* FROM sra_prod.sra_riskfactor inner join  sra_riskassessment_type b on a.id_riskassessment_type = b.id  where id_riskassessment_type = 1 and a.version = b.currentVersion order by sucesivo;

func sraProjectdetails(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	prjId := vars["prjId"]
	theprojects, err := getSRAProjectDetail(prjId)
	if err != nil {
		fmt.Print(err.Error())
	}
	fmt.Fprintf(w, theprojects)
}

func sraPartialreqdetails(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	prjId := vars["prjId"]
	theprojects, err := getSRAPartialReqDetail(prjId)
	if err != nil {
		fmt.Print(err.Error())
	}
	fmt.Fprintf(w, theprojects)
}

func sraScorescatalog(w http.ResponseWriter, r *http.Request) {
	theprojects, err := getSRAScoresCatalog()
	if err != nil {
		fmt.Print(err.Error())
	}
	fmt.Fprintf(w, theprojects)
}

func sraRiskfactorguides(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	riskId := vars["riskId"]
	theprojects, err := getSRARiskFactor(riskId)
	if err != nil {
		fmt.Print(err.Error())
	}
	fmt.Fprintf(w, theprojects)
}

func sraRiskfactorguidesscore(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	riskId := vars["riskId"]
	theprojects, err := getSRARiskFactorGuides(riskId)
	if err != nil {
		fmt.Print(err.Error())
	}
	fmt.Fprintf(w, theprojects)
}

func sraActionscatalog(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	riskId := vars["riskId"]
	versionId := vars["versionId"]
	theprojects, err := getSRAActions(riskId, versionId)
	if err != nil {
		fmt.Print(err.Error())
	}
	fmt.Fprintf(w, theprojects)
}

func sraRiskfactortype(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	riskId := vars["riskId"]
	versionId := vars["versionId"]
	theprojects, err := getSRARiskFactorType(riskId, versionId)
	if err != nil {
		fmt.Print(err.Error())
	}
	fmt.Fprintf(w, theprojects)
}

func sraScorescreate(w http.ResponseWriter, r *http.Request) {
	otcscoreMap := make(map[string]interface{})
	body, err := ioutil.ReadAll(io.LimitReader(r.Body, len(r.Body)+1)
	if err != nil {
		fmt.Println(err) //panic(err)
	}
	if err := r.Body.Close(); err != nil {
		fmt.Println(err)
	}
	if err := json.Unmarshal(body, &otcscoreMap); err != nil {
		w.WriteHeader(422) // unprocessable entity
		if err := json.NewEncoder(w).Encode(err); err != nil {
			panic(err)
		}
	}

	fmt.Println(otcscoreMap["status"].(string))
	theprojects, err := setSRAScoresCatalog(otcscoreMap["id"].(float64), otcscoreMap["name"].(string), otcscoreMap["status"].(string))
	if err != nil {
		fmt.Print(err.Error())
	}

	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(theprojects); err != nil {
		handleError(err, 0, "sra_scorescreate")
	}
}

// Send New Request to DB
func sraMockssgsra(w http.ResponseWriter, r *http.Request) {
	defer func() {
		if r := recover(); r != nil {
			var ok bool
			err, ok := r.(error)
			if !ok {
				err = fmt.Errorf("RECOVER sraMockssgsra: %v", r)
				w.WriteHeader(422) // unprocessable entity
				if err := json.NewEncoder(w).Encode(err); err != nil {
					fmt.Println(err.Error()) //     panic(err)
				}
			}
		}
	}()
	sraMockssgsraDB(w, r)
}

func sraMockssgsraDB(w http.ResponseWriter, r *http.Request) {
	fmt.Println("MockssgSra")
	otcscoreMap := make(map[string]interface{})
	body, err := ioutil.ReadAll(io.LimitReader(r.Body, len(r.Body)+1))

	if err != nil {
		fmt.Println(err) //panic(err)
	}
	if err := r.Body.Close(); err != nil {
		fmt.Println(err)
	}

	if err := json.Unmarshal(body, &otcscoreMap); err != nil {
		w.WriteHeader(422) // unprocessable entity
		if err := json.NewEncoder(w).Encode(err); err != nil {
			fmt.Println(err.Error()) //     panic(err)
		}
	}

	theprojects, err := getMockssgsra(string(body))

	if err != nil {
		fmt.Print(err.Error())
	} else {
		fmt.Println("enviando a pantalla theprojects")
		fmt.Println(theprojects)
	}

	fmt.Fprintf(w, theprojects)

}

// Inactivating SRA
func sraInactiveSra(w http.ResponseWriter, r *http.Request) {
	defer func() {
		if r := recover(); r != nil {
			var ok bool
			err, ok := r.(error)
			if !ok {
				err = fmt.Errorf("RECOVER sraInactiveSra: %v", r)
				w.WriteHeader(422) // unprocessable entity
				if err := json.NewEncoder(w).Encode(err); err != nil {
					fmt.Println(err.Error()) //     panic(err)
				}
			}
		}
	}()
	sraInactiveSraDB(w, r)
}

func sraInactiveSraDB(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	prjId := vars["projectId"]
	wwidEraser := vars["wwidBy"]
	fmt.Println("InactiveSra")
	otcscoreMap := make(map[string]interface{})
	body, err := ioutil.ReadAll(io.LimitReader(r.Body, len(r.Body)+1))

	if err != nil {
		fmt.Println(err) //panic(err)
	}
	if err := r.Body.Close(); err != nil {
		fmt.Println(err)
	}

	if err := json.Unmarshal(body, &otcscoreMap); err != nil {
		w.WriteHeader(422) // unprocessable entity
		if err := json.NewEncoder(w).Encode(err); err != nil {
			fmt.Println(err.Error()) //     panic(err)
		}
	}

	theprojects, err := deletingSRA(string(body), prjId, wwidEraser)

	if err != nil {
		fmt.Print(err.Error())
	} else {
		fmt.Println("SRA with ID: " + prjId + "  Set to Inactive by : " + wwidEraser)
		fmt.Println(theprojects)
	}

	fmt.Fprintf(w, theprojects)

}

// sradeleteSrabyAdmin
func sradeleteSrabyAdmin(w http.ResponseWriter, r *http.Request) {
	defer func() {
		if r := recover(); r != nil {
			var ok bool
			err, ok := r.(error)
			if !ok {
				err = fmt.Errorf("RECOVER sradeleteSrabyAdmin: %v", r)
				w.WriteHeader(422) // unprocessable entity
				if err := json.NewEncoder(w).Encode(err); err != nil {
					fmt.Println(err.Error()) //     panic(err)
				}
			}
		}
	}()
	sradeleteSrabyAdminDB(w, r)
}

func sradeleteSrabyAdminDB(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	prjId := vars["projectId"]

	fmt.Println("deleteSraByAdmin")
	fmt.Println(uniId)
	otcscoreMap := make(map[string]interface{})
	body, err := ioutil.ReadAll(io.LimitReader(r.Body, 1048576))

	if err != nil {
		fmt.Println(err) //panic(err)
	}
	if err := r.Body.Close(); err != nil {
		fmt.Println(err)
	}

	if err := json.Unmarshal(body, &otcscoreMap); err != nil {
		w.WriteHeader(422) // unprocessable entity
		if err := json.NewEncoder(w).Encode(err); err != nil {
			fmt.Println(err.Error()) //     panic(err)
		}
	}

	theprojects, err := deletingSRAByAdmin(string(body), prjId, uniId)

	if err != nil {
		fmt.Print(err.Error())
	} else {
		fmt.Println("SRA with ID: " + prjId + "  Archived Incomplete by : " + uniId)
		fmt.Println(theprojects)
	}

	fmt.Fprintf(w, theprojects)

}

// sraAddAdmin
func sraAddAdmin(w http.ResponseWriter, r *http.Request) {
	defer func() {
		if r := recover(); r != nil {
			var ok bool
			err, ok := r.(error)
			if !ok {
				err = fmt.Errorf("RECOVER sraAddAdmin: %v", r)
				w.WriteHeader(422) // unprocessable entity
				if err := json.NewEncoder(w).Encode(err); err != nil {
					fmt.Println(err.Error()) //     panic(err)
				}
			}
		}
	}()
	sraAddAdminDB(w, r)
}

func sraAddAdminDB(w http.ResponseWriter, r *http.Request) {
	//        vars := mux.Vars(r)

	fmt.Println("AddAdmin")
	fmt.Println(uniId)
	otcscoreMap := make(map[string]interface{})
	body, err := ioutil.ReadAll(io.LimitReader(r.Body, len(r.Body)+1))

	if err != nil {
		fmt.Println(err) //panic(err)
	}
	if err := r.Body.Close(); err != nil {
		fmt.Println(err)
	}

	if err := json.Unmarshal(body, &otcscoreMap); err != nil {
		w.WriteHeader(422) // unprocessable entity
		if err := json.NewEncoder(w).Encode(err); err != nil {
			fmt.Println(err.Error()) //     panic(err)
		}
	}

	theprojects, err := addAdmin(string(body), uniId)

	if err != nil {
		fmt.Print(err.Error())
	} else {
		fmt.Println("Add Admin operation Completed By " + uniId)
		fmt.Println(theprojects)
	}

	fmt.Fprintf(w, theprojects)
}

// sraRemoveAdmin
func sraRemoveAdmin(w http.ResponseWriter, r *http.Request) {
	defer func() {
		if r := recover(); r != nil {
			var ok bool
			err, ok := r.(error)
			if !ok {
				err = fmt.Errorf("RECOVER sraRemoveAdmin: %v", r)
				w.WriteHeader(422) // unprocessable entity
				if err := json.NewEncoder(w).Encode(err); err != nil {
					fmt.Println(err.Error()) //     panic(err)
				}
			}
		}
	}()
	sraRemoveAdminDB(w, r)
}

func sraRemoveAdminDB(w http.ResponseWriter, r *http.Request) {
	//      vars := mux.Vars(r)

	fmt.Println("RemoveAdmin")
	fmt.Println(uniId)
	otcscoreMap := make(map[string]interface{})
	body, err := ioutil.ReadAll(io.LimitReader(r.Body, len(r.Body)+1))

	if err != nil {
		fmt.Println(err) //panic(err)
	}
	if err := r.Body.Close(); err != nil {
		fmt.Println(err)
	}

	if err := json.Unmarshal(body, &otcscoreMap); err != nil {
		w.WriteHeader(422) // unprocessable entity
		if err := json.NewEncoder(w).Encode(err); err != nil {
			fmt.Println(err.Error()) //     panic(err)
		}
	}

	theprojects, err := removeAdmin(string(body), uniId)

	if err != nil {
		fmt.Print(err.Error())
	} else {
		fmt.Println("Remove Admin operation completed by  " + uniId)
		fmt.Println(theprojects)
	}

	fmt.Fprintf(w, theprojects)
}

// Send New Request to DB
func sraRequestscreate(w http.ResponseWriter, r *http.Request) {
	defer func() {
		if r := recover(); r != nil {
			var ok bool
			err, ok := r.(error)
			if !ok {
				err = fmt.Errorf("RECOVER sraRequestscreate: %v", r)
				w.WriteHeader(422) // unprocessable entity
				if err := json.NewEncoder(w).Encode(err); err != nil {
					fmt.Println(err.Error()) //     panic(err)
				}
			}
		}
	}()
	sraRequestscreateDB(w, r)
}

func sraRequestscreateDB(w http.ResponseWriter, r *http.Request) {
	fmt.Println("requestCreate")
	otcscoreMap := make(map[string]interface{})
	body, err := ioutil.ReadAll(io.LimitReader(r.Body, len(r.Body)+1))

	if err != nil {
		fmt.Println(err) //panic(err)
	}
	if err := r.Body.Close(); err != nil {
		fmt.Println(err)
	}

	if err := json.Unmarshal(body, &otcscoreMap); err != nil {
		w.WriteHeader(422) // unprocessable entity
		if err := json.NewEncoder(w).Encode(err); err != nil {
			fmt.Println(err.Error()) //     panic(err)
		}
	}

	theprojects, err := setSRARequests(1, string(body))

	if err != nil {
		fmt.Print(err.Error())
	} else {
		fmt.Println("enviando a pantalla theprojects")
		fmt.Println(theprojects)
	}

	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(theprojects); err != nil {
		//                handleError(err, 0, "sra_requestcreate on json.NewEncoder")
	}

}

//Edit SRA Request
func sraRequestsedit(w http.ResponseWriter, r *http.Request) {
	defer func() {
		if r := recover(); r != nil {
			var ok bool
			err, ok := r.(error)
			if !ok {
				err = fmt.Errorf("RECOVER sraRequestsedit: %v", r)
				w.WriteHeader(422) // unprocessable entity
				if err := json.NewEncoder(w).Encode(err); err != nil {
					fmt.Println(err.Error()) //     panic(err)
				}
			}
		}
	}()
	sraRequestseditDB(w, r)
}

func sraRequestseditDB(w http.ResponseWriter, r *http.Request) {
	fmt.Println("requestCreate")
	otcscoreMap := make(map[string]interface{})
	body, err := ioutil.ReadAll(io.LimitReader(r.Body, len(r.Body)+1))

	if err != nil {
		fmt.Println(err) //panic(err)
	}
	if err := r.Body.Close(); err != nil {
		fmt.Println(err)
	}

	if err := json.Unmarshal(body, &otcscoreMap); err != nil {
		w.WriteHeader(422) // unprocessable entity
		if err := json.NewEncoder(w).Encode(err); err != nil {
			fmt.Println(err.Error()) //     panic(err)
		}
	}

	theprojects, err := setSRAEditRequests(1, string(body))

	if err != nil {
		fmt.Print(err.Error())
	} else {
		fmt.Println("enviando a pantalla theprojects")
		fmt.Println(theprojects)
	}

	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(theprojects); err != nil {
		//                handleError(err, 0, "sra_requestcreate on json.NewEncoder")
	}

}

//Send SRA  Detailed Assessment to DB
func sraReqdetcreated(w http.ResponseWriter, r *http.Request) {
	defer func() {
		if r := recover(); r != nil {
			var ok bool
			err, ok := r.(error)
			if !ok {
				err = fmt.Errorf("RECOVER sraReqdetcreated: %v", r)
				w.WriteHeader(422) // unprocessable entity
				if err := json.NewEncoder(w).Encode(err); err != nil {
					fmt.Println(err.Error()) //     panic(err)
				}
			}
		}
	}()
	sraReqdetcreatedDB(w, r)
}

func sraReqdetcreatedDB(w http.ResponseWriter, r *http.Request) {
	otcscoreMap := make(map[string]interface{})
	body, err := ioutil.ReadAll(io.LimitReader(r.Body, len(r.Body)+1))

	if err != nil {
		fmt.Println(err) //panic(err)
	}
	if err := r.Body.Close(); err != nil {
		fmt.Println(err)
	}

	if err := json.Unmarshal(body, &otcscoreMap); err != nil {
		w.WriteHeader(422) // unprocessable entity
		if err := json.NewEncoder(w).Encode(err); err != nil {
			fmt.Println(err.Error()) //			panic(err)
		}
	}
	fmt.Println("handlers Det Req")
	theprojects, err := setSRADetRequests(2, string(body))

	if err != nil {
		fmt.Print(err.Error())
	} else {
		fmt.Println("enviando a pantalla the detail")
		fmt.Println(theprojects)
	}

	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(theprojects); err != nil {
		//                handleError(err, 0, "sra_requestcreate on json.NewEncoder")
	}

}

//Send SRA  Detailed Assessment to DB
func sraPartialreqdetcreated(w http.ResponseWriter, r *http.Request) {
	defer func() {
		if r := recover(); r != nil {
			var ok bool
			err, ok := r.(error)
			if !ok {
				err = fmt.Errorf("RECOVER sraPartialreqdetcreated: %v", r)
				w.WriteHeader(422) // unprocessable entity
				if err := json.NewEncoder(w).Encode(err); err != nil {
					fmt.Println(err.Error()) //     panic(err)
				}
			}
		}
	}()
	sraPartialreqdetcreatedDB(w, r)
}

func sraPartialreqdetcreatedDB(w http.ResponseWriter, r *http.Request) {
	otcscoreMap := make(map[string]interface{})
	body, err := ioutil.ReadAll(io.LimitReader(r.Body, len(r.Body)+1))

	if err != nil {
		fmt.Println(err) //panic(err)
	}
	if err := r.Body.Close(); err != nil {
		fmt.Println(err)
	}

	if err := json.Unmarshal(body, &otcscoreMap); err != nil {
		w.WriteHeader(422) // unprocessable entity
		if err := json.NewEncoder(w).Encode(err); err != nil {
			fmt.Println(err.Error()) //			panic(err)
		}
	}
	fmt.Println("handlers Partial Det Req")
	theprojects, err := setSRAPartialDetRequests(3, string(body))

	if err != nil {
		fmt.Print(err.Error())
	} else {
		fmt.Println("enviando a pantalla Partial detail")
		fmt.Println(theprojects)
	}

	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(theprojects); err != nil {
		//                handleError(err, 0, "sra_requestcreate on json.NewEncoder")
	}
}

func sraValidatePayload(w http.ResponseWriter, r *http.Request, opName string) (bodyFromStream []byte, isValid bool) {
	otcscoreMap := make(map[string]interface{})
	body, err := ioutil.ReadAll(io.LimitReader(r.Body, len(r.Body)+1))

	if err != nil {
		handleError(err, 0, opName)
		return nil, false
	}
	if err := r.Body.Close(); err != nil {
		handleError(err, 0, opName+" OnClosingr.Body")
		return nil, false
	}

	if err := json.Unmarshal(body, &otcscoreMap); err != nil {
		w.WriteHeader(422) // unprocessable entity
		if err := json.NewEncoder(w).Encode(err); err != nil {
			handleError(err, 0, opName+" 422 error")
			http.Error(w, err.Error(), 500)
			return nil, false
		}
	}
	fmt.Println(otcscoreMap)

	return body, true

}

func handleError(err error, typeExit int, opName string) {
	//TODO: Handle exceptions
	fmt.Println("Error on: " + opName)
	fmt.Println(err.Error())
}

func secAuthorize(page http.HandlerFunc, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	fmt.Print("ESto es una prueba")
	fmt.Print(r.Header.Get("Authorization"))
	return page
}


func Index(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Add menus here!\n")
}

/* SDL Related Functions  */
// getrolesbysdl/{projectid}
func sraRolesBySDL(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	prjId := vars["prjId"]
	theprojects, err := getRolesBySDL(prjId)
	if err != nil {
		fmt.Print(err.Error())
	}
	fmt.Fprintf(w, theprojects)
}


func sraUserInfo(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	empId := vars["empId"]
	theprojects, err := getUserInfoByID(empId)
	if err != nil {
		fmt.Print(err.Error())
	}
	fmt.Fprintf(w, theprojects)
}


