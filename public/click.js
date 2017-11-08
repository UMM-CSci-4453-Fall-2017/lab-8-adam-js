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
	}
	function buttonClick($event){
		$scope.errorMessage='';
		buttonApi.clickButton($event.target.id)
			.success(function(currenT){
			$scope.currenT = currenT;
			$scope.total = TotalAmount(curenT)
			})
			.error(function(){$scope.errorMessage="Unable click";});
	}
	refreshButtons();  //make sure the buttons are loaded

}
function changeUser(username, password){
	$scope.username = username;
	$scope.password = password;
	buttonApi.changeUser(username,password);
	.success(function(){})
		.error(function(){$scope.errorMessage="Unable to change user";});
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
		}
	};
}

