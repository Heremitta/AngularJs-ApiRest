var app = angular.module('ProjetoTeste', ['minhasDiretivas','ngAnimate','ngRoute','meusServicos'])
.config(function($routeProvider, $locationProvider){

    $locationProvider.html5Mode(true);

    $routeProvider.when('/veiculos',{
        templateUrl:'partials/veiculos.html',
        controller:'VeiculosController'
    })
    $routeProvider.when('/veiculos/novo',{
        templateUrl:'partials/veiculos-novo.html',
        controller:'VeiculosCadastroController'
    })
    
    $routeProvider.otherwise({redirectTo:'/veiculos'});
})