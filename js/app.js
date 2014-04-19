(function () {
    window.app = angular.module('banker',[]);

    app.controller('gameCtrl', function ($scope, globalFuncs) {
    	$scope.newPlayer = '';
    	$scope.players = [];
        $scope.amount = '';
        $scope.gameStarted = false;
        $scope.alertText = '';

    	$scope.addPlayer = function (banker) {
            var name;
            name = banker ? 'bank' : $scope.properCase($scope.newPlayer);

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

        $scope.properCase = function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1)
        }

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
            globalFuncs.alert($scope, message);
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
            }
        };

        $scope.pay = function () {
            var payees, canAfford, bankerIndex, amount, names;
            amount = Math.abs($scope.amount);

            bankerIndex = $scope.players.length - 1;
            payers = [];
            payees = [];

            for (var i = bankerIndex; i >= 0; i--) {
                if ($scope.players[i].pay) {
                    payers.push(i);
                }
            }

            for (var i = bankerIndex; i >= 0; i--) {
                if ($scope.players[i].recieve) {
                    payees.push(i);
                }
            }

            if (!payees.length) {
                $scope.alert('You must select a card or cards that will receive the money');
                return false;
            }

            if (!payers.length) {
                $scope.alert('You must select a card or cards that will pay');
                return false;
            };

            names = $scope.checkBalance(payers, payees.length, amount, bankerIndex)

            if (names) {
                $scope.alert(names + ' cannot afford that.');
                return false;
            }

            for (var i = payees.length - 1; i >= 0; i--) {
                if (payees[i] !== bankerIndex) {
                    $scope.players[payees[i]].money += (amount * payers.length);
                }

                $scope.players[payees[i]].recieve = false;
            };

            for (var i = payers.length - 1; i >= 0; i--) {
                if (payers[i] !== bankerIndex) {
                    $scope.players[payers[i]].money -= (amount * payees.length);
                }

                $scope.players[payers[i]].pay = false;
            };

            $scope.amount = '';
        }

        $scope.checkBalance = function (payers, numOfPayees, amount, bankerIndex) {
            var names = [];
            for (var i = payers.length - 1, payer; i >= 0; i--) {
                payer = payers[i];
                if (payer !== bankerIndex && $scope.players[payer].money < (numOfPayees * amount)) {
                    names.push($scope.players[payer].name);
                }
            }

            if (names.length) {

                if (names.length > 1) {
                    names[names.length - 1] = 'and ' + names[names.length - 1];
                }

                if (names.length > 2) {
                    names = names.join(', ');
                } else {
                    names = names.join(' ');
                }

                return names
            } else {
                return false
            };
        }

        $scope.removePlayer = function (player) {
            $scope.players.splice(player, 1)
        };

        $scope.start = function () {

            if ($scope.players.length < 2) {
                $scope.alert('Please add two or more players.');
                return false;
            };

            $scope.gameStarted = true;
            $scope.addPlayer(true); //add banker
        }
    });

    app.directive('closeAlert', function () {
        return {
            restrict: "A",
            link: function (scope, element, attributes) {
                element.bind('click', function (e) {
                    scope.alertText = '';
                    scope.$apply();
                });
            }
        }
    });

    app.factory('globalFuncs', function() {
        return {
            alert: function alert ($scope, text) {
                $scope.alertText = text;

                window.setTimeout(function () {
                    $scope.alertText = '';
                    $scope.$apply();
                }, 2000);
            }
        };
    });
})();