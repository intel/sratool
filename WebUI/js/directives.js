/* To move the red circle around the Scores Square when the web browser is resized*/
app.directive('resize', function ($window) {
    return function (scope, element) {
        scope: false;
        var w = angular.element($window);
        var elmnt1 = document.getElementById("GraphResults").offsetHeight;
        scope.getWindowDimensions = function () {
            return { 'h': w.height(), 'w': w.width(), elmnt1 };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue, extraValue) {
            if (elmnt1 > 0)
            resizePointer3(scope);
            

        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });                
    }
})


/* To move the red circle around the Scores Square when the web browser is resized - Call by directive*/
function resizePointer3(scope)
{
    try {
        if (scope.xs != undefined) {
            var elmnt = document.getElementById("GraphResults");
            var xInd = elmnt.offsetHeight * .12;
            var yInd = elmnt.offsetWidth * .15;


            xInd = (elmnt.offsetHeight * .74) * scope.xs / 100 + (elmnt.offsetHeight * .12);
            yInd = (elmnt.offsetWidth * .47) * scope.ys / 100 + (elmnt.offsetWidth * .15);

            if (xInd < (elmnt.offsetHeight * .12))
            {
                xInd = (elmnt.offsetHeight * .12);
            }
            if (xInd > (elmnt.offsetHeight * .86)) {
                xInd = (elmnt.offsetHeight * .86);
            }

            if (yInd > (elmnt.offsetWidth * .62))
            {
                yInd = (elmnt.offsetWidth * .62);
            }

            if (yInd < (elmnt.offsetWidth * .15)) {
                yInd = (elmnt.offsetWidth * .15);
            }

            scope.indicador = function () {
                return {
                    "position": "absolute",
                    left: yInd + "px",
                    bottom: xInd + "px",
                    width: "3%",
                    height: "3%",
                    display: "normal",
                    "z-index": "10"
                };
            };
        }
        else {
            return {
                "position": "absolute",
                "display": "none",
                "z-index": "10"
            };

        }
    } catch (e) {

        return {
            "position": "absolute",
            "display" : "none",
            "z-index": "10"
        };
    }
}



/* To set Image at run time */
app.directive('backImg', function(){
    return function(scope, element, attrs){
        var url = attrs.backImg;
        element.css({
            'background-image': 'url(' + url +')',
            'background-size' : 'cover'
        });
    };
});

app.directive('imageonload', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('load', function () {
                debugger;
                
                $timeout(resizePointer(scope), 0);
                scope.$apply();
            });
            element.bind('error', function () {
                alert('image could not be loaded');
            });
        }

       
    };
});

app.directive('setHeight', function($window){
    return{
        link: function(scope, element, attrs){
            element.css('height', element.offsetHeight + 1);
            element.css('height', element.offsetHeight - 1);
            //element.height($window.innerHeight/3);
            element.bind('setHeight', function () {
                scope.$apply();
            });
        }
        
    }
})

angular.module('ui.chart', []).directive('uiChart', function() {
    return {
        restrict : 'EACM',
        template : '<div></div>',
        replace : true,
        link : function(scope, elem, attrs) {
            var renderChart = function() {
                var data = scope.$eval(attrs.uiChart);
                elem.html('');
                if (!angular.isArray(data)) {
                    return;
                }
                var opts = {};
                if (!angular.isUndefined(attrs.chartOptions)) {
                    opts = scope.$eval(attrs.chartOptions);
                    if (!angular.isObject(opts)) {
                        throw 'Invalid ui.chart options attribute';
                    }
                }
                elem.jqplot(data, opts);
            };
            scope.$watch(attrs.uiChart, function() {
                renderChart();
            }, true);

            scope.$watch(attrs.chartOptions, function() {
                renderChart();
            });
        }
    };
});



app.directive('setCoordinates', ['$timeout', function ($timeout) {
    var def = {
        restrict: 'A',
        terminal: true,
        transclude: false,
        link: function (scope, element, attrs) {
            debugger;
            $timeout(resizePointer(scope), 0);  //Calling a scoped method
        }
    };
    return def;
}]);


app.directive('tabDetail', function () {
    return {
        compile: function (tElement, tAttrs) {
            console.log('tabDetail-compile:', tAttrs.disabled);
            return function link(scope, iElement, iAttrs) {
                console.log('tabDetail-link:', iAttrs.disabled);
                
                iAttrs.$observe('disabled', function (value)
                {
                    if(value == false)
                        console.log('tabDetail disabled:', value);
                    
                }
              );
               
            };
        }
    };
});


app.directive('busqueda', function () {


    function link(scope, element, attrs) {



        scope.$watch(function () {
            return element.attr('style');
        }, function (newValue, oldValue) {
            var elmnt1 = document.getElementById("GraphResults").offsetHeight;
            if (elmnt1 !=0)
            { // Values will be equal on initialization
                resizePointer3(scope);
                
                console.log('class has changed to: ' + newValue);
            }
        });
    }

    return {
        link: link
    };
});
