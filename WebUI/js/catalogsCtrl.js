




app.controller('riskfactortypesCtrl', riskfactortypesCtrl);

function riskfactortypesCtrl($scope, getSRAtypes) {
    /* Pulling SRA Types Catalog */
    getSRAtypes.async().then(function (data) {
        $scope.sratypes = data;

    }).catch(function () {
        $scope.error = 'unable to get the SRA Types';
    });
    /* End Pulling SRA Types Catalog */

}

app.controller('riskfactortypeCtrl', riskfactortypeCtrl);

function riskfactortypeCtrl($scope, getSRAVersion) {
    /* Pulling SRA Type Version */
    getSRAVersion.async().then(function (data) {
        $scope.sratype = data;
        $scope.sranname = $scope.sratype[0].name;
        $scope.sraversion = $scope.sratype[0].version;

    }).catch(function () {
        $scope.error = 'unable to get the SRA Types';
    });
    /* End Pulling SRA Type Version */

}

app.factory('scoresCt', function ($resource) {
    return $resource('sra/scoresins', { Id: '@_id' });
});

app.controller('scoresCtCtrl', ['$scope', '$http', 'constantSecTool', '$location', '$window', '$filter', function ($scope, $http, constantSecTool, $location, $window, $filter) {
    this.isEdit = true;
     
    var urlApi = "";
    var urlApiPost = "";
    if ($location.$$path.includes("/wl")) {
        urlApi = constantSecTool.wl_apiURL + 'statuses';
    }
    else {
        urlApi = constantSecTool.sra_apiURL + 'scores';
        urlApiPost = constantSecTool.sra_apiURL + 'scoresins';
    }


    $http.get(urlApi).success(function (data) {
        $scope.scores = data;
    });

    $scope.checkName = function (data, id) {
        /*if (id === 2) {
            return "";
        }*/
    };

    

    $scope.statuses = [
     { value: "A", text: 'Active' },
     { value: "I", text: 'Inactive' },
     
    ];

    $scope.showStatus = function (score) {
        var selected = [];
        if (score.status) {
            selected = $filter('filter')($scope.statuses, { value: score.status });
        }
        if (score.status == 'A' || selected.length < 1)
            return 'Active';
        else if (score.status == 'I'){
                return 'Inactive';            
        }  else{
          return selected[0].text;
        }
        
    };

    $scope.addScore = function () {
        $scope.inserted = {
            id: 0,           
            name: '',            
            status: 'A'
        };
        $scope.scores.push($scope.inserted);
    };

    $scope.validateData = function (data, id) {
      
         
          
        return true;
    };

    $scope.saveScore = function (data, id) {
        $scope.validateData(data, id);
        if (typeof id == "string") {
            angular.extend(data, { id: parseInt(id) });
        }
        else {
            angular.extend(data, { id: id });
        }
        console.log(data);
        return $http.post(urlApiPost, data);
    };


}]);