var app = angular.module('ProjetoTeste', ['minhasDiretivas','ngAnimate','ngRoute','meusServicos'])
.config(function($routeProvider, $locationProvider){

    $locationProvider.html5Mode(true);

    $routeProvider.when('/veiculos',{
        templateUrl:'partials/veiculos.html',
        controller:'VeiculosController'
    })
    
    $routeProvider.otherwise({redirectTo:'/veiculos'});
})