package main

type wl_projectST struct {
	id              string `json:"IdProject"`
	project_name    string `json:"Component_Name"`
	review_type     string `json:"Review_Type "`
	status          string `json:"STATUS,omitempty"`
	usage_risk      string `json:"Usage_Risk"`
	expiration_date string `json:"EXPIRATION_DATE"`
	reviewer        string `json:"Reviewer"`
	reqid           string `json:"ReqId"`
	source_url      string `json:"Source_url"`
	main_url        string `json:"Main_url"`
}

// main_url        string    `json:"Main_url,omitempty"`
type projects []wl_projectST

type wl_projectlST struct {
	project_name string `json:"Component_Name"`
	status       string `json:"STATUS"`
}

// main_url        string    `json:"Main_url,omitempty"`
type Projectsl []wl_projectlST

type scoreDBRecord struct {
	name   string `json:"name"`
	status string `json:"status"`
	id     int    `json:"id"`
}

type requestDBRecord struct {
	projectDBRecord
	sra_ownerwwid     string  `json:"SRA_Owner"`
	project_ownerwwid string  `json:"Project_Owner"`
	sdl_link          string  `json:"SDL_Link"`
	sra_type          float64 `json:"sra_type"`
	sra_version       string  `json:SRA_Version"`
	id                float64 `json:"id"`
}

type projectDBRecord struct {
	project_name string  `json:"Project_Name"`
	version      string  `json:"Version"`
	id           float64 `json:"id"`
}
