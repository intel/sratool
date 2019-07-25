package main

import "net/http"

type Route struct {
	Name         string
	Method       string
	Path         string
	FunctionName http.HandlerFunc
}

type Routes []Route

var routes = Routes{
	
	Route{
		"Projects",
		"GET",
		"/sra/projects",
		sraProjects,
	},
	Route{
		"Role",
		"GET",
		"/sra/getrole",
		sraRole,
	},

	Route{
		"Projects",
		"GET",
		"/sra/projectinfo/{prjId}",
		sraProjectsWithId,
	},
	Route{
		"PSEC_Summary",
		"GET",
		"/sra/psecsummary/{psecId}",
		sraPSECSummary,
	},
	
	Route{
		"SRA_SummaryByStatus",
		"GET",
		"/sra/summarybystatus",
		sraSummarybystatus,
	},

	Route{
		"SDL_SummaryByStatus",
		"GET",
		"/sdl/summarybystatus",
		sdlSummarybystatus,
	},
	Route{
		"SDL_SummaryByBU",
		"GET",
		"/sdl/summarybybu",
		sdlSummarybyBU,
	},
	Route{
		"Index",
		"GET",
		"/",
		Index,
	},
	Route{
		"SRA_projectdetails",
		"GET",
		"/sra/project/{prjId}",
		sraProjectdetails,
	},
	Route{
		"SRA_partialreqdetails",
		"GET",
		"/sra/request/{prjId}",
		sraPartialreqdetails,
	},
	Route{
		"SRA_ctScores",
		"GET",
		"/sra/scores",
		sraScorescatalog,
	},
	Route{
		"SRA_ctRiskFactor",
		"GET",
		"/sra/riskfactor/{riskId}",
		sraRiskfactorguides,
	},
	Route{
		"SRA_ctRiskFactorGuidelines",
		"GET",
		"/sra/riskfactorguides/{riskId}",
		sraRiskfactorguidesscore,
	},
	Route{
		"SRA_ctActions",
		"GET",
		"/sra/actions/{riskId}/{versionId}",
		sraActionscatalog,
	},
	Route{
		"SRA_ctRiskFactorTypes",
		"GET",
		"/sra/riskfactortypes",
		sraRiskfactortypes,
	},
	Route{
		"SRA_RiskfactorType",
		"GET",
		"/sra/riskfactortype/{riskId}/{versionId}",
		sraRiskfactortype,
	},

	Route{
		"SDL_StatusReport",
		"GET",
		"/sra/sdlstatus",
		sdlStatusReport,
	},

	Route{
		"scoresCtCreate",
		"POST",
		"/sra/scoresins",
		sraScorescreate,
	},
	Route{
		"mockssgsra",
		"POST",
		"/sra/mockssgsra",
		sraMockssgsra,
	},
	Route{
		"delete_sra",
		"POST",
		"/sra/inactivesra/{projectId}/{wwidBy}",
		sraInactiveSra,
	},
	Route{
		"delete_srabyadmin",
		"POST",
		"/sra/deletebyadmin/{projectId}",
		sradeleteSrabyAdmin,
	},
	Route{
		"reqDetailsCreate",
		"POST",
		"/sra/reqdetins",
		sraReqdetcreated,
	},
	Route{
		"reqPartialDetailsCreate",
		"POST",
		"/sra/partialreqdetins",
		sraPartialreqdetcreated,
	},
	Route{
		"requestCtCreate",
		"POST",
		"/sra/requestsins",
		sraRequestscreate,
	},
	Route{
		"requestEdit",
		"POST",
		"/sra/editrequestsins",
		sraRequestsedit,
	},
	Route{
		"addAdmin",
		"POST",
		"/sra/addadmin",
		sraAddAdmin,
	},
	Route{
		"removeAdmin",
		"POST",
		"/sra/removeadmin",
		sraRemoveAdmin,
	},

	/* For SRA Owner and Project Owner*/
	Route{
		"getrolesbySDL",
		"GET",
		"/sra/getrolesbysdl/{prjId}",
		sraRolesBySDL,
	},

	Route{
		"getUserInfo",
		"GET",
		"/sra/getuserinfo/{empId}",
		sraUserInfo,
	},

}
