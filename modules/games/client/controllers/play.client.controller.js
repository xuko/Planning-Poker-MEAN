(function() {
    'use strict';

    angular
        .module('games')
        .controller('PlayController', PlayController);

    PlayController.$inject = ['$scope', '$state', 'Authentication', 'gameResolve'];

    function PlayController($scope, $state, Authentication, game) {

        var vm = this;
        vm.game = game;
        var socket = io.connect('http://localhost:3000/games/5710128b1b3f0c2818a9cdb4/play');
        $scope.ustories = vm.game.ustories;
        $scope.allPlayers = false;
        $scope.cards = [{
            "id": 0,
            "display": "0",
            "value": 0,
            "selected": false
        }, {
            "id": 1,
            "display": "1/2",
            "value": 0.5,
            "selected": false
        }, {
            "id": 2,
            "display": "1",
            "value": 1,
            "selected": false
        }, {
            "id": 3,
            "display": "2",
            "value": 2,
            "selected": false
        }, {
            "id": 4,
            "display": "3",
            "value": 3,
            "selected": false
        }, {
            "id": 5,
            "display": "5",
            "value": 5,
            "selected": false
        }, {
            "id": 6,
            "display": "8",
            "value": 8,
            "selected": false
        }, {
            "id": 7,
            "display": "13",
            "value": 13,
            "selected": false
        }, {
            "id": 8,
            "display": "20",
            "value": 20,
            "selected": false
        }, {
            "id": 9,
            "display": "40",
            "value": 40,
            "selected": false
        }, {
            "id": 10,
            "display": "100",
            "value": 100,
            "selected": false
        }, {
            "id": 11,
            "display": "?",
            "value": "?",
            "selected": false
        }, {
            "id": 12,
            "display": "∞",
            "value": "∞",
            "selected": false
        }, ];
        $scope.actual = 0;
        $scope.selectedCard = null;


        $scope.selectItem = function(selectedItem) {
            for (var i = 0; i < $scope.cards.length; i++) {
                var item = $scope.cards[i];
                if (item.id == selectedItem.id) {
                    item.selected = !item.selected;
                    if (item.selected == true) {
                        $scope.selectedCard = item;
                    } else {
                        $scope.selectedCard = null;
                    }
                } else {
                    item.selected = false;
                }
            }
        }

        $scope.unselectItems = function() {
            for (var i = 0; i < $scope.cards.length; i++) {
                $scope.cards[i].selected = false;
                $scope.selectedCard = null;
            }
        }

        $scope.nextUstory = function() {
            $scope.addValue();
            $scope.unselectItems();
            $scope.actual++;
        }
        $scope.finish = function() {
            $scope.addValue();
            for (var i in vm.game.ustories){
              var sum = 0;
              var num = 0;
              for (var j in vm.game.ustories[i].values){
                if(vm.game.ustories[i].values[j].value != NaN){
                  sum += vm.game.ustories[i].values[j].value;
                  num++;
                }
              }
              vm.game.ustories[i].score = sum/num;
            }


            vm.game.ustories = $scope.ustories;
            vm.game.playersIn = [];
            vm.game.$update();
            $state.go('games.view', {
                gameId: vm.game._id
            });
        }

        $scope.addValue = function() {
          if(!$scope.existUserValue()){
            console.log("usuario no existe");
            $scope.ustories[$scope.actual].values.push({
                user: user,
                value: $scope.selectedCard.value
            });
            vm.game.ustories = $scope.ustories;
            vm.game.$update();
          }
            vm.game.ustories = $scope.ustories;
            vm.game.$update();

        }

        $scope.existUserValue = function() {
          for (var i in $scope.ustories[$scope.actual].values) {
            if ($scope.ustories[$scope.actual].values[i].user == user._id) {
              $scope.ustories[$scope.actual].values[i].value=$scope.selectedCard.value;
              return true;
            }
          }
          return false;
        }


        init();

        function init() {
          // if (contains(vm.game.playersIn, Authentication.user._id)) {
          //   vm.game.playersIn.push(Authentication.user._id);
          //   vm.game.$update();
          // }
          $scope.playersIn= ["sdfsdf","sdfsdffdsdf"];
          console.log(Authentication.user.username);
          socket.emit('adduser', Authentication.user.username);
        }
        function contains(array, element) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] == element) {
                    return false;
                }
            }
            return true;
        }



      	// on connection to server, ask for user's name with an anonymous callback
      	socket.on('connect', function(){
      		// call the server-side function 'adduser' and send one parameter (value of prompt)
      		socket.emit('adduser', prompt("What's your name?"));
      	});

      	// listener, whenever the server emits 'updatechat', this updates the chat body
      	socket.on('updatechat', function (username, data) {
//      		$('#conversation').append('<b>'+username + ':</b> ' + data + '<br>');
      	});

      	// listener, whenever the server emits 'updaterooms', this updates the room the client is in
      	socket.on('updaterooms', function(rooms, current_room) {
      		// $('#rooms').empty();
      		// $.each(rooms, function(key, value) {
      		// 	if(value == current_room){
      		// 		$('#rooms').append('<div>' + value + '</div>');
      		// 	}
      		// 	else {
      		// 		$('#rooms').append('<div><a href="#" onclick="switchRoom(\''+value+'\')">' + value + '</a></div>');
      		// 	}
      		// });
      	});

      	function switchRoom(room){
      		socket.emit('switchRoom', room);
      	}

      	// on load of page
      	// $(function(){
      	// 	// when the client clicks SEND
      	// 	$('#datasend').click( function() {
      	// 		var message = $('#data').val();
      	// 		$('#data').val('');
      	// 		// tell server to execute 'sendchat' and send along one parameter
      	// 		socket.emit('sendchat', message);
      	// 	});
        //
      	// 	// when the client hits ENTER on their keyboard
      	// 	$('#data').keypress(function(e) {
      	// 		if(e.which == 13) {
      	// 			$(this).blur();
      	// 			$('#datasend').focus().click();
      	// 		}
      	// 	});
      	// });
    }
})();
