
app.controller('tabsCtrl', tabsCtrl);

function tabsCtrl(constantSecTool, $http, $q, $window, $location, $scope) {
    /* Section Tabs */
    var titles = $location.$$path.split('/');
    $scope.tabs = []
    $scope.tab1 = { title: 'General Information' };
    $scope.tab2 = { title: 'Security Risk Assessment', disabled: true };
    $scope.tab3 = { title: 'Help' };
    $scope.tab4 = { title: 'General Project Information' };
    $scope.tab5 = { title: 'Recommended SDL Actions', disabled: true };
    $scope.tabs.push($scope.tab1);
    $scope.tabs.push($scope.tab2);
    $scope.tabs.push($scope.tab3);
    $scope.tabs.push($scope.tab4);
    $scope.tabs.push($scope.tab5);
    $scope.tabs.activeTab = 0;//"General Information";
    // $scope.tab2.disabled = true;
    $scope.project = {
        name: ''
    };
}



app.controller('switchsearchengineCtrl',  switchApp);
function switchApp($window, $location, $scope, $timeout)
{   
    var urlApi = "";
    $scope.issra = 1;
    if($location.$$path.includes("/wl"))
    {
        $timeout(function () {
            $scope.oculta = true;
        }, 500);
        $window.location.href = '/wl/summaryByStatus';
        
	}
	else
    {
        $timeout(function () {
            $scope.oculta = false;
        }, 500);
        $window.location.href = '/sra/summaryByStatus';

	}
}


app.controller('ocultaCtrl', ocultaCtrl);
function ocultaCtrl($window, $location, $scope, $timeout) {
    var urlApi = "";
    $scope.issra = 1;
    if ($location.$$path.includes("/wl")) {
        $timeout(function () {
            $scope.oculta = true;
        }, 50);
       

    }
    else {
        $timeout(function () {
            $scope.oculta = false;
        }, 50);
       

    }
}



app.controller('summaryStatusCtrl', ['$scope', 'getFromServices', 'getFromServicesWL', 'constantSecTool', '$location', function ($scope, getFromServices, getFromServicesWL, constantSecTool, $location) {
              
    getFromServices.async().then(function (data) {	     
	    $scope.data = data;
	    $scope.options = {
	        chart: {
	            type: 'pieChart',
	            height: 500,
	            x: function (d) { return d.Ioca_items; },
	            y: function (d) { return d.Total; },
	            showLabels: true,
	            duration: 400,
	            donut: true,
	            donutRatio: .45,
	            labelThreshold: 0.01,
	            labelType: 'percent',
	            labelSunbeamLayout: true,
	            legend: {
	                margin: {
	                    top: 5,
	                    right: 35,
	                    bottom: 5,
	                    left: 0
	                }
	            }
	        }
	    };
	}).catch(function () {
	    $scope.error = 'unable to get the Summary Status';
	});

   
          
	if (!($location.$$path.includes("/wl") || $location.$$path.includes("/sra"))) {
	    
	    getFromServicesWL.async().then(function (data2) {
	        $scope.issra = 0;
	        $scope.data2 = data2;
	    }).catch(function () {
	        $scope.error = 'unable to get the Summary Status';
	    });

    }
        
	
}])

app.factory('getFromServicesWL', function ($http, constantSecTool, $location) {
    var getFromServicesWL = {
        async: function () {
            var urlApi = "";
            urlApi = constantSecTool.wl_apiURL + 'GetSummary';
           
            var promise = $http.get(urlApi).then(function (response) {
                console.log(response);
                return response.data;
            });
            return promise;
        }
    };
    return getFromServicesWL;
});



/*

1	Open Source PSEC
2	HW/SW Co-design PSEC
3	Libraries and Tools PSEC
4	Low-level/Systems PSEC
5	Security and Privacy Central (SPC)
6	Web-Services-Apps PSEC
7	SSG SRA Generic PSEC

*/

app.controller('summaryStatusOSCtrl', summaryStatusOSCtrl);

function summaryStatusOSCtrl($scope, getFromServicesByType, $location, idService) {
    
    if ($location.$$path.includes("/wl")) {       
        $scope.oculta = false;      
        return;
    }
   
       
   
    idService.set("psecid", 1);
    getFromServicesByType.async().then(function (data) {
        $scope.data = data;
        $scope.oculta = true;
        $scope.options = {
            chart: {
                type: 'pieChart',
                height: 300,
                x: function (d) { return d.Ioca_items; },
                y: function (d) { return d.Total; },
                showLabels: true,
                duration: 500,
                donut: true,
                donutRatio: .45,
                labelThreshold: 0.01,
                labelType: 'percent',
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 1,
                        right: 5,
                        bottom: 1,
                        left: 0
                    }
                }
            }
        };
    }).catch(function () {
        $scope.error = 'unable to get the Summary Status By OpenSource';
    });


   


};

app.controller('summaryStatusHWCtrl', summaryStatusHWCtrl);

function summaryStatusHWCtrl($scope, getFromServicesByType, $location, idService) {
    if ($location.$$path.includes("/wl")) {
        return;
    }
    idService.set("psecid", 2);
    getFromServicesByType.async().then(function (data) {
        $scope.data = data;
        $scope.options = {
            chart: {
                type: 'pieChart',
                height: 300,
                x: function (d) { return d.Ioca_items; },
                y: function (d) { return d.Total; },
                showLabels: true,
                duration: 500,
                donut: true,
                donutRatio: .45,
                labelThreshold: 0.01,
                labelType: 'percent',
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 1,
                        right: 5,
                        bottom: 1,
                        left: 0
                    }
                }
            }
        };
    }).catch(function () {
        $scope.error = 'unable to get the Summary Status By OpenSource';
    });





};

app.controller('summaryStatusLibCtrl', summaryStatusLibCtrl);

function summaryStatusLibCtrl($scope, getFromServicesByType, $location, idService) {
    if ($location.$$path.includes("/wl")) {
        return;
    }
    idService.set("psecid", 3);
    getFromServicesByType.async().then(function (data) {
        $scope.data = data;
        $scope.options = {
            chart: {
                type: 'pieChart',
                height: 300,
                x: function (d) { return d.Ioca_items; },
                y: function (d) { return d.Total; },
                showLabels: true,
                duration: 500,
                donut: true,
                donutRatio: .45,
                labelThreshold: 0.01,
                labelType: 'percent',
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 1,
                        right: 5,
                        bottom: 1,
                        left: 0
                    }
                }
            }
        };
    }).catch(function () {
        $scope.error = 'unable to get the Summary Status By OpenSource';
    });





};

app.controller('summaryStatusLowCtrl', summaryStatusLowCtrl);

function summaryStatusLowCtrl($scope, getFromServicesByType, $location, idService) {
    if ($location.$$path.includes("/wl")) {
        return;
    }
    idService.set("psecid", 4);
    getFromServicesByType.async().then(function (data) {
        $scope.data = data;
        $scope.options = {
            chart: {
                type: 'pieChart',
                height: 300,
                x: function (d) { return d.Ioca_items; },
                y: function (d) { return d.Total; },
                showLabels: true,
                duration: 500,
                donut: true,
                donutRatio: .45,
                labelThreshold: 0.01,
                labelType: 'percent',
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 1,
                        right: 5,
                        bottom: 1,
                        left: 0
                    }
                }
            }
        };
    }).catch(function () {
        $scope.error = 'unable to get the Summary Status By OpenSource';
    });





};

app.controller('summaryStatusSecCtrl', summaryStatusSecCtrl);

function summaryStatusSecCtrl($scope, getFromServicesByType, $location, idService) {
    if ($location.$$path.includes("/wl")) {
        return;
    }
    idService.set("psecid", 5);
    getFromServicesByType.async().then(function (data) {
        $scope.data = data;
        $scope.options = {
            chart: {
                type: 'pieChart',
                height: 300,
                x: function (d) { return d.Ioca_items; },
                y: function (d) { return d.Total; },
                showLabels: true,
                duration: 500,
                donut: true,
                donutRatio: .45,
                labelThreshold: 0.01,
                labelType: 'percent',
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 1,
                        right: 5,
                        bottom: 1,
                        left: 0
                    }
                }
            }
        };
    }).catch(function () {
        $scope.error = 'unable to get the Summary Status By OpenSource';
    });





};


app.controller('summaryStatusWebCtrl', summaryStatusWebCtrl);

function summaryStatusWebCtrl($scope, getFromServicesByType, $location, idService) {
    if ($location.$$path.includes("/wl")) {
        return;
    }
    idService.set("psecid", 6);
    getFromServicesByType.async().then(function (data) {
        $scope.data = data;
        $scope.options = {
            chart: {
                type: 'pieChart',
                height: 300,
                x: function (d) { return d.Ioca_items; },
                y: function (d) { return d.Total; },
                showLabels: true,
                duration: 500,
                donut: true,
                donutRatio: .45,
                labelThreshold: 0.01,
                labelType: 'percent',
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 1,
                        right: 5,
                        bottom: 1,
                        left: 0
                    }
                }
            }
        };
    }).catch(function () {
        $scope.error = 'unable to get the Summary Status By OpenSource';
    });





};


