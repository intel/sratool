
app.controller('headerCtrl', ['$scope', '$http', '$location',  'getSRARole', 'idService', function ($scope, $http, $location, getSRARole, idService) {
    var urlApi = "";
    $scope.titleApp = 'SRA - Security Risk Assessment Admin Tool';
    if ($location.$$path.includes("/wl")) {
        urlApi = 'js/apps/whitelist/topMenu.json';
        $scope.titleApp = 'WhiteListing Evaluation Admin Tool ';
    }
    else {
        urlApi = 'js/apps/sra/topMenu.json';
        $scope.titleApp = 'SRA - Security Risk Assessment Admin Tool';
    }
   
    $scope.logoImage = "sra-logo.jpg";
}]);

app.controller('sidenavCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {

    var urlApi = "";
    if ($location.$$path.includes("/wl")) {
        urlApi = 'js/apps/whitelist/sideMenu.json';
    }
    else {
        urlApi = 'js/apps/sra/sideMenu.json';
    }

    $http.get(urlApi).success(function (data) {
        $scope.menuItems = data;

    });

    $scope.getClass = function () {
        return 'sra-panel-body';
    };

    $scope.getHClass = function () {
        return 'sra-panel-heading';
    }

    console.log("SideNav Controller executed.");

}])


/**/

app.controller('mgmaccessCtrl', ['$scope', '$http', '$location', 'identity', 'constantSecTool', 'idService', 'getSRARole', function ($scope, $http, $location, identity, constantSecTool, idService, getSRARole) {
    var urlApi = constantSecTool.otcIntelSSOUrlGral;

    var projectInfo1 = this;
    var urlGetWWIDUrl = constantSecTool.sra_apiURL + "/getuserinfo/";

    projectInfo1.srainfo = {};

    urlApiPostAddAdmin = constantSecTool.sra_apiURL + 'addadmin';
    urlApiPostRemoveAdmin = constantSecTool.sra_apiURL + 'removeadmin';
    getSRARole.async().then(function (data) {
        idService.set("srarole", setsrarole = data[0].role_access);
        $scope.srarole = idService.get("srarole")

    }).catch(function () {
        idService.set("sraroleerror", setsraroleerror = 'unable to get sra role Details');

    });


    projectInfo1.srainfoFields = [
           {
               key: 'sra_owner',
               type: 'input',
               templateOptions: {
                   type: 'text',
                   label: 'SRA Owner (WWID)',
                   placeholder: 'SRA Owner Info',
                   required: true
               },
               validators: {
                   wwidNumber: function ($viewValue, $modelValue, scope, $scope) {
                       var value = $viewValue;
                       if (value) {

                           return validateWWID(value, scope, 0, $scope)
                       }
                   }
               },
           },

            {
                key: 'sraownerName',
                type: 'input',
                className: 'ownerdetailstyle',
                ngModelAttrs: {
                    txtReadonly: {
                        bound: 'ng-readonly',
                        attribute: 'ng-readonly'
                    }
                },
                templateOptions: {
                    type: 'text',
                    label: 'Display Name',
                    placeholder: 'Display Name',
                    required: true,
                    txtReadonly: true
                }
            },
            {
                key: 'sraownerEmail',
                type: 'input',
                className: 'ownerdetailstyle',
                ngModelAttrs: {
                    txtReadonly: {
                        bound: 'ng-readonly',
                        attribute: 'ng-readonly'
                    }
                },
                templateOptions: {
                    type: 'text',
                    label: 'Email',
                    placeholder: 'Email',
                    required: true,
                    txtReadonly: true
                },

            },
            {
                key: 'sraownerIDSID',
                type: 'input',
                className: 'ownerdetailstyle',
                ngModelAttrs: {
                    txtReadonly: {
                        bound: 'ng-readonly',
                        attribute: 'ng-readonly'
                    }
                },
                templateOptions: {
                    type: 'text',
                    label: 'IDSID',
                    placeholder: 'IDSID',
                    required: true,
                    txtReadonly: true
                },

            },
    ];

    $scope.token = identity.GetInfoFromJWT();
    $scope.req_success = 0;
    $scope.reqsrarole = function () {
        $scope.respost = 0;
        console.log(JSON.stringify(projectInfo1.srainfo));
        $http.post(urlApiPostAddAdmin, JSON.stringify(projectInfo1.srainfo)).then(function (response) {
            //First function handles success
            if (response.status == 200) {

                $scope.respost = 1;

            }

        }, function (response) {
            //Second function handles error
            $scope.httperror = response.status;
            $scope.msg = 'Error performinf operation :' + response.status;
            $scope.response = response;

        });

        return;
    }

    $scope.reqprojectsrarole = function () {

        console.log(JSON.stringify(projectInfo1.srainfo));
        $scope.respost = 0;
        $http.post(urlApiPostRemoveAdmin, JSON.stringify(projectInfo1.srainfo)).then(function (response) {
            //First function handles success
            if (response.status == 200) {
                $scope.respost = 2;
                //  idService.set("projectId", theId.replace(/^\s+|\s+$/g, ''));
            }

        }, function (response) {
            //Second function handles error
            $scope.httperror = response.status;
        });

        return;
    }


    function validateWWID(value, scope, ownerswitch, $scope) {
        var isValid = /^[0-9]{8,8}$/.test(value);

        if (isValid) {

            $http.get(urlGetWWIDUrl + value).success(function (data) {


                scope.model.sraownerName = data.FirstName;
                scope.model.sraownerEmail = data.DomainAddress;
                scope.model.sraownerIDSID = data.upperIDSID;
                scope.model.id = 0;

                //     scope.model.sratype = idService.get("sraType");


            })
            .error(function (data, status) {
                if (ownerswitch == 1) {
                    scope.model.owner_details = "Error getting WWID details"
                    //   scope.projectInfo.srainfoFields.
                }
                else {
                    scope.model.sraowner_details = "Error getting WWID details"
                }
                console.error('error ', status, data);
            })
            .finally(function () {
                console.log("finally executed for  validatewwid");
            });

        }
        return isValid;
    }


}]);


