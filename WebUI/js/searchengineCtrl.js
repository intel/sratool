//'use strict';

 
app.controller('searchengineCtrl', searchengineCtrl);

function searchengineCtrl(DTOptionsBuilder, DTColumnBuilder, constantSecTool, $http, $q, $window, $location, $scope, $timeout) {
    var columsDef = [];
    var urlApi = "";
    httpOrhttps = constantSecTool.protocolUsed;
    if($location.$$path.includes("/wl"))
	{		  
      // TODO integrate WL a public Open source Approach
    }
    else
	{		
        urlApi = constantSecTool.sra_apiURL + "projects";
        
        columsDef.push(["Sdl_Id", "SDL ID", "12%"]);
	    columsDef.push(["Project Name", "Project Name","25%"]);
		columsDef.push(["SRA_Score","SRA Score","10%"]);
		columsDef.push(["PSEC","PSEC","10%"]);
		columsDef.push(["SRA_Owner","SRA Owner","10%"]);
		columsDef.push(["Project_Owner1","Project Owner","12%"]);
	//	columsDef.push(["SDL_Url","SDL","10%"]);
		columsDef.push(["Created","Created On","10%"]);
		columsDef.push(["CreatedBy", "Created By", "10%"]);
		columsDef.push(["id", "SRA #", "10"]);
	 }
	var vm = this;	
    vm.items = [];
	vm.message = '';
	vm.searchClickHandler = searchClickHandler;
	
	$scope.reload = function () {
	    var defer = $q.defer();
	    $http.get(urlApi).then(function (result) {
	        defer.resolve(result.data);
	    });
	    
	    $timeout(function () {
	        $scope.reload();
	    }, 30000)

	    return defer.promise;
	};
	
	vm.dtOptions = DTOptionsBuilder.fromFnPromise(function () {
	    // return $scope.reload();
	    var defer = $q.defer();
	    $http.get(urlApi).then(function (result) {
	        defer.resolve(result.data);
	    });
	    $timeout(function () {
	        DTOptionsBuilder.fromFnPromise();
	    }, 30000)
	    return defer.promise;
	}).withDOM('lfrtip').withPaginationType('simple_numbers')
				   .withDisplayLength(10)
				   .withBootstrap()
				   .withOption('rowCallback', rowCallback)
				   .withOption('autoWidth', false)
                   .withOption('order', [2, 'asc'])
                   

                   .withOption('responsive', true);

	vm.dtColumns = [];
	for (var i = 0; i < columsDef.length; i++) {

	    vm.dtColumns.push(DTColumnBuilder.newColumn(columsDef[i][0]).withTitle(columsDef[i][1]).withOption('sWidth', columsDef[i][2]));
	}
 
	//console.log("searchengineCtrl Controller executed.");	
	function searchClickHandler(info) {
        vm.message = info.ReqId + ' - ' + info.STATUS;
    }
	
	
	
    function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
        $('td', nRow).unbind('click');
        $('td', nRow).bind('click', function() {
  		 if($location.$$path.includes("/sra"))
  		 {
  		     if (aData.locksra == "1") {   // To sent to view only page, otherwise send to edition
  		         var newurl = httpOrhttps + "://" + window.location["host"] + "/sra/projectdetail/" + aData.id;
  		         $window.open(newurl, "_blank")
  		     }
  		     else
  		     {
  		         
  		         var newurl = httpOrhttps + "://" + window.location["host"] + "/sra/ssgsra/" + aData.sra_type + "/" + aData.id;
  		        
  		         $window.open(newurl, "_blank")
  		     }
			}
			else
			{
			  // WL and Open Source Approach
			}         
        });
		
		
		$('td', nRow).unbind('mouseenter');
        $('td', nRow).bind('mouseenter', function() {		   
			this.parentElement.style="background-color: transparent";
			this.parentElement.style="background-color:#F3D54E; ";
        });
		
		$('td', nRow).unbind('mouseleave');
        $('td', nRow).bind('mouseleave', function() {		   
			this.parentElement.style="background-color: transparent";
			if(this.parentElement.className=="odd")
			  this.parentElement.style="background-color: #f7f8f9";            
        });
				 	
        return nRow;
    }
}


/**
 * Other Pages for the moment being controlled from here
 */
app.controller('PageCtrl', function (/* $scope, $location, $http */) {
  //console.log("Page Controller executed.");
  

});


app.controller('vulPerComponentCtrl', vulPerComponentCtrl);

function vulPerComponentCtrl(getComponentVuls,getwlra, constantSecTool, $http, $q, $window, $location, $scope, $timeout, $routeParams) {
    getComponentVuls.async().then(function (data4) {
        $scope.bdhvul = data4.items;
    }).catch(function () {
        $scope.error = 'unable to get the Component Vulnerabilities';
    });

    getwlra.async().then(function (data5) {
        $scope.wlra = data5;
    }).catch(function () {
        $scope.error = 'unable to get the WL Risk Assessment';
    });
    
    $scope.ProjectName = $routeParams.prname;
   
}







/*
withLightColumnFilter({
                       '0': {
                           type: 'number'
                       },
                       '1': {
                           type: 'text'
                       },
                       '2': {
                           type: 'text'
                       },
                       '3': {
                           type: 'text'
                       },
                       '4': {
                           type: 'text'
                       },
                       '5': {
                           type: 'text'
                       },
                       '6': {
                           type: 'text'
                       },
                       '7': {
                           type: 'text'
                       },

                       '8': {
                           type: 'number'
                       }
                   })
*/