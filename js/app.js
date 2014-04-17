(function () {
    window.app = angular.module('banker',[]);

    app.controller('gameCtrl', function ($scope, globalFuncs) {
    	$scope.newPlayer = '';
    	$scope.players = [];

    	$scope.addPlayer = function (banker) {
            var name;
            name = banker ? 'banker' : $scope.newPlayer.toLowerCase();

            if (name !== '' && $scope.isAlreadyPlaying(name)) {
                $scope.players[$scope.players.length] = {
                    name: name,
                    money: banker ? false : 2000000,
                    recieve: false,
                    pay: false
                }

                $scope.newPlayer = '';
            }
    	};

        $scope.isAlreadyPlaying = function (name) {
            var isUnique = true;

            for (var player in $scope.players) {
                if ($scope.players[player].name === name) {
                    isUnique = false;
                }
            }

            return isUnique;
        };

        $scope.alert = function (message) {
            globalFuncs.alert(message);
        };

        $scope.setRecieve = function (index) {
            $scope.players[index].recieve = !$scope.players[index].recieve;

            if ($scope.players[index].recieve) {
                $scope.players[index].pay = false;
            }
        };

        $scope.setPay = function (index) {
            $scope.players[index].pay = !$scope.players[index].pay;

            if ($scope.players[index].pay) {
                $scope.players[index].recieve = false;

                for (var i = $scope.players.length - 1; i >= 0; i--) {
                    if (i !== index) {
                        $scope.players[i].pay = false;
                    };
                };
            }
        };

        $scope.pay = function (amount, playerIndex) {
            var payees, canAfford;
            payees = []
            for (var i = $scope.players.length - 1; i >= 0; i--) {
                if ($scope.players[i].recieve) {
                    payees.push(i);
                }
            }
                console.log(payees.length);
            if (!payees.length) {
                $scope.alert('You must select 1 or more payees');
            }

            if (playerIndex !== 0) {
                canAfford = $scope.checkBalance(playerIndex, payees.length, amount);
            };

            if (!canAfford) {
                return false;
            }

            for (var i = payees.length - 1; i >= 0; i--) {
                if (payees[i] !== 0) {
                    $scope.players[payees[i]].money += amount;
                }

                if (playerIndex !== 0) {
                    $scope.players[playerIndex].money += -amount;
                }

                $scope.players[payees[i]].recieve = false;
            };

            $scope.players[playerIndex].pay = false;
        }

        $scope.checkBalance = function (playerIndex, numOfPeople, amount) {
            if ($scope.players[playerIndex].money >= (numOfPeople * amount)) {
                return true;
            } else {
                $scope.alert("Player can't afford that")
                return false;
            }
        }

        $scope.removePlayer = function (player) {
            $scope.players.splice(player, 1)
        };

        $scope.addPlayer(true); //add banker

    });

    app.directive('payout', function () {
        return {
            restrict: "A",
            link: function (scope, element, attributes) {
                element.bind('click', function (e) {
                    var $playerDiv;

                    $playerDiv = $("#" + $(this).data('player'));

                    $playerDiv.toggleClass('payout-on');
                });
            }
        }
    });

    app.factory('globalFuncs', function() {
        return {
            alert: function(text) {
                alert(text);
            }
        };
    });
})();