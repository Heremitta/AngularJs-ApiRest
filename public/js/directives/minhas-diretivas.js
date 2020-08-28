angular.module('minhasDiretivas', [])
    .directive('meuPainel', function () {
        var ddo = {};
        ddo.restrict = "AE";

        ddo.scope = {
            titulo: '@'
        };
        ddo.transclude = true;
        ddo.templateUrl = 'js/directives/templates/meu-painel.html';

        return ddo;
    }).directive('meuBotaoPerigo', function () {
        var ddo = {};
        ddo.restrict = "E";

        ddo.scope = {
            nome: '@',
            acao: '&'
        }
        ddo.template = '<button ng-click="acao(veiculo)" class="btn btn-danger btn-block apagar mb-1">{{nome}}</button>'

        return ddo;
    })
    .directive('headerPrincipal', function () {
        var ddo = {};
        ddo.restrict = "E";

        ddo.scope = {
            // endereco : '=',
            // acao : '&',
            // remove : '=',
            // check : '='
        };
        ddo.transclude = true;
        ddo.templateUrl = 'js/directives/templates/headerPrincipal.html';

        return ddo;
    })