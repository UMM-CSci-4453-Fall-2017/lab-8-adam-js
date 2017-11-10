angular.module('buttons',[])
	.controller('buttonCtrl',ButtonCtrl)
	.factory('buttonApi',buttonApi)
	.constant('apiUrl','http://localhost:1337'); // CHANGED for the lab 2017!

function ButtonCtrl($scope,buttonApi){
	$scope.buttons=[]; //Initially all was still
	$scope.errorMessage='';
	$scope.isLoading=isLoading;
	$scope.refreshButtons=refreshButtons;
	$scope.buttonClick=buttonClick;
	$scope.currenT=[];
	$scope.total= 0;
	$scope.prices=[];

	var loading = false;

	function isLoading(){
		return loading;
	}

	function refreshButtons(){
		loading=true;
		$scope.errorMessage='';
		buttonApi.getButtons()
			.success(function(data){
				$scope.buttons=data;
				loading=false;
			})
			.error(function () {
				$scope.errorMessage="Unable to load Buttons:  Database request failed";
				loading=false;
			});
		buttonApi.getPrices()
			.success(function(data){
				$scope.prices=data;
				loading = false;
			})
			.error(function (){
				$scope.errorMessage="Unable to load Prices: Database request failed";
			});
	}

	function buttonClick($event){
		$scope.errorMessage='';
		buttonApi.clickButton($event.target.id)
			.success(function(){refreshTrans()})
			.error(function(){$scope.errorMessage="Unable click";});

	}

	refreshButtons();

	// function changeUser(username, password){
	//	$scope.username = username;
	//	$scope.password = password;
	//	buttonApi.changeUser(username,password);
	//	.success(function(){})
	//		.error(function(){$scope.errorMessage="Unable to change user";});
	//}
}

function buttonApi($http,apiUrl){
	return{
		getButtons: function(){
			var url = apiUrl + '/buttons';
			return $http.get(url);
		},
		clickButton: function(id){
			var url = apiUrl+'/click?id='+id;
			//      console.log("Attempting with "+url);
			return $http.get(url); // Easy enough to do this way
		},
		removeItem: function(id) {
			var url = apiUrl + '/removeItem/'+id;
			return $http.get(url);
		},
		totalAmount: function(){
			var url = apiUrl + '/total';
			console.log("Attempting with "+url);
			return $http.get(url);
		},
		DeleteButton: function(){
			var url = apiUrl + '/delete';
			console.log("Attempting with "+url);
			return $http.post(url);
		},
		getPrices: function(){
			var url = apiUrl +'/prices';
			return $http.get(url);
		}
	}
}

