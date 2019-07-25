
//TODO: Comment Source Code

app.factory('projectDetailsService', function ($http, $routeParams, constantSecTool, $location) {
    var projectDetailsService = {
        async: function () {
            var urlApi = "";
            var param1 = $routeParams.prjId;
            if ($location.$$path.includes("/wl")) {
                urlApi = constantSecTool.wl_apiURL + 'project/' + param1;
            }
            else {
                urlApi = constantSecTool.sra_apiURL + 'project/' + param1;
            }

            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get(urlApi).then(function (response) {
                // The then function here is an opportunity to modify the response
                console.log(response);
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return projectDetailsService;
});


// Aug 2017
app.factory('getSRARole', function ($http, constantSecTool, idService) {
    var getSRARole = {
        async: function () {
                      
            var urlApi = constantSecTool.sra_apiURL + "getrole";
            var promise = $http.get(urlApi).then(function (response) {
                
                return response.data;
            });
            return promise;
        }
    };
    return getSRARole;
});


app.factory('getFromServices', function ($http, constantSecTool, $location) {
    var getFromServices = {
        async: function () {
            var urlApi = "";
            var urlApiGral = "";
            if ($location.$$path.includes("/wl")) {
                urlApi = constantSecTool.wl_apiURL + 'GetSummary';
                urlApiGral = constantSecTool.wl_apiURL + 'GetSummary';
            }
            else {
                urlApi = constantSecTool.sra_apiURL + 'summarybystatus';

            }
            var promise = $http.get(urlApi).then(function (response) {
                console.log(response);
                return response.data;
            });
            return promise;
        }
    };
    return getFromServices;
});

app.factory('getFromServicesByType', function ($http, constantSecTool, $location, idService) {
    var getFromServicesByType = {
        async: function () {
            var urlApi = "";
            var urlApiGral = "";
            var param1 = idService.get("psecid");
            if ($location.$$path.includes("/wl")) {
                urlApi = constantSecTool.wl_apiURL + 'GetSummary';
                urlApiGral = constantSecTool.wl_apiURL + 'GetSummary';
            }
            else {
                urlApi = constantSecTool.sra_apiURL + 'psecsummary/' + param1;

            }
            var promise = $http.get(urlApi).then(function (response) {
                console.log(response);
                return response.data;
            });
            return promise;
        }
    };
    return getFromServicesByType;
});


app.factory('getSDLSummaryStatus', function ($http, constantSecTool, $location) {
    var getSDLSummaryStatus = {
        async: function () {
            var urlApi = "https://summarybystatus";                        
            var promise = $http.get(urlApi).then(function (response) {
                console.log(response);
                return response.data;
            });
            return promise;
        }
    };
    return getSDLSummaryStatus;
});

app.factory('getSDLSummaryBU', function ($http, constantSecTool, $location) {
    var getSDLSummaryBU = {
        async: function () {
            var urlApi = "https://summarybybu";
            var promise = $http.get(urlApi).then(function (response) {
                console.log(response);
                return response.data;
            });
            return promise;
        }
    };
    return getSDLSummaryBU;
});


app.factory('getRiskFactor', function ($http, constantSecTool, $routeParams, $location, idService) {          
    var getRiskFactor = {
        async: function () {
            var param1 = 0;
            if (idService.get("sraType") != null) {
                param1 = idService.get("sraType");
            }
            else {
                param1 = $routeParams.sraid;
                idService.set("sraType", setsraType = param1);
            }            
            var urlApi = constantSecTool.sra_apiURL + "riskfactor/" + param1;            
            var promise = $http.get(urlApi).then(function (response) {
                console.log(response);
                return response.data;
            });
            return promise;
        }
    };
    return getRiskFactor;
});


app.factory('getRiskFactorGuidelines', function ($http, constantSecTool, $routeParams, $location, idService) {
    var getRiskFactor = {
        async: function () {
            var param1 = 0;
            if (idService.get("sraType") != null) {
                param1 = idService.get("sraType");
            }
            else {
                param1 = $routeParams.sraid;
                idService.set("sraType", setsraType = param1);
            }
            var urlApi = constantSecTool.sra_apiURL + "riskfactorguides/" + param1;

            var promise = $http.get(urlApi).then(function (response) {
                console.log(response);
                return response.data;
            });
            return promise;
        }
    };
    return getRiskFactor;
});

 
app.factory('getProjectGeneralInfo', function ($http, $routeParams, constantSecTool, $location) {
    var getProjectGeneralInfo = {
        async: function () {
            var urlApi = "";
            var param1 = $routeParams.prjId;
            if ($location.$$path.includes("/wl")) {
                urlApi = constantSecTool.wl_apiURL + 'projectinfo/' + param1;
            }
            else {
                urlApi = constantSecTool.sra_apiURL + 'projectinfo/' + param1;
            }

            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get(urlApi).then(function (response) {
                // The then function here is an opportunity to modify the response
                console.log(response);
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return getProjectGeneralInfo;
});


app.factory('getComponentVuls', function ($http, $routeParams, constantSecTool, $location) {
    var getComponentVuls = {
        async: function () {
            var urlApi = "https://components/";
            var param = $routeParams.vuls;
            urlApi = urlApi + param + "//vulnerabilities";

            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get(urlApi).then(function (response) {
                // The then function here is an opportunity to modify the response
                //   console.log(response);
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return getComponentVuls;
});





app.factory('getwlra', function ($http, $routeParams, constantSecTool, $location) {
    var getwlra = {
        async: function () {
            var urlApi = "https://getwlrisk/";
            var param = $routeParams.reqid;
            urlApi = urlApi + param;

            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get(urlApi).then(function (response) {
                // The then function here is an opportunity to modify the response
                //   console.log(response);
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return getwlra;
});

app.factory('getrequestToEdit', function ($http, constantSecTool, $routeParams, $location, idService) {
    var getrequestToEdit = {
        async: function () {
            var param1 = 0;
            if (idService.get("projectId") != null && $routeParams.prjId != null) {
                param1 = idService.get("projectId");
            }
            else if (idService.get("projectIdAlt") != null) {
                param1 = idService.get("projectIdAlt");
                idService.set("projectId", setprojectId = param1);
            }
            else {
                param1 = $routeParams.prjId;
                idService.set("projectId", setprojectId = param1);
            }
            var urlApi = constantSecTool.sra_apiURL + "request/" + param1;
            var promise = $http.get(urlApi).then(function (response) {
                console.log(response);
                return response.data;
            });
            return promise;
        }
    };
    return getrequestToEdit;
});


app.factory('getRolesbySdl', function ($http, constantSecTool, $routeParams, $location, idService) {
    var getRolesbySdl = {
        async: function () {
            var param1 = "";
            if (idService.get("sdl_idParam") != null) {
                param1 = idService.get("sdl_idParam");
            }
            else {
                param1 = "00000000";

            }
            var urlApi = constantSecTool.sra_apiURL + 'getrolesbysdl/' + param1;
            var promise = $http.get(urlApi).then(function (response) {
                console.log(response);
                return response.data;
            });
            return promise;
        }
    };
    return getRolesbySdl;
});

app.factory('getdetailFromID', function ($http, constantSecTool, $routeParams, $location, idService) {
    var getdetailFromID = {
        async: function () {
            var param1 = 0;
            if (idService.get("projectOwnerID") != null ) {
                param1 = idService.get("projectOwnerID");
            }
            else {
                param1 = "00000000";
                
            }
            var urlApi = constantSecTool.openSSSOUrlUserInfo + param1;
            var promise = $http.get(urlApi).then(function (response) {
                console.log(response);
                return response.data;
            });
            return promise;
        }
    };
    return getdetailFromID;
});


app.factory('getSDLActions', function ($http, constantSecTool, $routeParams, $location, idService) {
    var getSDLActions = {
        async: function () {
            var idrisktype = 1;
            var sdlVersion = "4.3";
            if (idService.get("sraType") != null) {
                idrisktype = idService.get("sraType");
            }
            if (idService.get("sdlVersion") != null) {
                sdlVersion = idService.get("sdlVersion");
            }
             
            var urlApi = constantSecTool.sra_apiURL + "actions/" + idrisktype + "/" + sdlVersion;
            var promise = $http.get(urlApi).then(function (response) {
                console.log(response);
                return response.data;
            });
            return promise;
        }
    };
    return getSDLActions;
});


app.factory('getSRAtypes', function ($http, constantSecTool, $routeParams, $location, idService) {
    var getSRAtypes = {
        async: function () {
           
            var urlApi = constantSecTool.sra_apiURL + "riskfactortypes";
            var promise = $http.get(urlApi).then(function (response) {
                console.log(response);
                return response.data;
            });
            return promise;
        }
    };
    return getSRAtypes;
});


app.factory('getSRAVersion', function ($http, constantSecTool, $routeParams, $location, idService) {
    var getSRAVersion = {
        async: function () {
            var param1 = $routeParams.riskId;
            var param2 = $routeParams.version;               
            var urlApi = constantSecTool.sra_apiURL + "riskfactortype/" + param1 + "/" + param2;
            var promise = $http.get(urlApi).then(function (response) {
                console.log(response);
                return response.data;
            });
            return promise;
        }
    };
    return getSRAVersion;
});

app.factory('Excel', function ($window) {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
        format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
    return {
        tableToExcel: function (tableId, worksheetName) {
            var table = $(tableId),
                ctx = { worksheet: worksheetName, table: table.html() },
                href = uri + base64(format(template, ctx));
            return href;
        }
    };
})
    


app.factory('idService', function () {

    var projectRequestInfo = {};
    return {
        set: set,
        get: get
    }

    function get(key){     
        return projectRequestInfo[key];
    }

    function set(key, value){
        projectRequestInfo[key] = value;
    }

});

 
