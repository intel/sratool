package main

import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
	"log"
)

func getSRAProjects() (string, error) {

	connString := getSRAConnString()


	 
	sQuery := "SELECT distinct sra.id, sra.Project_Name as 'Project Name', sra.SRA_Score, sra.secName, sra.PSEC, "
    sQuery += "sra.sra_owner as 'SRA_Owner', sra.project_owner as 'Project_Owner1',   sra.Modified, sra.ModifiedBy, sra.Created, sra.CreatedBy, sra.SDL_Url, "
    sQuery += "sra.Path, sra.locksra, sra.prob_score, sra.sra_type, ifnull(sdl_id, 0) as Sdl_Id, ifnull(threatminer_keywords,'') "
    sQuery += "as threatminer_words, sra.Project_Owner as Project_Owner_WWID  "
	sQuery += "FROM  sra "
    sQuery += "WHERE sra.sra_type < 8  order by sra.id desc"
	
	return getJSON(sQuery, connString)
}

func getSRARole(dn string) (string, error) {
	connString := getSRAConnString()
	sQuery := "SELECT  name, role_access FROM sra_prod.sra_users where wwid = '" + uniId + "'"
	return getJSON(sQuery, connString)
}

func getSRAProjectsGralInfo(idproject string) (string, error) {

	connString := getSRAConnString()
	 

	sQuery := "SELECT sra.id, sra.Project_Name as 'Project_Name', sra.SRA_Score, sra.secName, sra.PSEC, "
    sQuery += "us.name as 'SRA_Owner', us2.name as 'Project_Owner', sra.Modified, ifnull(us3.name,'a') as 'ModifiedBy', sra.Created, us4.name as 'CreatedBy', sra.SDL_Url, sra.Path, "
    sQuery += "sra.prob_score, sra.impact_score, sra.locksra,sra.sra_type, sra.ssgsra_type, sra.xattributes, sra.sdl_id, ifnull(threatminer_keywords,'') as ThreatMiner_Keywords  "
    sQuery += "FROM  sra "
    sQuery += "left join sra_users us on sra.sra_owner = us.wwid "
    sQuery += "left join sra_users us2 on sra.project_owner = us2.wwid "
	sQuery += "left join sra_users us3 on sra.ModifiedBy = us3.wwid "
	sQuery += "left join sra_users us4 on sra.CreatedBy = us4.wwid "
	sQuery += "WHERE  (sra.id = "
	sQuery += idproject
	sQuery += " or sra.sdl_id = "
	sQuery += idproject
	sQuery += " )"

	return getJSON(sQuery, connString)
}
func getSRASummaryByStatus() (string, error) {

	connString := getSRAConnString()
	sQuery := "select Total,  Trim(substring(Ioca_items, 4, 10)) as Ioca_items from ( "
	sQuery += "select Total,  case when Ioca_items = 'Critical' then '1 - Critical' when Ioca_items = 'High' then '2 - High'  when Ioca_items = 'Medium' then '3 - Medium'  when Ioca_items = 'Low' then '4 - Low'    else '5 - Incomplete' end as Ioca_items from (select count(req.id) As Total, req.sra_score AS Ioca_items from sra as req group by req.sra_score) as summary order by Ioca_items ) as reports"
	fmt.Println(sQuery)
	return getJSON(sQuery, connString)
}

func getSRASummaryByPSEC(psecId string) (string, error) {

	connString := getSRAConnString()
	sQuery := "select Total,  Trim(substring(Ioca_items, 4, 10)) as Ioca_items, PSEC from ( "
	sQuery += "select Total,  case when Ioca_items = 'Critical' then '1 - Critical' when Ioca_items = 'High' then '2 - High'  when Ioca_items = 'Medium' then "
	sQuery += "'3 - Medium'  when Ioca_items = 'Low' then '4 - Low'    else '5 - Incomplete' end as Ioca_items, PSEC from (select count(req.id) As Total, "
	sQuery += " req.sra_score AS Ioca_items, PSEC from sra as req where (sra_type = " + psecId + " and ssgsra_type is null) "
	sQuery += " or (sra_type = 7  and ssgsra_type = " + psecId + ") group by PSEC, req.sra_score) as summary order by Ioca_items) as Reports;"
	return getJSON(sQuery, connString)
}

func getSDLSummaryByStatus() (string, error) {
	connString := getSRAConnString()
	sQuery := "select count(id) as total, sdl_status from sra_prod.sra_sdl group by sdl_status;"
	return getJSON(sQuery, connString)
}

func getSDLSummaryByBU() (string, error) {
	connString := getSRAConnString()
	sQuery := "select count(sdl.id) as total, bu.level3 from sra_prod.sra_sdl sdl "
	sQuery += " inner join sra_prod.businessUnits bu on sdl.BusinessUnitId = bu.id "
	sQuery += " group by bu.level3 "
	return getJSON(sQuery, connString)
}

//SDL STATUS REPORT

func getSdlStatusReport() (string, error) {

	connString := getSRAConnString()
	sQuery := "SELECT id_project, sdl_name, SRA_Score, Created, group_concat(PSE) as PSE,  SecCon, SdlLead,  Updated, UpdatedBy FROM "
	sQuery += "(SELECT sdl.id_project, sdl.sdl_name, sr.SRA_Score, sdl.Created, pr.PSE,  IFNULL(pr.SecCon,'') as SecCon,  "
	sQuery += "group_concat(IFNULL(pr.SdlLead,'')) as SdlLead,   sdl.Updated, sdl.UpdatedBy FROM sra_prod.sra_sdl as sdl "
	sQuery += "inner join sra_prod.the_roles pr on sdl.id_project = pr.ProjectId "
	sQuery += "inner join sra_prod.sra sr on sdl.id_project = sr.sdl_id where sdl.BusinessUnitId = 51 and sdl.sdl_status='Active' "
	sQuery += "group by sdl.id_project,pr.PSE,  sdl.sdl_name, sr.SRA_Score, sdl.Created,  sdl.Updated, sdl.UpdatedBy, SecCon ) as tt "
	sQuery += "group by id_project, SdlLead, sdl_name, SRA_Score, Created,  Updated, UpdatedBy, SecCon "
	return getJSON(sQuery, connString)
}

func getSRAConnString() string {
	connString, err := GetConfigParam("connstring", "sra.config.json")
	if err != nil {
		fmt.Println(err.Error())
	}

	conDb, err := GetConfigParam("database", "sra.config.json")
	if err != nil {
		fmt.Println(err.Error())
	}
	connString += "/" + conDb
	return connString
}

func getSRAScoresCatalog() (string, error) {

	connString := getSRAConnString()
	sQuery := "SELECT id, name, status FROM sra_prod.sectool_request_score;"
	fmt.Println(sQuery)
	return getJSON(sQuery, connString)

}

func getSRARiskFactor(riskfactorType string) (string, error) {

	connString := getSRAConnString()
	sQuery := "SELECT a.* FROM sra_prod.sra_riskfactor a inner join  sra_riskassessment_type b on a.id_riskassessment_type = b.id "
	sQuery += " where id_riskassessment_type = " + riskfactorType + " and a.version = b.currentVersion order by sucesivo;"
	fmt.Println(sQuery)
	return getJSON(sQuery, connString)

}

func getSRARiskFactorGuides(riskfactorType string) (string, error) {

	connString := getSRAConnString()
	sQuery := " SELECT a.* FROM sra_prod.sra_guidelines a inner join  sra_riskassessment_type b on a.id_riskassessment_type = b.id"
	sQuery += " where id_riskassessment_type = " + riskfactorType + " and a.version = b.currentVersion  order by id_riskfactor;"
	fmt.Println(sQuery)
	return getJSON(sQuery, connString)

}

func getSRAProjectDetail(idproject string) (string, error) {
	connString := getSRAConnString()
	sQuery := "SELECT * FROM sra_prod.sra_projectDetails where id_project = " + idproject + "  order by sucesivo"
	fmt.Println(sQuery)
	return getJSON(sQuery, connString)
}

func getSRAPartialReqDetail(idproject string) (string, error) {
	connString := getSRAConnString()
	sQuery := "select sra.id, sra.Project_Name, sra.SRA_Score, sra.secName, sra.PSEC, sra.SRA_Owner, sra.Project_Owner, sra.Modified, sra.ModifiedBy, sra.Created, "
	sQuery += " sra.CreatedBy, sra.SDL_Url, sra.Path, sra.Version, sra.sra_version, sra.sratoolVersion, sra.prob_score, sra.impact_score, sra.locksra, sra.sra_type,sra.ssgsra_type, "
	sQuery += " sra.xattributes, (SELECT sra_jsonriskassessment FROM sra_prod.sra_jsonriskassessment where type_info = 3 and id_of_type = " + idproject + " limit 1) as sra_jsonriskassessment, "
	sQuery += " sra.sdl_id, sra_sdl.sdl_status, threatminer, threatminer_keywords  from sra left join sra_sdl on sra.sdl_id = sra_sdl.id_project where  sra.locksra <> 1 and sra.id = " + idproject
	return getJSON(sQuery, connString)

}

func getSRAActions(riskfactorType string, versionAction string) (string, error) {

	connString := getSRAConnString()
	sQuery := "select id, sdlaction, action, ifnull(actionlink,'') as actionlink, statuslow as Low_Score, "
	sQuery += "statusmedium as Medium_Score, statushigh as High_Score, statuscritical, ifnull(comments,'') as comments, "
	sQuery += "ifnull(commentslink,'') as commentlink, sdlversion, id_riskassessment_type "
	sQuery += "FROM sra_actions where  id_riskassessment_type = " + riskfactorType + " and sdlversion = " + versionAction
	fmt.Println(sQuery)
	return getJSON(sQuery, connString)

}

func getSRARiskFactorType(riskfactorType string, versionRf string) (string, error) {

	connString := getSRAConnString()
	sQuery := "SELECT rat.name, rf.version, rf.riskfactor, gl.value_guideline, gl.score "
	sQuery += "FROM sra_riskfactor rf inner join sra_guidelines gl on rf.sucesivo = gl.id_riskfactor "
	sQuery += "inner join sra_riskassessment_type rat on rf.id_riskassessment_type = rat.id "
	sQuery += "where rf.id_riskassessment_type  = " + riskfactorType + " and rf.version = '" + versionRf + "'"
	sQuery += " and gl.id_riskassessment_type  = " + riskfactorType + " and gl.version = '" + versionRf + "'"
	fmt.Println(sQuery)
	return getJSON(sQuery, connString)

}

func getSRARiskFactorTypes() (string, error) {
	connString := getSRAConnString()
	sQuery := "select distinct rft.id, rft.name, rf.version from sra_riskassessment_type rft inner join sra_riskfactor rf on rf.id_riskassessment_type = rft.id order by rf.version desc, rft.id;"
	fmt.Println(sQuery)
	return getJSON(sQuery, connString)
}

func getDBHandle(typeDB string, connString string) *sql.DB {
	db, err := sql.Open("mysql", connString)
	if err != nil {
		fmt.Println(err.Error())
	}
	defer db.Close()
	err = db.Ping()
	if err != nil {
		fmt.Println(err.Error())
	}
	return db
}

func setSRAScoresCatalog(id float64, name string, status string) (scoreDBRecord, error) {
	connString := getSRAConnString()
	db, err := sql.Open("mysql", connString)
	if err != nil {
		fmt.Println(err.Error())
	}
	defer db.Close()
	err = db.Ping()
	if err != nil {
		fmt.Println(err.Error())
	}

	var score scoreDBRecord
	statusDb := "A"

	if id == 0 {
		scoreIns, err := db.Prepare("INSERT INTO sectool_request_score (name,status)VALUES(?,?)")
		resQuery, err := scoreIns.Exec(name, statusDb)
		if err != nil {
			log.Println(err)
		}
		lastId, err := resQuery.LastInsertId()
		if err != nil {
			log.Println(err)
		}
		defer scoreIns.Close()
		score.id = int(lastId)

	} else {
		scoreIns, err := db.Prepare("update sectool_request_score set name=?, status = ? where id=?")
		_, err = scoreIns.Exec(name, statusDb, id)
		defer scoreIns.Close()
		score.id = int(id)
		if err != nil {
			log.Fatal(err)
		}

	}
	score.name = name
	score.status = statusDb
	return score, nil
}

func setSRARequests(opType int, requestIns string) (int, error) {
	fmt.Println("model Request Create")
	connString := getSRAConnString()
	db, err := sql.Open("mysql", connString)
	if err != nil {
		fmt.Println(err.Error())
	}
	defer db.Close()
	err = db.Ping()
	if err != nil {
		fmt.Println(err.Error())
	}

	opRequest := "new_project"

	sQuery := "CALL sra_newProject(?,?,?, ?) "
	log.Println(uniId)
	var idGet int

	fmt.Println(sQuery)
	fmt.Println(opRequest)
	fmt.Println(requestIns)
	fmt.Println(opType)
	fmt.Println(uniId)

	err4 := db.QueryRow(sQuery, opRequest, requestIns, opType, uniId).Scan(&idGet)
	switch {
	case err4 == sql.ErrNoRows:
		log.Printf("Error inserting Records.")
	case err4 != nil:
		log.Fatal(err)
	default:
		fmt.Printf("ID  is %d\n", idGet)
	}
	return idGet, nil
}

func setSRAEditRequests(opType int, requestIns string) (int, error) {
	fmt.Println("model Request Update")
	connString := getSRAConnString()
	db, err := sql.Open("mysql", connString)
	if err != nil {
		fmt.Println(err.Error())
	}
	defer db.Close()
	err = db.Ping()
	if err != nil {
		fmt.Println(err.Error())
	}
	opRequest := "edit_project"
	sQuery := "CALL sra_updateProject(?,?,?,?, ?) "
	log.Println(uniId + "  =>" + sQuery )
	var idGet int
	err4 := db.QueryRow(sQuery, opRequest, requestIns, 0, opType, uniId).Scan(&idGet)
	switch {
	case err4 == sql.ErrNoRows:
		log.Printf("Error editing Record.")
	case err4 != nil:
		log.Fatal(err)
	default:
		fmt.Printf("ID  is %d\n", idGet)
	}
	return idGet, nil
}

func getMockssgsra(requestIns string) (string, error) {
	fmt.Println("Mock SSG SRA Requested")
	connString := getSRAConnString()
	sQuery := "CALL sra_mocksetScore(?) "
	return getJSONMock(sQuery, connString, requestIns)
}

func deletingSRA(postInfo string, projectId string, wwidEraser string) (string, error) {
	fmt.Println("SRA Deletion Command has ben sent for project:" + projectId)
	connString := getSRAConnString()
	sQuery := "CALL sra_deletedBySRA(?, ?) "
	var theResult string
	db, err := sql.Open("mysql", connString)

	err4 := db.QueryRow(sQuery, projectId, wwidEraser).Scan(&theResult)
	switch {
	case err4 == sql.ErrNoRows:
		log.Printf("Error deleting SRA project:" + projectId + "  by " + wwidEraser)
	case err4 != nil:
		log.Fatal(err)
	default:
		fmt.Printf("SRA Deletion   %s\n", theResult)
	}
	return theResult, nil
}

func deletingSRAByAdmin(postInfo string, projectId string, wwidEraser string) (string, error) {
	fmt.Println("SRA Deletion Command has ben sent for project:" + projectId)
	connString := getSRAConnString()
	sQuery := "CALL sra_deletedByAdmin(?, ?) "
	var theResult string
	db, err := sql.Open("mysql", connString)

	err4 := db.QueryRow(sQuery, projectId, wwidEraser).Scan(&theResult)
	switch {
	case err4 == sql.ErrNoRows:
		log.Printf("Error deleting SRA project By ADMIN:" + projectId + "  by " + wwidEraser)
	case err4 != nil:
		log.Fatal(err)
	default:
		fmt.Printf("SRA Deletion   %s\n", theResult)
	}
	return theResult, nil
}

func addAdmin(postInfo string, wwidEraser string) (string, error) {
	fmt.Println("Adding Admin by " + wwidEraser)
	connString := getSRAConnString()
	sQuery := "CALL sra_addAdmin(?,?, ?) "
	var theResult string
	db, err := sql.Open("mysql", connString)

	err4 := db.QueryRow(sQuery, "AddAdmin", postInfo, wwidEraser).Scan(&theResult)
	switch {
	case err4 == sql.ErrNoRows:
		log.Printf("Error adding ADMIN:" + wwidEraser)
	case err4 != nil:
		log.Fatal(err)
	default:
		fmt.Printf("Admin Added   %s\n", theResult)
	}
	return theResult, nil
}

func removeAdmin(postInfo string, wwidEraser string) (string, error) {

	connString := getSRAConnString()
	sQuery := "CALL sra_removeAdmin(?,?, ?) "
	var theResult string
	db, err := sql.Open("mysql", connString)

	err4 := db.QueryRow(sQuery, "RemoveAdmin", postInfo, wwidEraser).Scan(&theResult)
	switch {
	case err4 == sql.ErrNoRows:
		log.Printf("Error removing ADMIN:" + wwidEraser)
	case err4 != nil:
		log.Fatal(err)
	default:
		fmt.Printf("Admin Removed   %s\n", theResult)
	}
	return theResult, nil
}

func setSRADetRequests(opType int, requestIns string) (int, error) {
	connString := getSRAConnString()
	db, err := sql.Open("mysql", connString)
	if err != nil {
		fmt.Println(err.Error())
	}
	defer db.Close()
	err = db.Ping()
	if err != nil {
		fmt.Println(err.Error())
	}

	opRequest := "requestDetail"
	sQuery := "CALL sra_newDetailRequest(?,?,?, ?) "
	
	log.Println(uniId + " => " + sQuery + " opRequest =>" + opRequest +" requestIns =>" + requestIns + " opType=> 2" + " unitId=> " + uniId)
	var idGet int
	err4 := db.QueryRow(sQuery, opRequest, requestIns, opType, uniId).Scan(&idGet)
	switch {
	case err4 == sql.ErrNoRows:
		log.Printf("Error inserting Records.")
	case err4 != nil:
		log.Fatal(err)
	default:
		fmt.Printf("ID  is %d\n", idGet)
	}
	return idGet, nil
}

func setSRAPartialDetRequests(opType int, requestIns string) (int, error) {
	connString := getSRAConnString()
	db, err := sql.Open("mysql", connString)
	if err != nil {
		fmt.Println(err.Error())
	}
	defer db.Close()
	err = db.Ping()
	if err != nil {
		fmt.Println(err.Error())
	}

	opRequest := "requestDetail"
	sQuery := "CALL sra_partialDetailRequest(?,?,?, ?) "
	log.Println(uniId)
	var idGet int
	err4 := db.QueryRow(sQuery, opRequest, requestIns, opType, uniId).Scan(&idGet)
	switch {
	case err4 == sql.ErrNoRows:
		log.Printf("Error inserting Records.")
	case err4 != nil:
		log.Fatal(err)
	default:
		fmt.Printf("ID  is %d\n", idGet)
	}
	return idGet, nil
}

/* SDL related functions */
func getRolesBySDL(idproject string) (string, error) {
	connString := getSRAConnString()
	
    sQuery := "SELECT ssdl.id_project as Id_project, ssdl.sdl_name as Project_Name, ssdl.sdlVersionId , ssdl.sdl_status as sdlstatus,  pr.person as DisplayName, pr.wwid as ID, pr.RoleId, sr.Title, "
    sQuery += "IFNULL(sra.id,0) as sraid, ifnull(sra.locksra, 0) as sralock , ifnull(sra.sra_type, 0) as sra_type, "
    sQuery += "ifnull(sra.ssgsra_type, 0) as ssgsra_type "
    sQuery += "FROM sra_sdl ssdl "
    sQuery += "inner join projectRoles pr on ssdl.id_project = pr.ProjectId "
    sQuery += "inner join sdl_roles sr on pr.RoleId = sr.id "
    sQuery += "left join sra on ssdl.id_project = sra.sdl_id "
    sQuery += "where (sr.id= 1 or sr.id = 10 or sr.id=16 or sr.id=2 or sr.id = 3) "
    sQuery += "and ssdl.id_project=" + idproject + "; "

	fmt.Println(sQuery)
	return getJSON(sQuery, connString)
}



func getUserInfoByID(empId string) (string, error) {
	connString := getSRAConnString()
	
    sQuery := "SELECT email as DomainAddress, name as FirstName, wwid as WWID, email as ccMailName, idsid as upperIDSID  "
    sQuery += " FROM sra_prod.sra_users "
    sQuery += "where WWID=" + empId + "; "

	fmt.Println(sQuery)
	return getJSON(sQuery, connString)
}

  