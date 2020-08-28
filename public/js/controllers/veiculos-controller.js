angular.module('ProjetoTeste').controller('VeiculosController', function ($scope, recursoVeiculo, recursoCidades, $resource, autoComplete) {
    $scope.veiculos = [];
    $scope.veiculo = {};
    $scope.filtro = '';
    $scope.mensagem = {};
    $scope.isDisabled = true;
    $scope.todasCidades = todasCidades
    recursoCidades.buscaCidades(function (resolve) {
        if (todasCidades.length == 0) {
            resolve.forEach(cidadeBusca => {
                todasCidades.push(cidadeBusca)
            })
        } else {
            todasCidades.forEach(e => {
                console.log(e)
                etiqueta:
                for (var i = 0; i <= resolve.lenght; i++) {
                    if (Object.is(e.id, resolve[i].id)) {
                        resolve.splice(resolve[i], 1);
                        break etiqueta;
                    } else {
                        todasCidades.push(resolve[i])
                    }
                }
            })

        }
        $scope.renderizaVeiculos();
    }, function (erro) {
        console.log(erro)
    })
    console.log($scope.veiculos)
    $scope.renderizaVeiculos = function () {
        recursoVeiculo.query(function (veiculos) {
            for (var i = 0; i < veiculos.length; i++) {
                aqui:
                var achou = false;
                for (var j = 0; j < todasCidades.length; j++) {
                    var cidadeDoArray = $scope.removeAcentos(todasCidades[j].id);
                    var cidadeDoVeiculo = $scope.removeAcentos(veiculos[i].cidade);
                    if (Object.is(cidadeDoArray, cidadeDoVeiculo)) {
                        veiculos[i].cidade = angular.copy(todasCidades[j]);
                        achou = true
                    }
                    if (achou) break
                }
                if (!achou) veiculos[i].cidade = { id: 0, nome: "não cadastrado" }
                $scope.veiculos.push(veiculos[i]);

            }
        }, function (erro) {
            console.log(erro)
        });
    }

    $scope.buscaCidade = function (cidade) {
        var buscaCidade = $resource(config.URL_REQUISICAO_CIDADES + "?q=:cidadeId", { cidadeId: cidade }, {
            buscar: {
                method: "GET",
                isArray: true
            }
        })
        return buscaCidade.buscar(function (result) {
            return result
        }, function (Erro) {
            console.log(Erro)
        })
    }


    var urlVeiculoDelete = config.URL_REQUISICAO_VEICULOS + "/";

    $scope.remover = function (veiculo) {

        vec = $resource(urlVeiculoDelete + veiculo.id, null, {
            deletar: {
                method: "DELETE"
            }
        })
        var placa = veiculo.placa;
        var indiceVeiculo = $scope.veiculos.indexOf(veiculo);
        vec.deletar(veiculo.id, function (veiculo) {
            $scope.mensagem.texto = 'Veiculo com placa ' + placa + ' foi removido com sucesso!';
            $scope.mensagem.class = "info"
            console.log($scope.veiculos)
            console.log(veiculo)
            console.log(indiceVeiculo)
            $scope.veiculos.splice(indiceVeiculo, 1);
        }, function (erro) {
            console.log(erro);
            $scope.mensagem.texto = 'Não foi possivel remover veiculo com placa ' + placa;
            $scope.class = "danger"
        });

        setTimeout(function () {
            $scope.mensagem.texto = '';
        }, 3000)
    }
    $scope.alterarVeiculo = function (veiculo) {
        var cidade = {};
        outraEtiqueta:
        for (var i = 0; i < todasCidades.length; i++) {
            var achou = false;
            var cidadeDoArray = $scope.removeAcentos(todasCidades[i].nome);
            var cidadeDoVeiculo = $scope.removeAcentos(veiculo.cidade.nome);
            if (Object.is(cidadeDoArray, cidadeDoVeiculo)) {
                cidade = Object.assign(todasCidades[i]);
                veiculo.cidade = todasCidades[i].id;
                achou = true;

            }
            if (achou) { break outraEtiqueta; }
        }
        vec = $resource(urlVeiculoDelete + veiculo.id, null, {
            alterar: {
                method: "PATCH"
            }
        })
        console.log(veiculo)
        vec.alterar(veiculo, function (result) {
            console.log(result)
            veiculo.cidade = cidade;
            $scope.mensagem.texto = 'Veiculo de placa ' + veiculo.placa + ' foi alterado com sucesso!';
            $scope.mensagem.class = "info";
        }, function (erro) {
            console.log(erro);
            $scope.mensagem.texto = 'Não foi possivel alterar veiculo de placa' + veiculo.placa;
            $scope.mensagem.class = "danger"
        })
    }


    $scope.botaoAlterar = function () {
        $scope.isDisabled = !$scope.isDisabled;
    }
    $scope.removeAcentos = function (text) {
        text = text.toString().toLowerCase();
        text = text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
        text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
        text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
        text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
        text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
        text = text.replace(new RegExp('[Ç]', 'gi'), 'c');
        return text;
    }
    $scope.changeId = function (el, obj) {
        var cidades = [];
        todasCidades.forEach(e => {
            cidades.push(e.nome)
        })

        autoComplete(document.querySelectorAll(".cidades" + el)[0], cidades, obj);

    }

    $scope.modal = function () {
        document.querySelector(".modal").classList.toggle("hidden")
    }
    document.querySelector(".modal").addEventListener("click", function (event) {
        if (event.target.classList.contains("modal") || event.target.classList.contains("close") || event.target.classList.contains("fechar")) {
            document.querySelector(".modal").classList.toggle("hidden")
        }
    })

    $scope.submeter = function (veiculo, formulario) {

        if ($scope.validaVeiculo(veiculo)) {
            outraetiqueta: for (var i = 0; i < todasCidades.length; i++) {
                var cidadeDoArray = $scope.removeAcentos(todasCidades[i].nome);
                var cidadeDoVeiculo = $scope.removeAcentos(veiculo.cidade.nome);
                if (Object.is(cidadeDoArray, cidadeDoVeiculo)) {
                    cidadeVeiculo = todasCidades[i];
                    veiculo.cidade = todasCidades[i].id;
                    break outraetiqueta;
                }
            }
            veiculo.cidade = $scope.veiculo.cidade;
            console.log(veiculo)
            recursoVeiculo.cadastrar(veiculo, function (result) {
                veiculo.cidade = cidadeVeiculo;

                veiculo.id = result.id;
                $scope.veiculos.push(veiculo);
                $scope.mensagem.texto = 'Veiculo de placa ' + veiculo.placa + ' Cadastrado com sucesso!';
                $scope.mensagem.class = "info";
                setTimeout(function () { $scope.resetForm(formulario); }, 3000);

            }, function (erro) {
                console.log(erro);
                $scope.mensagem.texto = 'Não foi possivel cadastrar o veiculo de placa' + veiculo.placa;
                $scope.mensagem.class = "danger"
            });
        }
    }
    $scope.resetForm = function (formulario) {
        var form = $scope[formulario];
        form.$setUntouched();
        form.$setPristine();
        $scope.mensagem.texto = '';
        $scope.veiculo = {}
        document.querySelector(".modal").click()
    }
    $scope.buscaCidadePorNome = function (cidade) {
        var buscaCidade = $resource(config.URL_REQUISICAO_CIDADES + "?q=:cidadeNome", { cidadeNome: cidade }, {
            buscar: {
                method: "GET",
                isArray: true
            }
        })
        return buscaCidade.buscar(function (result) {
            return result[0];

        }, function (erro) {
            console.log(erro);
            $scope.mensagem.texto = "ocorreu um erro. " + erro;
            $scope.mensagem.class = "danger"
        })
    }
    $scope.checkB = function (classe) {
        checkBoxs = document.querySelectorAll("." + classe);
        checkBoxs.forEach(elemento => {
            if (elemento.checked == true) {
                elemento.checked == false;
            }
        })
    }
    $scope.validaVeiculo = function (veiculo) {
        return $scope.validaEmail(veiculo.email) &&
            $scope.validaPlaca(veiculo.placa) &&
            $scope.validaKm(veiculo.km_rodado)
    }
    $scope.validaPlaca = function (placa) {
        // ** inplementado apenas se a placa é valida ou não, porém poderia também dizer que tipo de placa é 
        // var resposta = "placa inválida";
        var resposta = 0;
        if (config.regexPlaca.test(placa)) {
            // resposta = "Placa válida no formato atual brasileiro";
            resposta = 1;
            $scope.mensagem.texto = "placa padrão brasileiro"
            $scope.mensagem.class = "info"
        }
        if (config.regexPlacaMercosulCarro.test(placa)) {
            // resposta = "Placa válida (padrão Mercosul - carro)";
            resposta = 2;
            $scope.mensagem.texto = "placa padrão mercosul"
            $scope.mensagem.class = "info"
        }
        if (config.regexPlacaMercosulMoto.test(placa)) {
            // resposta = "Placa válida (padrão Mercosul - moto)";
            resposta = 3;
            $scope.mensagem.texto = "placa de moto padrão mercosul"
            $scope.mensagem.class = "info"
        }
        if (resposta == 0) {
            $scope.mensagem = "Placa inválida, tente novamente!"
            setTimeout(function () { $scope.mensagem = ""; }, 3000);
        }
        return resposta;
    }
    $scope.validaEmail = function (field) {
        console.log(field)
        var usuario = field.substring(0, field.indexOf("@"));
        var dominio = field.substring(field.indexOf("@") + 1, field.length);
        if ((usuario.length >= 1) &&
            (dominio.length >= 3) &&
            (usuario.search("@") == -1) &&
            (dominio.search("@") == -1) &&
            (usuario.search(" ") == -1) &&
            (dominio.search(" ") == -1) &&
            (dominio.search(".") != -1) &&
            (dominio.indexOf(".") >= 1) &&
            (dominio.lastIndexOf(".") < dominio.length - 1)) {
            return true
        }
        else {
            return false
        }
    }
    $scope.validaKm = function (km) {
        return (!isNaN(km) && (km >= 0));
    }
    $scope.removeAcentos = function (text) {
        text = text.toString().toLowerCase();
        text = text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
        text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
        text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
        text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
        text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
        text = text.replace(new RegExp('[Ç]', 'gi'), 'c');
        return text;
    }
    $scope.change = function (array, obj) {

        var cidades = [];
        array.forEach(e => {
            cidades.push(e.nome)
        })
        autoComplete(document.querySelector("#cidade"), cidades, obj);
        console.log(document.querySelector("#cidade").value)

    }
});