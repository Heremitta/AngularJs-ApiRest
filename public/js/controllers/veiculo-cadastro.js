angular.module('ProjetoTeste').controller('VeiculosCadastroController', function($scope,recursoVeiculo,recursoCidades,$resource,autoComplete) {
    $scope.veiculos = [];
    $scope.veiculo = {};
    $scope.mensagem = '';
    var cidadeVeiculo = {};
    if(todasCidades.length == 0){
        recursoCidades.buscaCidades(function(resolve){
            if(todasCidades.length == 0){
                resolve.forEach(cidadeBusca =>{
                    todasCidades.push(cidadeBusca)
                })
            }else{
                todasCidades.forEach(e=>{
                    console.log(e)
                    etiqueta:
                    for(var i = 0; i < resolve.lenght; i++){
                        if(Object.is(e.id,resolve[i].id)){
                            index = resolve.indexOf(resolve[i]);
                            resolve.splice(index,1);
                            break etiqueta;
                        }else{
                            todasCidades.push(r)
                        }
                    }
                })
            }
        }, function(erro){
            console.log(erro)
        })
    }
    $scope.todasCidades = todasCidades;
    $scope.submeter = function(veiculo){
        
        if($scope.validaVeiculo(veiculo)){
            outraetiqueta: for(var i =0; i< todasCidades.length;i++){
                var cidadeDoArray = $scope.removeAcentos(todasCidades[i].nome);
                var cidadeDoVeiculo = $scope.removeAcentos(veiculo.cidade.nome);
                if(Object.is(cidadeDoArray ,cidadeDoVeiculo)){
                    cidadeVeiculo = todasCidades[i];
                    veiculo.cidade = todasCidades[i].id;
                    break outraetiqueta;
                }
            }
            veiculo.cidade = $scope.veiculo.cidade;
            console.log(veiculo)
            recursoVeiculo.cadastrar(veiculo, function(result){
                veiculo.cidade =cidadeVeiculo;
                
                veiculo.id = result.id;
                $scope.veiculos.push(veiculo);
                $scope.mensagem = 'Veiculo de placa ' + veiculo.placa + ' Cadastrado com sucesso!';
            }, function(erro){
                console.log(erro);
                $scope.mensagem = 'Não foi possivel cadastrar o veiculo de placa' + veiculo.placa;
            });
        }
    }
    $scope.buscaCidadePorNome = function(cidade){
        var buscaCidade = $resource(config.URL_REQUISICAO_CIDADES+"?q=:cidadeNome", {cidadeNome:cidade},{
            buscar:{
                method: "GET",
                isArray: true
            }
        })
        return buscaCidade.buscar(function(result){
            return result[0] ;

        },function(erro){
            console.log(erro);
            $scope.mensagem = "ocorreu um erro. "+erro;
        })
    }
    $scope.checkB = function(classe){
        checkBoxs = document.querySelectorAll("."+classe);
        checkBoxs.forEach(elemento =>{
            if(elemento.checked == true){
                elemento.checked == false;
            }
        })
    }
    $scope.validaVeiculo = function (veiculo){
        return $scope.validaEmail(veiculo.email) &&
                $scope.validaPlaca(veiculo.placa) &&
                $scope.validaKm(veiculo.km_rodado)
    }
    $scope.validaPlaca = function(placa){
        // ** inplementado apenas se a placa é valida ou não, porém poderia também dizer que tipo de placa é 
        // var resposta = "placa inválida";
        var resposta = 0;
        if(config.regexPlaca.test(placa)){
            // resposta = "Placa válida no formato atual brasileiro";
            resposta = 1;
            $scope.mensagem = "placa padrão brasileiro"
        }
        if(config.regexPlacaMercosulCarro.test(placa)){
            // resposta = "Placa válida (padrão Mercosul - carro)";
            resposta = 2;
            $scope.mensagem = "placa padrão mercosul"
        }
        if(config.regexPlacaMercosulMoto.test(placa)){
            // resposta = "Placa válida (padrão Mercosul - moto)";
            resposta = 3;
            $scope.mensagem = "placa de moto padrão mercosul"
        }
        return resposta;
    }
    $scope.validaEmail = function(field) {
        console.log(field)
        var usuario = field.substring(0, field.indexOf("@"));
        var dominio = field.substring(field.indexOf("@")+ 1, field.length);
        if ((usuario.length >=1) &&
            (dominio.length >=3) && 
            (usuario.search("@")==-1) && 
            (dominio.search("@")==-1) &&
            (usuario.search(" ")==-1) && 
            (dominio.search(" ")==-1) &&
            (dominio.search(".")!=-1) &&      
            (dominio.indexOf(".") >=1)&& 
            (dominio.lastIndexOf(".") < dominio.length - 1)) {
            return true
        }
        else{
            return false
        }
    }
    $scope.validaKm = function(km){
        return (!isNaN(km) && (km >= 0));
    }
    $scope.removeAcentos = function (text){       
        text = text.toString().toLowerCase();                                                         
        text = text.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
        text = text.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
        text = text.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
        text = text.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
        text = text.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
        text = text.replace(new RegExp('[Ç]','gi'), 'c');
        return text;                 
    }
    $scope.change = function(array){
        var cidades = [];
        array.forEach(e=>{
            cidades.push(e.nome)
        })
        autoComplete(document.querySelector("#cidade"), cidades);
    }
  });