'use strict';

angular.module('mcApp')
  .controller('TabsDemoCtrl', function ($scope, $window, $uibModal, $log, $http, goals, models, users, cashFlows) {
  
    $scope.oneAtATime = false;

    $scope.radioFedTax = 'User Provided';
    $scope.radioStateTax = 'User Provided';
    $scope.radioCapGain = 'User Provided';

    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };

      $scope.tabs = [
        { title:'Dynamic Title 1', content:'Dynamic content 1' },
        { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
      ];


    //Declare all of the big scope objects here shared from their factories
    $scope.goals = goals;
    $scope.user = users;
    $scope.models = models;
    $scope.cashFlows = cashFlows;

    $scope.megaJSON = {};

    $scope.megaJSONGenerator = function(g,u,m,cf,mJ){
        mJ = {
            "goals": g,
            "users": u,
            "models": m,
            "flows": cf
        };

        $scope.megaJSON = mJ;  
    };

    $scope.riskReturnSetter = function(data,mod){
        //take the index (i) to get risk and return from the selected json (data)
        //and apply it to the in scope data (mod)
        for(var i = 0; i < data.length;i++){
            if(data[i].name === mod.name){
                mod.ret = data[i].ret;
                mod.risk = data[i].risk;
                mod.pctOrdInc = data[i].pctOrdInc;
            }
        }
        return mod;
    };  

    $scope.populateGoals = function(gObj){
        gObj.goals = [];
        for(var i = 0; i < gObj.numGoals;i++){
            var str =  'goal' + String(i);
            var numI = String(i+1);
            gObj.goals.push({
                name:str,
                num:numI

            });
        }
        return gObj;
    };

    $scope.populateModels = function(mObj){
        mObj.models = [];
        for(var i = 0; i < mObj.numModels;i++){
            var str =  'model' + String(i);
            var numI = String(i+1);
            mObj.models.push({
                name:str,
                num:numI

            });
        }
        return mObj;
    };

    
    
    $scope.Math = window.Math;
    $scope.year = new Date().getFullYear();

    $scope.renderFlows = function(cfObj,uObj){
        //JS is a little crazy sometimes
        cfObj.simulation.length = 0;

        var calcGreaterAge = function(uObj){
            if(uObj.numUsers==1){
                return uObj.c1.dod;
            } else if(uObj.c1.dod>=uObj.c2.dod){
                return uObj.c1.dod;
            }else{
                return uObj.c2.dod;
            }
        };
        
        var greaterAge = calcGreaterAge(uObj);

        var ageClient = function(start,iter,end){
            if(Number(end)>=Number(iter)){
                return (Number(start)+Number(iter));
            }
        };

        var pretest = function(uObj,i){
            if (typeof(uObj)==='undefined'){
                return undefined;
            } else {
                return ageClient(uObj.age,i,uObj.dod);        
            }
        };

        var calcAnnualExpenses = function(uO,i){
            //Test if this caluclation is for one or two clients
            var exp1 = 0;
            var exp2 = 0;
            if(uO.numUsers==1){
                //One valid user - now test if client has
                //started taking withdrawals
                var yearOfWithdrawl = uO.c1.firstWithdrawal-uO.c1.age;
                // i is present simYear, dod is sim year of death
                // if i is between firstWithdrawlYear and dod, take expense
                if(i>= yearOfWithdrawl && i<= uO.c1.dod){
                    exp1 = uO.c1.expenses;
                }
                return exp1;

            }else if(uO.numUsers==2){
                var yOW1 = uO.c1.firstWithdrawal-uO.c1.age;
                var yOW2 = uO.c2.firstWithdrawal-uO.c2.age;
                //Set default expenses
                if(i>= yOW1 && i<= uO.c1.dod){
                    exp1 = uO.c1.expenses;
                }
                if(i>= yOW2 && i<= uO.c2.dod){
                    exp2 = uO.c2.expenses;
                }
                return (exp1+exp2);
            }else{
                return undefined;
            }
        };

        var calcAnnualAdditions = function(uO,i,cl){
            //Function accepts the giant user object
            //i, the year in the simulation, and cl
            //a number from 1 to 3 representing the tax
            //status of the inflows
            var investName = '';
            var additionName = '';
            var additionTime = '';
            var addition1 = 0;
            var addition2 = 0;

            if(cl===1){
                investName = 'taxInvest';
                additionName = 'taxAddition';
                additionTime = 'numTaxAddition';
            }else if(cl===2){
                investName = 'taxAdvInvest';
                additionName = 'taxAdvAddition';
                additionTime = 'numTaxAdvAddition';
            }else if(cl===3){
                investName = 'taxPostInvest';
                additionName = 'taxPostAddition';
                additionTime = 'numTaxPostAddition';
            }

            if(uO.numUsers==1){
                if(i===0){
                    //Year one include initial with
                    addition1 = uO[investName] + uO.c1[additionName];
                } else if(i<=uO.c1[additionTime]){
                    addition1 = uO.c1[additionName];
                }
            }else if((uO.numUsers==2)){
                if(i===0){
                    //Year one include initial with
                    addition1 = uO[investName] + uO.c1[additionName];
                    addition2 = uO.c2[investName] + uO.c2[additionName];
                }
                if(i<=uO.c1[additionTime]){
                    addition1 = uO.c1[additionName];
                }
                if(i<=uO.c2[additionTime]){
                    addition2 = uO.c2[additionName];
                }
            }
            return (addition1+addition2);
        };

        if (greaterAge>0){
            for(var i=0;i<=greaterAge;i++){
                
                var cl1ChartAge = pretest(uObj.c1,i);
                var cl2ChartAge = pretest(uObj.c2,i);
                var exp = calcAnnualExpenses(uObj,i);
                var inf = Math.pow((uObj.inflation)+1,i);
                var taxInflows = calcAnnualAdditions(uObj,i,1);
                var taxAdvInflows = calcAnnualAdditions(uObj,i,2);
                var taxPostInflows = calcAnnualAdditions(uObj,i,3);

                cfObj.simulation.push({simYear:i,
                    cl1: cl1ChartAge,
                    cl2: cl2ChartAge,
                    taxInv: taxInflows,
                    taxAdvInv: taxAdvInflows,
                    taxPostInv: taxPostInflows,
                    infl: inf,
                    presExp: exp,
                    inflExp:(exp*inf)
                });
            }
        }
        return cfObj;
    };
    $scope.yearsToLive = function(uObj){
        uObj.dod = (uObj.deathAge - uObj.age);
        return uObj;
    };

    $http.get('/views/states.json')
        .then(function(response) {
            $scope.states = response.data;
        });

    //Recode this to only make call on demand
    $http.get('/views/defaultStrategies.json')
        .then(function(response){
            $scope.strats = response.data;
        });

    //Recode this to only make call on demand
    $http.get('/views/assetSchema.json')
        .then(function(response){
            $scope.assetClasses = response.data;
        });


});
