 

app.controller('prDetailsCtrl', prDetailsCtrl);

function prDetailsCtrl(idService, $timeout, $http, $scope, projectDetailsService, getProjectGeneralInfo, getSRARole,getSDLActions, constantSecTool, $window, Excel) {
    var ys = 0;
    var xs = 0;
    var sra_type = 0;

    
    getProjectGeneralInfo.async().then(function (data2) {
        $scope.ProjectGeneral = data2;
        $scope.xs = $scope.ProjectGeneral[0].impact_score;
        $scope.ys = $scope.ProjectGeneral[0].prob_score;
        $scope.sra_type = $scope.ProjectGeneral[0].sra_type;
        $scope.urlproject = "https://www.microsoft.com/en-us/securityengineering/sdl/faq" //"https://yoursdltool_and_id?PN_ID=" + $scope.ProjectGeneral[0].sdl_id;
        //refactor to pull correct admin
        // if (($scope.ProjectGeneral[0].Project_Owner == $scope.token.id) || ($scope.ProjectGeneral[0].SRA_Owner == $scope.token.id) || ($scope.srarole == '15')) {
            $scope.inactive2 = false;
        //}
        if ($scope.ProjectGeneral[0].sra_type != 6) {
            resizePointer3($scope);
        }
        $scope.ProjectName = $scope.ProjectGeneral[0].Project_Name;
        projectDetailsService.async().then(function (data) {
            $scope.ProjectDetails = data;
        }).catch(function () {
            $scope.error = 'unable to get the Project Details';
        });
        if ($scope.sra_type != 8) {
            getSDLActions.async().then(function (data3) {
                $scope.sdlActions = data3;
            }).catch(function () {
                $scope.error = 'unable to get the SDL Actions';
            });
        }
       

    }).catch(function () {
        $scope.error = 'unable to get the Project Info';
    });

    $scope.callMyCustomMethod = function () {
        console.log('Method called by the directive, when finished rendering');
    }

  

    $scope.sendToExcel = function () {
        var blob = new Blob([document.getElementById('exportResults').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, $scope.ProjectName + ".xls");
    };

    
    $scope.inactive = 0;
    
    $scope.inactiveSRA = function () {
        $scope.inactive = 1;
    };

    $scope.cancelInactive = function () {
        $scope.inactive = 0;
    };
    $scope.doInactive = function () {
       
        if (($scope.ProjectGeneral[0].Project_Owner == $scope.token.id) || IsAdmin($scope.token.id))
        {
            $http.post(constantSecTool.sra_apiURL + "inactivesra/" + $scope.ProjectGeneral[0].id +"/" + $scope.token.id , "{}").then(function (response) {
                //First function handles success
                if (response.status == 200) {
                   
                    var newurl = constantSecTool.protocolUsed +  "://" + window.location["host"] + "/sra/searchengine";
                    $window.open(newurl, "_self")

                    //  idService.set("projectId", theId.replace(/^\s+|\s+$/g, ''));
                }

            }, function (response) {
                //Second function handles error
                $scope.httperror = response.status;
            });
        }
      
        $scope.inactive = 0;
    };

    function IsAdmin(idUser)
    {
        return true;
    }

};

app.controller('requestCtrlTabs', ['$scope', function ($scope) {
     
   
    $scope.tabs = []
    $scope.tab1 = { title: 'General Information' };
    $scope.tab2 = { title: 'Security Risk Assessment' };
    $scope.tab3 = { title: 'Help' };
    $scope.tab4 = { title: 'General Project Information' };
    $scope.tab5 = { title: 'Recommended SDL Actions' };
    $scope.tabs.push($scope.tab1);
    $scope.tabs.push($scope.tab2);
    $scope.tabs.push($scope.tab3);
    $scope.tabs.push($scope.tab4);
    $scope.tabs.push($scope.tab5);
    //$scope.tabs.activeTab = 0;//"General Information";

    $scope.project = {
        name: ''
    };
     

    
    

}])


/*
$scope.srameter = {
    "background-image": "url(http://localhost:99/images/srameter.png)",
    "background-size": "50% auto",

    "padding": "5px"
}*/