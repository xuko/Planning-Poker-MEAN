(function() {
  'use strict';

  angular
    .module('games')
    .controller('PlayController', PlayController);

  PlayController.$inject = ['$scope', '$state', 'Authentication', 'gameResolve'];

  function PlayController($scope, $state, Authentication, game) {
    var vm = this;
    vm.game = game;
    $scope.ustories = vm.game.ustories;
    $scope.cards=[{"id":0,"display":"0","selected":false},{"id":1,"display":"1/2","selected":false},{"id":2,"display":"1","selected":false},{"id":3,"display":"2","selected":false},{"id":4,"display":"3","selected":false},{"id":5,"display":"5","selected":false},{"id":6,"display":"8","selected":false},{"id":7,"display":"13","selected":false},{"id":8,"display":"20","selected":false},{"id":9,"display":"40","selected":false},{"id":10,"display":"100","selected":false},{"id":11,"display":"?","selected":false},{"id":12,"display":"∞","selected":false},];
    $scope.actual = 0;
    $scope.selectedCard = null;


    $scope.selectItem = function(selectedItem){
      for(var i = 0; i < $scope.cards.length; i++){
          var item = $scope.cards[i];
          if(item.id == selectedItem.id){
              item.selected = !item.selected;
              if(item.selected==true){
                $scope.selectedCard = item;
              }
              else{
                $scope.selectedCard = null;
              }
          }else {
              item.selected = false;
          }
      }
    }

    $scope.unselectItems = function(){
      for(var i = 0; i < $scope.cards.length; i++){
          $scope.cards[i].selected = false;
          $scope.selectedCard = null;
      }
    }

    $scope.nextUstory = function(){
      $scope.ustories[$scope.actual].values.push({
        user: user,
        value: $scope.selectedCard.display
    });
      vm.game.ustories=$scope.ustories;
      vm.game.$update();
      if($scope.ustories[$scope.actual+1]==$scope.ustories.lenght){
        $state.go('games.view', {
          gameId: vm.game._id
        });
      }
      $scope.unselectItems();
      $scope.actual++;
    }

    init();

    function init() {

    for (var i = 0; i < $scope.ustories.length ; i++) {
      $scope.ustories[i].values= [];
    }
    }
  }
})();
