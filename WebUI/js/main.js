/***********************************/
/*  Main Intel Security Tool Module
/***********************************/
var app = angular.module('SecurityAdminToolsHub', [
   'ngRoute'
  ,'ui.bootstrap' 
  ,'nvd3'
  , 'ngResource'
  , 'datatables', 'datatables.buttons' ,'datatables.bootstrap'    ,'datatables.light-columnfilter'
  , 'xeditable'
  , 'chieffancypants.loadingBar'
  
  , 'ngAnimate', 'ngSanitize', 'mgcrea.ngStrap'  
  , 'formly', 'formlyBootstrap'
  ,'ajaxLoader', function (){}
]);

/* to whomever wants to use the snippet below ***/
app.service('identity', IdentityService)
/**************************************************/
/*     General Config Values (apply to all apps
/**************************************************/
app.constant('constantSecTool', {    
    otcSecVersion: '0.0.0',
    protocolUsed: "http",
    wl_apiURL: 'https://yourWLApp/api.php/',
    sra_apiURL: 'http://localhost:7089/sra/',
   
//	RESTFulPRefix: 'localhost',
    sraroleto: '15'
});

/***********************************************************************************************/ 
/*  Snippets For Authentication  - HERE routines to call JWT or other Authentication Mechanism need to be placed
/***********************************************************************************************/
app.config(function ($routeProvider, $locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push(['$q', '$location', 'identity', 'constantSecTool', function ($q, $location, identity, constantSecTool) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzYW1BY2NvdW50Ijoicm11bmRvbWUiLCJkaXNwbGF5TmFtZSI6Ik11bmRvIE1lbmRleiwgUmljYXJkbyIsInd3aWQiOiIxMTM3NTE5NyIsImlzcyI6Ik90Y1NlY3VyaXR5IiwiZXhwIjoiMTUyMTE1MzA5MyJ9.DFIu1a0nh2Bl_l3PzMuWpbyBDJT5wo7ArlifYkOQAMc";
                    config.headers.Authorization = "Bearer " + token;
                    return config || $q.when(config);
                },

                'response': function (response) {
                    console.log(" response r: ", response);
                    // TODO handle responses from Authorization API             
                    return response || $q.when(response);
                },
                'responseError': function (response) {
                    if (response.status === 401 || response.status === 403) {
                        //window.location.href = otcIntelSSOUrl + location.origin+'/sra/login';
                    }
                    return $q.reject(response);
                }
            };
        }]);

    
    $routeProvider
       // Home es SearchEngine for the moment
      .when("/", { templateUrl: "partials/homesra.html", controller: "searchengineCtrl" })
       // SEARCH ENGINE
         // SRA
         .when("/sra", { templateUrl: "partials/homesra.html", controller: "searchengineCtrl" })
         .when("/sra/searchengine", { templateUrl: "partials/searchEngine.html", controller: "searchengineCtrl" })
         // WHITELIST - to show how several tenant will be hosted
         .when("/wl", { templateUrl: "partials/searchEngine.html", controller: "searchengineCtrl" })
         .when("/wl/searchengine", { templateUrl: "partials/searchEngine.html", controller: "searchengineCtrl", })
        .when("/wl/bdh/:vuls/:reqid/:prname", { templateUrl: "partials/bdh_wl.html", controller: "vulPerComponentCtrl", })

       // SUMMARY REPORTS
        //SRA
         .when("/summaryByStatus", { templateUrl: "partials/summaryRep.html" })
         .when("/sra/summaryByStatus", { templateUrl: "partials/summaryRep.html" })
        // WHITELIST
         .when("/wl/summaryByStatus", { templateUrl: "partials/summaryRep.html" })
        // SRA Catalogs   
         .when("/sra/scoresCatalog", { templateUrl: "partials/scoresCt.html" })
         .when("/sra/sratypes", { templateUrl: "partials/sratoolsct.html" })
         .when("/sra/sratype/:riskId/:version", { templateUrl: "partials/sratoolversion.html" })
        // SRA New Requests and Edit Requests
        
         .when("/sra/access", { templateUrl: "partials/accessmgmt.html", controller: "mgmaccessCtrl", })
         
        // SRA - Generic SSG SRA request  
        .when("/sra/ssgsra/:sraid/:prjId", { templateUrl: "partials/ssgsra.html" })
        .when("/sra/ssgsra/:sraid", { templateUrl: "partials/ssgsra.html" })
        .when("/sra/mockssgsra", { templateUrl: "partials/mockssgsra.html"})

       // OTHER FUNCTIONALTY 
      .when("/about", { templateUrl: "partials/about.html", controller: "PageCtrl" })
      .when("/faq", { templateUrl: "partials/faq.html", controller: "PageCtrl" })
      .when("/contact", { templateUrl: "partials/contact.html", controller: "PageCtrl" })
      .when("/sdl", { templateUrl: "partials/sdlsummary.html" })
      .when("/sdl/statusreport", { templateUrl: "partials/sdlReport.html" })
     

       // SWITCHING APPS
      .when("/wl/switchapp", { templateUrl: "partials/searchEngine.html", controller: "switchsearchengineCtrl" })
      .when("/sra/switchapp", { templateUrl: "partials/searchEngine.html", controller: "switchsearchengineCtrl" })
      .when("/sra/projectdetail/:prjId", { templateUrl: "partials/projectDetails.html", controller: "prDetailsCtrl" })
      
    

      // 404
      .otherwise("/404", { templateUrl: "partials/404.html", controller: "PageCtrl" });

});


/* Snippet - to be written by implementor */


/***********************************/ 
/*  Routing
/***********************************/




    function IdentityService($window) {
        //For ilustrative purposes:  Tokens or any other Authorization mechanism is the sole responsability of the implementer


        this.storeToken = function (token) {
            $window.localStorage['otcToken'] = token
        };

        this.removeToken = function () {
            $window.localStorage.removeItem('otcToken');
        };

        this.getToken = function () {
            return $window.localStorage['otcToken'];
        };

        this.isIdentify = function () {
            var token = this.getToken();
            if (token) {
                var params = this.GetInfoFromJWT(token);
                return Math.round(new Date().getTime() / 1000) <= params.exp;
            } else {
                return false;
            }
        }
        this.GetInfoFromJWT = function (token) {
            if (token != null) {
                var payuloadFromToken = token.split('.')[1];
                var payload = payuloadFromToken.replace('-', '+').replace('_', '/');
            }
            return JSON.parse($window.atob(payload));
        }

        this.GetInfoFromJWT = function () {
            var tokenOr = this.getToken();
            if (tokenOr != null) {
                var payuloadFromToken = tokenOr.split('.')[1];
                var payload = payuloadFromToken.replace('-', '+').replace('_', '/');
                return JSON.parse($window.atob(payload));
            }
            return null;
        }
    }

