

app.controller('mockssgsraVerticalTabsCtrl', mockssgsraVerticalTabsCtrl);

function mockssgsraVerticalTabsCtrl($scope, getRiskFactor, identity, getSDLActionsMock, getRiskFactorGuidelines, idService, $location, constantSecTool, $http, $window, cfpLoadingBar) {
    
    var requestInfo = this;
    requestInfo.srarequestinfo = {};
    requestInfo.idValueGuides = {};
    requestInfo.attrefective = {};
    var urlApiPost = "";
    $scope.actionsinaction = 0;
    var urlApiPartialPost = "";
    if ($location.$$path.includes("/wl")) {
        urlApi = constantSecTool.wl_apiURL + 'statuses';
    }
    else {
        urlApi = constantSecTool.sra_apiURL + 'requests';
        urlApiPost = constantSecTool.sra_apiURL + 'mockssgsra';
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
    BringRiskFactor();
    function BringRiskFactor() {
        idService.set("sraType", 7);
        getRiskFactor.async().then(function (data) {
            $scope.riskfactor = data;
            $scope.switchTTab = function ($index) {
               // console.log($index);
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

            }).catch(function () {
                $scope.error = 'unable to get the Project Details';
            });
            /* End Pulling Score Options */

        }).catch(function () {
            $scope.error = 'unable to get the Project Details';
        });
    }

    /*****  Attributes section  ******/
    
    $scope.attributes = [
       { "name": "Is this a Hosted Service?", "value": 1 },
       { "name": "Are you developing using C/C++?", "value": 2 },
       { "name": "Are you releasing source code only?", "value": 3 },
       { "name": "Are you pursuing external certification(s) for the product / service?", "value": 4 },
       { "name": "Does the product / service expose APIs / Interfaces?", "value": 5 },
       { "name": "Does the product / service have a SAFE approved patching mechanism?", "value": 6 }
    ];

    $scope.ssgsras = [
       { name: "Open Source PSEC", valor: 1 },
       { name: "HW/SW Co-design PSEC", valor: 2 },
       { name: "Libraries and Tools PSEC", valor: 3 },
       { name: "Low-level/Systems PSEC", valor: 4 },
       { name: "Security and Privacy Central (SPC)", valor: 5 },
       { name: "Web-Services-Apps PSEC", valor: 6 }
       
    ];

    requestInfo.onNext = onNext;

    function onNext() {

        idService.set("projectId", "1000000");
        idService.set("attributes", requestInfo.attrefective.values);
        angular.extend(requestInfo.srarequestinfo, { attributes: requestInfo.attrefective.values });
       // console.log(JSON.stringify(idService.get("attributes")));
        idService.set("selectedssgsra", requestInfo.selectedssgsra);
        // angular.extend(requestInfo.srarequestinfo, { attributes: idService.get("attributes") });
        $scope.tab2.disabled = false;
        $scope.tabs.activeTab = 1;

    }
    /*********************************/
    $scope.getActionsClass = function () {

     //TODO

    }


    requestInfo.onSubmit = onSubmit;
   

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
               
        angular.extend(requestInfo.srarequestinfo, { projectid: parseInt((idService.get("projectId")).substring(1, (idService.get("projectId")).length - 3)) });
        angular.extend(requestInfo.srarequestinfo, { requestid: 0 });
        angular.extend(requestInfo.srarequestinfo, { attributes: idService.get("attributes") });
        angular.extend(requestInfo.srarequestinfo, { sra_type: 7 });
        angular.extend(requestInfo.srarequestinfo, { ssg_psec: parseInt(idService.get("selectedssgsra")) });
        requestInfo.PSEC = $scope.ssgsras[parseInt(idService.get("selectedssgsra"))-1].name
        $scope.token = identity.GetInfoFromJWT();
        angular.extend(requestInfo.srarequestinfo, { createdby: $scope.token.wwid });
       
      //  "ssg_pseg":3, "sra_type":7, "createdby":"11375197"}');
        $scope.tab5.disabled = false;
        $scope.tabs.activeTab = 2;
        //http://rmundome-tpm2.zpn.intel.com:8088/sra/mockssgsra
       // cfpLoadingBar.start();
        $http.post(urlApiPost, JSON.stringify(requestInfo.srarequestinfo)).then(function (response) {
            //First function handles success
            if (response.status == 200) {
                var data2 = response.data[0];
                requestInfo.SRA_Score = data2.sra_score;
                requestInfo.Impact = data2.Impact;
                requestInfo.Probability = data2.Probability;
                

                idService.set("idmock", data2.idmock);
                $scope.loading = true;
                getSDLActionsMock.async().then(function (data4) {
                    
                   

                   
                        $scope.sdlActions = data4;
                       
                    
                    
                     
                }).catch(function () {
                    $scope.error = 'unable to get the SDL Actions';
                });
                $scope.loading = false;

            }
          //  cfpLoadingBar.complete();
        }, function (response) {
            //Second function handles error
            $scope.httperror = response.status;
           // cfpLoadingBar.complete();
        }); 
       
        return;
    }


};


app.controller('mockssgsrarequestCtrl', mockssgsrarequestCtrl);


function mockssgsrarequestCtrl(constantSecTool, $http, $q, $location, $scope, idService, getSRAtypes, getrequestToEdit, getdetailFromWWID, getRolesbySdl, $window) {

    var urlApi = "";
    var urlGetWWIDUrl = constantSecTool.otcIntelSSOUrlUserInfo;
    var urlApi = "";
    var urlApiPost = "";
    if ($location.$$path.includes("/wl")) {
        urlApi = constantSecTool.wl_apiURL + 'statuses';
    }
    else {
        urlApi = constantSecTool.sra_apiURL + 'requests';
        urlApiPost = constantSecTool.sra_apiURL + 'requestsins';

    }

    // The form : behavior and fields
    var projectInfo = this;
    //projectInfo.srainfo = {project_name : "inicia"};
    projectInfo.sraownerinfo = "";
    projectInfo.projectownerinfo = {};
    $scope.ownerinfo = {};
    $scope.submitWhenFormReady = false;
    //projectInfo.srainfo = { sdl_url: '' };
    /* request info pulled from DB */
    //$scope.attrefective = { values: [] };

    // formly-form http://docs.angular-formly.com/

    projectInfo.srainfoFields = [
        {
            key: 'id',
            type: 'input',
            hide: true,
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
        }

    ];

    projectInfo.originalFields = angular.copy(projectInfo.fields);


    $scope.attributes = [
        { "name": "Is this a Hosted Service?", "value": 1 },
        { "name": "Are you developing using C/C++?", "value": 2 },
        { "name": "Are you releasing source code only?", "value": 3 },
        { "name": "Are you pursuing external certification(s) for the product / service?", "value": 4 },
        { "name": "Does the product / service expose APIs / Interfaces?", "value": 5 },
        { "name": "Does the product / service have a SAFE approved patching mechanism?", "value": 6 }
    ];



    projectInfo.onSubmit = onSubmit;

    function onSubmit() {
        angular.extend(projectInfo.srainfo, { attributes: $scope.attrefective.values });
        idService.set("projectId", "1000000");
        console.log(JSON.stringify(projectInfo.srainfo));
        $scope.tab2.disabled = false;
        $scope.tabs.activeTab = 1;
        return;
    }

}

