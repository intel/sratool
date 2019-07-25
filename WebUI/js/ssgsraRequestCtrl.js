

app.controller('ssgsrarequestCtrl', ssgsrarequestCtrl);

function ssgsrarequestCtrl( constantSecTool, $http, $q, $location, $scope, $routeParams, idService, getSRAtypes, getSRARole, getrequestToEdit, getdetailFromID, getRolesbySdl, $window) {
    
	    var urlApi = "";
	    var urlGetIDUrl = constantSecTool.sra_apiURL + "/getuserinfo/"; // constantSecTool.openSSSOUrlUserInfo;
	    var urlApi = "";
	    var urlApiPost = "";
	    if ($location.$$path.includes("/wl")) {
	        urlApi = constantSecTool.wl_apiURL + 'statuses';
	    }
	    else {
	        urlApi = constantSecTool.sra_apiURL + 'requests';
	        urlApiPost = constantSecTool.sra_apiURL + 'requestsins';
	        
	    }
	    $scope.psecya = 0;
	    $scope.sratype = $routeParams.sraid;
	    idService.set("sraType", parseInt($scope.sratype));
        /* TODO Finish mechanism around roles - Implementer task - */
	  /*  getSRARole.async().then(function (data) {
	        idService.set("srarole", setsrarole = data[0].role_access);
	        $scope.srarole = idService.get("srarole")

	    }).catch(function () {
	        idService.set("sraroleerror", setsraroleerror = 'unable to get sra role Details');

	    });*/
	          
	    // The form : behavior and fields
	    var projectInfo = this;

	    projectInfo.srainfo = {
	        threatminer: false
	    };
	    //projectInfo.srainfo = {project_name : "inicia"};
	    projectInfo.sraownerinfo = "";
	    projectInfo.projectownerinfo = {};
	    $scope.ownerinfo = {};
	    $scope.submitWhenFormReady = false;
	    //projectInfo.srainfo = { sdl_url: '' };
        /* request info pulled from DB */
	    $scope.attrefective = { values: [] };

	    getThisReq();
	    function getThisReq(){
	        getrequestToEdit.async().then(function (data) {
	            $scope.partialrequest = data;
	            if ($scope.partialrequest[0] != null) {
	                if ($scope.partialrequest[0].id != null && parseInt($scope.partialrequest[0].id) > 0) {
	                    var idproject = parseInt($scope.partialrequest[0].id);

	                    idService.set("projectId", idproject);
	                    idService.set("sraType", parseInt($scope.partialrequest[0].sra_type));
	                    idService.set("json_riskassessment", $scope.partialrequest[0].sra_jsonriskassessment);
	                    projectInfo.srainfo = { id: idproject, sdl_status: $scope.partialrequest[0].sdl_status, ssg_psec: parseInt($scope.partialrequest[0].ssgsra_type), project_name: $scope.partialrequest[0].Project_Name.replace(/"/g, ''), sdl_url: parseInt($scope.partialrequest[0].sdl_id.replace(/"/g, '')), sra_owner: ($scope.partialrequest[0].SRA_Owner != null ? $scope.partialrequest[0].SRA_Owner.replace(/"/g, '') : ''), project_owner: $scope.partialrequest[0].Project_Owner.replace(/"/g, ''), owner_details: populateFromID($scope.partialrequest[0].Project_Owner.replace(/"/g, ''), 1), sraowner_details: (($scope.partialrequest[0].SRA_Owner != null ? populateFromID($scope.partialrequest[0].SRA_Owner.replace(/"/g, ''), 0) : '')), threatminer: ($scope.partialrequest[0].threatminer =="0" ? false : true), listdeps:($scope.partialrequest[0].threatminer_keywords != null ? $scope.partialrequest[0].threatminer_keywords:'') };
	                    $scope.attrefective = { values: [] };
	                    for (ij = 0; ij < data[0].xattributes.replace("[", "").replace("]", "").split(",").length; ij++) {
	                        $scope.attrefective.values.push(parseInt((data[0].xattributes.replace("[", "").replace("]", "").split(","))[ij]));
	                    }
	                    $scope.isediting = true;
	                    urlApiPost = constantSecTool.sra_apiURL + 'editrequestsins';
	                    $scope.tabs.activeTab = 1;

	                }
	            }

	        }).catch(function () {
	            $scope.error = 'unable to get the Project Details';
	        });

	    

	    }
        
    // formly-form http://docs.angular-formly.com/
        
	    projectInfo.srainfoFields = [
            {
                key: 'id',
                type: 'input',
                hide : true,
                templateOptions: {
                    type: 'number',
                    label: 'Project ID',                    
                }
            },
            {
                key: 'reqid',
                type: 'input',
                hide: true,
                templateOptions: {
                    type: 'number',
                    label: 'Request ID',
                }
            },
            {
                key: 'sratype',
                type: 'input',
                
                hide: true,
                templateOptions: {
                    type: 'number',
                    label: 'Project Name',
                    placeholder: 'Project name',

                }
            },
            {
                key: 'sraownerName',
                type: 'input',
                hide: true               
            },
            {
                key: 'sraownerEmail',
                type: 'input',
                hide: true
            },
            {
                key: 'sraownerIDSID',
                type: 'input',
                hide: true
            },
            {
                key: 'projectownerName',
                type: 'input',
                hide: true
            },
            {
                key: 'projectownerEmail',
                type: 'input',
                hide: true
            },
            {
                key: 'projectownerIDSID',
                type: 'input',
                hide: true
            },
            {
                key: 'sdl_url',
                type: 'input',

                templateOptions: {
               
                    label: 'SDL ID for the Project (Optional)',
                    placeholder: '####',
                    required: true
                },
                validators: {
                    versionNumber: function ($viewValue, $modelValue, scope, $scope) {
                        var value = $viewValue;
                        if (value) {
                            return validateSDLID(value,scope,0,$scope)
                        }
                    }
                },

            },
            {
                key: 'sdl_status',
                type: 'input',
                className: 'ssgsranotedit',
                ngModelAttrs: {
                    txtReadonly: {
                        bound: 'ng-readonly',
                        attribute: 'ng-readonly'
                    }
                },
                data: {

                },
                templateOptions: {
                    type: 'text',
                    txtReadonly: true,
                    label: 'SDL Status',
                    placeholder: 'SDL Status',
                    required: false
                }
            },
            {
                key: 'project_name',
                type: 'input',
                className: 'ssgsranotedit',
                
                data: {

                },
                templateOptions: {
                    type: 'text',
                    txtReadonly: true,
                    label: 'Project Name',
                    placeholder: 'Project name',
                    required: true
                }
            },
            
            {
                key: 'pr_version',
                type: 'input',
                hide: true,
                templateOptions: {

                    label: 'Project Version Number',
                    placeholder: 'Project Version',
                    
                     
                },
              /*  validators: {
                    versionNumber: function ($viewValue, $modelValue, scope) {
                        var value = $viewValue;
                        if (value) {
                            return validateVersions(value)
                        }
                    }
                },*/
            },

           
            {
                key: 'sra_owner',
                type: 'input',
                templateOptions: {
                    type: 'text',
                    label: 'SRA Owner (ID - Optional) ',
                    placeholder: 'SRA Owner Info',
                    required: true
                },
                validators: {
                    idNumber: function ($viewValue, $modelValue, scope, $scope) {
                        var value = $viewValue;
                        if (value) {

                            return validateID(value, scope, 0, $scope)
                        }
                    }
                },
            },            
            {
                key: 'project_owner',
                type: 'input',
                className: 'ssgsranotedit',
                ngModelAttrs: {
                    txtReadonly: {
                        bound: 'ng-readonly',
                        attribute: 'ng-readonly'
                    }
                },
                templateOptions: {
                    type: 'text',
                    txtReadonly: false,
                    label: 'Project Owner (ID)',
                    placeholder: 'Project Owner Info',
                    required: true
                },
                validators: {
                    versionNumber: function ($viewValue, $modelValue, scope, $scope) {
                       
                        var value = $viewValue;
                        if (value) {
                            return validateID(value, scope, 1, $scope)
                        }

                    }
                },
            },
           

            {
                key: 'sraowner_details',
                type: 'textarea',
                className: 'ownerdetailstyle',
                ngModelAttrs: {
                    txtReadonly: {
                        bound: 'ng-readonly',
                        attribute: 'ng-readonly'
                    }
                },
                templateOptions: {
                    txtReadonly: true,
                    label: '¤ SRA Owner General Information',
                },
                // Hide this field if we don't have
                // any valid input in the email field
                hideExpression: 'model.sra_owner.length != 8',
            },
            {
                key: 'owner_details',
                type: 'textarea',
                className: 'ownerdetailstyle',
                ngModelAttrs: {
                    txtReadonly: {
                        bound: 'ng-readonly',
                        attribute: 'ng-readonly'
                    }
                },
                templateOptions: {
                    txtReadonly: true,
                    label: '¤ Project Owner General Information',
                },
                // Hide this field if we don't have
                // any valid input in the email field
                hideExpression: 'model.project_owner.length != 8',
            },
                      
	    ];

	    projectInfo.originalFields = angular.copy(projectInfo.fields);

	    
	   

      
    
	    //$scope.srainfo.
	    function validateSkips(value) {
	        return /[A-Za-z]\d{4}[\s|\-]*\d{5}[\s|\-]*\d{5}$/.test(value);
	    }

	    function validateVersions(value) {
	        var isValid = /^(?:[\dx]{1,3}\.){0,3}[\dx]{1,3}$/.test(value);
	        
	        return isValid;
	    }

	    function validateSDLID(value, scope, ownerswitch) {
	        var isValid = /^\d+([0-9]{2,3}$)/.test(value);
	        scope.model.sdl_status = "";
	        $scope.attrefective = { values: [] };
	        if (isValid && value.length > 3) {
	            	           
	            idService.set("sdl_idParam", value);

	            getRolesbySdl.async().then(function (data) {
	            
	                
	                if (data.length > 0) {
	                    if (data[0].sra_type == 0) {
	                       	                         
	                        scope.model.project_owner = data[0].ID;
	                        validateID(data[0].ID, scope, 1, $scope)
	                        scope.model.project_owner = data[0].ID;
	                        scope.model.sra_owner = "";
	                        scope.model.sdl_status = "";
	                        scope.model.ssg_psec = -1;
	                      
	                        idService.set("projectOwnerID", data[0].ID);
	                        scope.model.pr_version = "0";
	                        scope.model.sdl_status = data[0].sdlStatus;
	                        scope.model.project_owner = data[0].ID;
	                        scope.model.project_name = data[0].Project_Name;
	                        
	                        scope.model.sratype = idService.get("sraType");
	                        /* Pulling Score Options */
	                        getdetailFromID.async().then(function (data2) {
	                            scope.model.owner_details = "Name: " + data2.FirstName + "                           Email: " + data2.DomainAddress + "                  IDSID: " + data2.upperIDSID + "                           Building: " + data.RegionCode + "                      Site: " + data.SiteCode;
	                            scope.model.projectownerName = data2.FirstName;
	                            scope.model.projectownerEmail = data2.DomainAddress;
	                            scope.model.projectownerIDSID = data2.upperIDSID;	                            
	                        }).catch(function () {
	                            $scope.error = 'unable to get the User Details for ID: ' + data[0].ID;
	                        });
	                    }
	                    else {
	                        if (data[0].sra_type > 0) { // Pull info from existing project
	                            $scope.sratype = data[0].sra_type;
	                            try{
	                                var t = data[0].sralock ;
	                                if(t != null && t === "1") {
	                                    
	                                    // bring projectDetails page for closed projects
	                                    var newurl = constantSecTool.protocolUsed +  "://" + window.location["host"] + "/sra/projectdetail/" + data[0].sraid;
	                                    $window.open(newurl, "_self");
	                                }
	                                else
	                                {
	                                    idService.set("projectIdAlt", data[0].sraid);
	                                    var newurl = constantSecTool.protocolUsed +"://" + window.location["host"] + "/sra/ssgsra/" + data[0].sra_type +"/"+data[0].sraid;
	                                    $window.open(newurl, "_self");
	                                    //pull as if pulling from search engine
	                                   // idService.set("projectIdAlt", data[0].sraid);
	                                  //  getThisReq();
	                                    
	                                }
	                            } catch (err) {
	                                err.message;
	                            }

	                        }
	                        else {
                                //The project is not of type ssg_sra pul as if pulling from search engine

	                        }
	                    }
                            
	                }
	                else
	                {
	                    scope.model.project_owner = "";
	                    scope.model.project_name = "";
	                }

	            }).catch(function () {
	                $scope.error = 'error retrieving SDL info';
	            });
               
	        }
	        else
	        {
	            scope.model.sdl_status = "";
	            scope.model.project_owner = "";
	            scope.model.project_name = "";
	        }
	        return isValid; //Pulling info if it exists  otherwise leave it blank
	    }
       
	    function validateID(value, scope, ownerswitch, $scope) {
	        var isValid = /^[0-9]{8,8}$/.test(value);
	       
	        if (isValid) {

	            $http.get(urlGetIDUrl + value).success(function (data) {
	                if (ownerswitch == 1) {
	                    scope.model.owner_details = "Name: " + data[0].FirstName + "                           Email: " + data[0].DomainAddress + "         IDSID: " + data[0].upperIDSID;
	                    scope.model.projectownerName = data[0].FirstName;
	                    scope.model.projectownerEmail = data[0].DomainAddress;
	                    scope.model.projectownerIDSID = data[0].upperIDSID;
	         
	                }
	                else {
	                    scope.model.sraowner_details = "Name: " + data[0].FirstName + "                           Email: " + data[0].DomainAddress + "         IDSID: " + data[0].upperIDSID;
	                    scope.model.sraownerName = data[0].FirstName;
	                    scope.model.sraownerEmail = data[0].DomainAddress;
	                    scope.model.sraownerIDSID = data[0].upperIDSID;
	                    scope.model.id = 0;
	                    scope.model.reqid = 0;
	                    scope.model.sratype = idService.get("sraType");
	                }

	            })
                .error(function (data, status) {
                    if (ownerswitch == 1) {
                        scope.model.owner_details = "Error getting ID details"             
                    }
                    else {
                        scope.model.sraowner_details = "Error getting ID details"
                    }
                    console.error('error ', status, data);
                })
                .finally(function () {
                    console.log("finally executed for  validateID");
                });

	        }
	        return  isValid;
	    }

 
	    function validatePsec($scope) {
	        return false;
	    }


	    function populateFromID(value, switchowner) {
	        var isValid = /^[0-9]{8,8}$/.test(value);
	        var owner = "o";
	        if (isValid) {


	            $http.get(urlGetIDUrl + value).then(function (response) {
	                var data = response.data,
                        status = response.status,
                        header = response.header,
                        config = response.config;
	                owner = "Name: " + data.FirstName + "                           Email: " + data.DomainAddress + "         IDSID: " + data.upperIDSID;
	                if (switchowner == 0) {
	                    projectInfo.srainfo.sraowner_details = owner;
	                    projectInfo.srainfo.sraownerName = data.FirstName;
	                    projectInfo.srainfo.sraownerEmail = data.DomainAddress;
	                    projectInfo.srainfo.sraownerIDSID = data.upperIDSID;
	                }
	                else {
	                    projectInfo.srainfo.owner_details = owner
	                    projectInfo.srainfo.projectownerName = data.FirstName;
	                    projectInfo.srainfo.projectownerEmail = data.DomainAddress;
	                    projectInfo.srainfo.projectownerIDSID = data.upperIDSID;
	                }
	                // success handler
	            }, function (response) {
	                var data = response.data,
                        status = response.status,
                        header = response.header,
                        config = response.config;
	                console.log(status);
	                // error handler
	            });



	        }

	    }
	     
	    projectInfo.onSubmit = onSubmit;
	    projectInfo.deleteNone = deleteNone;

	    function onSubmit() {
	        angular.extend(projectInfo.srainfo, { attributes: $scope.attrefective.values });
	        //angular.extend(projectInfo.srainfo, projectInfo.projectownerinfo);
	        //angular.extend(projectInfo.srainfo, projectInfo.sraownerinfo);
	        //console.log(JSON.stringify(projectInfo.srainfo));
	        $http.post(urlApiPost, JSON.stringify(projectInfo.srainfo)).then(function (response) {
	            //First function handles success
	            if (response.status == 201) {
	                var theId2 = response.data;
	                var theId = parseInt(theId2.replace("↵", ""));
	                $scope.tab2.disabled = false;
	                $scope.tabs.activeTab = 1;
	                
	                $scope.submitWhenFormReady = true;
	                idService.set("projectId", theId);
	              //  idService.set("projectId", theId.replace(/^\s+|\s+$/g, ''));
	            }
	            
	        }, function (response) {
	            //Second function handles error
	            $scope.httperror = response.status;
	        });
	       
	        return ;
	    }

	    function deleteNone()
	    {
	        // Aug 2017
	        //TODO:  Create Delete routine validating role in auth header
	         	       
	        $http.post(constantSecTool.sra_apiURL + "deletebyadmin/" + idService.get("projectId"), "{}").then(function (response) {
	            //First function handles success
	            if (response.status == 200) {

	                var newurl = constantSecTool.protocolUsed +"://" + window.location["host"] + "/sra/searchengine";
	                $window.open(newurl, "_self")

	                //  idService.set("projectId", theId.replace(/^\s+|\s+$/g, ''));
	            }

	        }, function (response) {
	            //Second function handles error
	            $scope.httperror = response.status;
	        });	        	    
	    }

	}

app.controller('ssgsraVerticalTabsCtrl', ssgsraVerticalTabsCtrl);

function ssgsraVerticalTabsCtrl($scope, getRiskFactor, getRiskFactorGuidelines, idService, $location, constantSecTool, $http, $window, getrequestToEdit) {
    //  $scope.validate_srascoreVal = false;
    var requestInfo = this;
    requestInfo.srarequestinfo = {};
    requestInfo.idValueGuides = {};
    var urlApiPost = "";
    var urlApiPartialPost = "";
    if ($location.$$path.includes("/wl")) {
        urlApi = constantSecTool.wl_apiURL + 'statuses';
    }
    else {
        urlApi = constantSecTool.sra_apiURL + 'requests';
        urlApiPost = constantSecTool.sra_apiURL + 'reqdetins';
        urlApiPartialPost = constantSecTool.sra_apiURL + 'partialreqdetins';
    }



    $scope.istheriskfactor = function (scoreguideperRisk, scope) {
        var id = 0;

        if (typeof $scope.SelTIndex == null) {
            id = 0;
        }
        else {
            id = $scope.SelTIndex;
        }


        return (scoreguideperRisk.id_riskfactor == (id + 1));
    };

    $scope.getidValueGuide = function (scoreguideperRisk) {
        requestInfo.srarequestinfo.idValueGuide[scoreguideperRisk.$index] = scoreguideperRisk.score;
    };

    GetReqToEdit();

    function GetReqToEdit() {
        getrequestToEdit.async().then(function (data) {
            $scope.partialrequest = data;
            if ($scope.partialrequest[0] != null) {
                if ($scope.partialrequest[0].id != null && parseInt($scope.partialrequest[0].id) > 0) {
                    var idproject = parseInt($scope.partialrequest[0].id);

                    idService.set("projectId", idproject);
                    idService.set("json_riskassessment", $scope.partialrequest[0].sra_jsonriskassessment);
                    idService.set("sraType", parseInt($scope.partialrequest[0].sra_type));
                    $scope.tab2.disabled = false;
                }
            }

            getRiskFactor.async().then(function (data) {
                //$scope.riskfactor.length = 0;
                $scope.riskfactor = data;


                $scope.switchTTab = function ($index) {
                    console.log($index);
                    $scope.SelTIndex = $index;


                }
                $scope.getTClass = function (an_index) {

                    if (typeof $scope.SelTIndex == 'undefined') {
                        $scope.SelTIndex = 0;
                    }

                    if (an_index == $scope.SelTIndex) {
                        $scope.hideDiv = false;
                        $scope.showDiv = true;
                        return 'tableTab';
                    }
                    else {
                        $scope.hideDiv = true;
                        $scope.showDiv = false;
                        return 'tableTabless'
                    }

                }


                /* Pulling Score Options */
                getRiskFactorGuidelines.async().then(function (data) {
                    $scope.scoreguide = data;
                    if ($scope.partialrequest[0] != null) {
                        if ($scope.partialrequest[0].sra_jsonriskassessment != null) {
                            var jj = 1;
                            for (kk = 0; kk < $scope.scoreguide.length ; kk++) {
                                try {

                                    if ($scope.scoreguide[kk].id_riskfactor == jj) {
                                        try {
                                            if (angular.fromJson($scope.partialrequest[0].sra_jsonriskassessment).idValueGuide[jj - 1] != null) {
                                                if ($scope.scoreguide[kk].score == angular.fromJson($scope.partialrequest[0].sra_jsonriskassessment).idValueGuide[jj - 1]) {
                                                    requestInfo.idValueGuides[jj - 1] = $scope.scoreguide[kk];
                                                }

                                            }
                                        }
                                        catch (err) {
                                            console.log(err.message);
                                        };

                                    }

                                    else {
                                        try {
                                            if (requestInfo.srarequestinfo.reasoning == null) { requestInfo.srarequestinfo.reasoning = {} }
                                            if (requestInfo.srarequestinfo.recommendations == null) { requestInfo.srarequestinfo.recommendations = {} }
                                            if (angular.fromJson($scope.partialrequest[0].sra_jsonriskassessment).reasoning[jj - 1] != null) {
                                                requestInfo.srarequestinfo.reasoning[jj - 1] = angular.fromJson($scope.partialrequest[0].sra_jsonriskassessment).reasoning[jj - 1];
                                            }
                                            if (angular.fromJson($scope.partialrequest[0].sra_jsonriskassessment).recommendations[jj - 1] != null) {
                                                requestInfo.srarequestinfo.recommendations[jj - 1] = angular.fromJson($scope.partialrequest[0].sra_jsonriskassessment).recommendations[jj - 1];
                                            }

                                        }
                                        catch (err) {
                                            console.log(err.message);
                                        };
                                        jj++;
                                        kk--;
                                    }
                                }
                                catch (err) {
                                    console.log(err.message);
                                };
                            }
                        }
                    }

                }).catch(function () {
                    $scope.error = 'unable to get the Project Details';
                });
                /* End Pulling Score Options */

            }).catch(function () {
                $scope.error = 'unable to get the Project Details';
            });


        }).catch(function () {
            $scope.error = 'unable to get the Project Details';
        });
    }

    requestInfo.onSubmit = onSubmit;
    requestInfo.savePartial = savePartial;


    function redirect(urlNew) {
        $window.open(urlNew, "_self")
    }


    function onSubmit() {
        i = 0;
        var idValueGuide1 = {};
        while (requestInfo.idValueGuides[i] != null) {
            //var str = '"' + requestInfo.idValueGuides[i].score + '"';
            idValueGuide1[i] = requestInfo.idValueGuides[i].score;
            i = i + 1;
        }
        angular.extend(requestInfo.srarequestinfo, { idValueGuide: idValueGuide1 });

        console.log(idService.get("projectId"));



        angular.extend(requestInfo.srarequestinfo, { projectid: parseInt(idService.get("projectId")) });
        //.substring(1, (idService.get("projectId")).length - 3)
        angular.extend(requestInfo.srarequestinfo, { requestid: 0 });
        console.log(JSON.stringify(requestInfo.srarequestinfo));


        $http.post(urlApiPost, JSON.stringify(requestInfo.srarequestinfo)).then(function (response) {
            //First function handles success
            if (response.status == 201) {
                var theId = JSON.stringify(response.data);
                // Aki enviar a consulta
                var newurl = constantSecTool.protocolUsed + "://" + window.location["host"] + "/sra/projectdetail/" + (idService.get("projectId"));
                redirect(newurl);

                //  idService.set("projectId", theId.replace(/^\s+|\s+$/g, ''));
            }
        }, function (response) {
            //Second function handles error
            $scope.httperror = response.status;
        });

        return;
    }

    function savePartial() {

        var idValueGuide1 = {};
        for (kkk = 0; kkk < 25; kkk++) {
            if (requestInfo.idValueGuides[kkk] != null) {
                idValueGuide1[kkk] = requestInfo.idValueGuides[kkk].score;
            }
        }
        angular.extend(requestInfo.srarequestinfo, { idValueGuide: idValueGuide1 });
        console.log(idService.get("projectId"));
        angular.extend(requestInfo.srarequestinfo, { projectid: parseInt(idService.get("projectId")) });
        //.substring(1, (idService.get("projectId")).length - 3)
        angular.extend(requestInfo.srarequestinfo, { requestid: 0 });
        console.log(JSON.stringify(requestInfo.srarequestinfo));

        $http.post(urlApiPartialPost, JSON.stringify(requestInfo.srarequestinfo)).then(function (response) {
            //First function handles success
            if (response.status == 201) {
                var theId = JSON.stringify(response.data);
                console.log(theId);
            }

        }, function (response) {
            //Second function handles error
            $scope.httperror = response.status;
        });

        return;
    }
};

 