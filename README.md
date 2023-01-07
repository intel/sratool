DISCONTINUATION OF PROJECT

This project will no longer be maintained by Intel.

Intel has ceased development and contributions including, but not limited to, maintenance, bug fixes, new releases, or updates, to this project.  

Intel no longer accepts patches to this project.

If you have an ongoing need to use this project, are interested in independently developing it, or would like to maintain patches for the open source software community, please create your own fork of this project.  

Contact: webadmin@linux.intel.com
# SRA Tool - Software Security Risk Assessment Tool  - <b>Version 1.0.0</b>

The Security  Risk Assessment Tool provides  a structured, repeatable method 
for evaluating the potential security risk on a Software Project and recommends appropriate security activities.
Risk Rating Methodology can be customized - Questionaires and Multiple Opption Answers with specific Wieghts and Scores -
<br/>The Default SRA Method used is the OWASP Risk Rating Methodology

## License
  SRA Tool is distributed under the <a href="https://gitlab.devtools.intel.com/rmundome/sratool/blob/master/LICENSE">MIT License.</a>


### The Project has two main components:<br/> 
 - SRA API Service
 - SRA Web UI
    
## To Install and used :
***Implementation can be done on Windows/Linux platforms

### For SRA Tool - API Service 

  <b>a) Install Prerequisites</b><br/>
    - Golang ( Service - Backend is written in this language )<br/>
    - MySQL Server <br/>
    - Go MySQL Drivers<br/><br/>
The file sra.config.json contains the initial configuration to connect to the Database<br/>
the file Main.go contains sets the API listener to 127.0.0.1 (localhost)<br/><br/>
The API structure and flow can be follow checking : main.go - > routes.go -> handlers.go -> sra_models.go<br/>

<b>b) go get (to install the Go dependencies)</b><br/>
<b>c) go build (To build the executable that serves the API</b><br/>
<b>d) run the executable </b><br/>
<b>e) Test http(s)://127.0.0.1:7089/sra/projects (Port and Address modifiable on file main.go)</b><br/>

### For SRA Tool - Web UI
  <b>a) Install Prerequisites</b><br/>
    - Angular (Web App uses Angular 1.2 )<br/> 
    - Angular-formly-templates-ionic (see WebUI/js/formly/*.txt)<br/>    
    - Angular Datatables and Datables  (see WebUI/js/angularDatatables/*.txt and WebUI/js/Datatables/*.txt)<br/> 
    - Angular Loading Bar (see WebUI/js/loadingbar/*.txt)<br/>
    - Angular-nvd3 (see WebUI/js/angular-nvd3/*.txt) <br/>
    
    b) Set the WebServer of your preference (e.g. IIS on Windows or Apache on Linux) and create a new Website.
    c) Point the Newly created website to the SRA Tool - Web UI directory and set index.html as the initial document
    d) Test  http(s)://127.0.0.1/sra



### Security considerations
The SRA Tool was written with a particular deployment scenario in mind: single server/VM hosting and running on an internal LAN (e.g. a corporate network not exposed to the public internet). 
Also, no identity management, user authentication, or role-based access controls have yet been implemented for the applications.
It is suggested that Webservers hosting the tool implement TLS and Authentication and Authorization mechanisms (security standards - To be leveraged by system administrators/implementators ) 



## Security Issues
Security issues with the tool itself can be reported to Intel's security incident response team via https://intel.com/security.

 
For More information or how to use it see (WIP)

