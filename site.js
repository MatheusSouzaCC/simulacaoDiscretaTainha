
$(document).ready(function () {
    const mesesParaVirarAdulto = 42;
    const MAX_PEIXES_DESENHADOS = 300;
    var wto;
    var mesAtual = 1;
    var populacaoAtual = 0;
    var populacaoAdultos = 0;
    var populacaoFilhotes = 0;
    var periodoPescaFin;
    var periodoPescaIni;
    var timer;
    var tempoDecorrido = 0;
    var iniciado = false;
    var qtdDesenhada = 0;
    var gruposFilhotes = [];
    var permitidoPescaDeFilhotes = false;
    var qtdBarcos = 0;

    var rangeSlider = function () {
        var slider = $('.range-slider'),
            range = $('.range-slider__range'),
            value = $('.range-slider__value');

        slider.each(function () {

            value.each(function () {
                var value = $(this).prev().attr('value');
                $(this).html(value);
            });

            range.on('input', function () {
                $(this).next(value).html(this.value);
            });
        });
    };

    rangeSlider();

    $('#play').click(function () {
        $(this).prop('disabled', true);
        $('#stop').prop('disabled', false);
        $('#cog-parent').css('color', 'green');
        $('#cog-parent').get(0).lastChild.nodeValue = ' Rodando...';
        $('#cog').addClass('fa-spin');

        iniciar();
        iniciado = true;
    });

    $('#stop').click(function () {
        $(this).prop('disabled', true);
        $('#play').prop('disabled', false);
        $('#cog-parent').css('color', 'red');
        $('#cog-parent').get(0).lastChild.nodeValue = ' Parado';
        $('#cog').removeClass('fa-spin');

        parar();
        iniciado = false;
    });

    $('#velocidadeRange').change(function () {
        clearTimeout(wto);
        wto = setTimeout(function () {
            atualizaVelocidadeAnimacao($('#velocidadeRange').val());
        }, 100);

    });

    function atualizaVelocidadeAnimacao(velocidade) {
        if (iniciado) {
            var peixes = $('.fish-bob');
            switch (parseFloat(velocidade)) {
                case 1:
                    updateSpeed(peixes, 6, 30);
                    startTimer(3000);
                    break;
                case 2:
                    updateSpeed(peixes, 6, 10);
                    startTimer(1000);
                    break;
                case 3:
                    updateSpeed(peixes, 2, 5);
                    startTimer(500);
                    break;
                case 4:
                    updateSpeed(peixes, 1, 0.5);
                    startTimer(300);
                    break;
                case 5:
                    updateSpeed(peixes, 0.2, 0.2);
                    startTimer(100);
                    break;
            }
        }
    }

    function updateSpeed(peixes, tempoBob, tempoTransition) {
        $('.fish').css('transition', `${tempoTransition}s`);
        for (var index = 0; index < peixes.length; index++) {
            var element = peixes[index];
            $(element).css('animation', 'bob ' + tempoBob + 's infinite');
            $(element).css('animation-delay', `-${Math.random() * 1}s`);
        }
    }

    function retornarNomeMes(mes) {
        var date = new Date(mes + "/01/0000");
        var locale = "pt-br";
        return date.toLocaleString(locale, { month: "long" });
    }

    function atualizaMesAtual() {
        //atualiza o proximo mes
        if (mesAtual < 12) {
            mesAtual++;
        } else {
            mesAtual = 1;
        }

        $('#mesAtual').html(retornarNomeMes(mesAtual));

        atualizaTempoDecorrido();
    }

    function atualizaTempoDecorrido() {
        $("#tempoDecorrido").html(++tempoDecorrido);
    }

    function iniciar() {
        //remove os peixes do canvas
        removerPeixes();
        //reseta o grafico
        destruirGrafico();
        iniciarGrafico();
        //reseta contadores
        populacaoFilhotes = 0;
        $('#quantidadeFilhotes').html(0);
        $("#tempoDecorrido").html(tempoDecorrido = 0);
        qtdBarcos = $('#qtdBarcos').val();
        populacaoAtual = parseFloat($("#peixesIniciais").val());
        //iniciam todos adultos
        populacaoAdultos = populacaoAtual;
        qtdDesenhada = populacaoAtual;
        $('#populacao').html(populacaoAtual);
        $('#mesAtual').html(retornarNomeMes(mesAtual));
        $("#peixesIniciais").prop('disabled', true);
        //captura o valor do periodo de pesca
        periodoPescaIni = parseInt($('#periodoPescaIni').val());
        periodoPescaFin = parseInt($('#periodoPescaFin').val());
        //isso atribui a velocidade para 1 e chama o timer com 3 segundos
        $('#velocidadeRange').val('1');
        $('.range-slider__value').html('1');
        startTimer(3000);
        if (populacaoAtual < MAX_PEIXES_DESENHADOS) {
            spawnStartingFish(populacaoAtual);
        } else {
            spawnStartingFish(MAX_PEIXES_DESENHADOS);
        }

    }

    function parar() {
        clearInterval(timer);
        //reseta os contadores necessários
        mesAtual = 1;
        $("#peixesIniciais").prop('disabled', false);
    }

    function startTimer(mili) {
        clearInterval(timer);
        timer = setInterval(function () {
            atualizaGrafico(mesAtual, populacaoAtual);
            if (populacaoAtual >= 0.009) {

                pescar(qtdBarcos, permitidoPescaDeFilhotes);

                var sobreviventes = reproduzir(mesAtual, populacaoAdultos);

                envelhecerPeixes(gruposFilhotes);
                desenharPeixes(sobreviventes, 'filhote');
            }else{                
                //colocar em uma funcao
                $(this).prop('disabled', true);
                $('#play').prop('disabled', false);
                $('#cog-parent').css('color', 'red');
                $('#cog-parent').get(0).lastChild.nodeValue = ' Parado';
                $('#cog').removeClass('fa-spin');
                parar();
                iniciado = false;
            }
            atualizaMesAtual();
        }, mili);
    }

    function reproduzir(mes, adultos) {
        var sobreviventes = 0;
        //somente se tiver adultos
        if (adultos > 0) {
            //reproduz entre abril e julho      
            if (mes >= 4 && mes <= 7) {
                sobreviventes = populacaoAdultos * 0.65  / 4;// aqui vai a formula
                atualizaPopulacao(sobreviventes, 'filhotes', '+');
                gruposFilhotes.push({ qtd: sobreviventes, idade: 0 });
            }
        }
        return sobreviventes;
    }

    function envelhecerPeixes(gruposDePeixes) {
        if (gruposDePeixes.length > 0) {
            for (var index = 0; index < gruposDePeixes.length; index++) {
                var grupo = gruposDePeixes[index];
                if (grupo.idade == mesesParaVirarAdulto) {
                    let novosAdultos = grupo.qtd;
                    //atualiza população de adultos                    
                    atualizaPopulacao(novosAdultos, 'adultos', '+');
                    //atualiza população de filhotes
                    atualizaPopulacao(novosAdultos, 'filhotes', '-');
                    //remove dos grupos de peixes
                    gruposDePeixes.splice(index, 1);
                    //remove e desenha os elementos html
                    removerPeixes(novosAdultos, 'filhote');
                    desenharPeixes(novosAdultos, 'adulto');
                } else {
                    grupo.idade++;
                }
            }
        }
    }

    function pescar(barcos, pescaFilhotes) {
        console.log(pescaFilhotes);
        if ((mesAtual >= periodoPescaIni) && (mesAtual <= periodoPescaFin)) {
            var qtdPescada = 0.072 * barcos; // formula
            //evita numeros negativos
            if (populacaoAtual - qtdPescada < 0) {
                qtdPescada = populacaoAtual;
            }
            //se nao pesca filhotes
            if (!pescaFilhotes) {
                atualizaPopulacao(qtdPescada, 'adultos', '-');
                //remove os peixes do canvas
                removerPeixes(qtdPescada, 'adulto');
                //se pesca filhotes
            } else {
                //remove os peixes do canvas
                for (var index = 0; index < qtdPescada; index++) {
                    //divide igualmente a quantidade pescada entre os filhotes e os adultos
                    if (index % 2 == 0) {
                        atualizaPopulacao(1, 'adultos', '-');
                        removerPeixes(1, 'adulto');
                    } else {
                        atualizaPopulacao(1, 'filhotes', '-');
                        removerPeixes(1, 'filhote');
                    }
                }
            }
        }
    }


    function desenharPeixes(qtd, tipo) {
        if (qtdDesenhada + qtd <= MAX_PEIXES_DESENHADOS) {
            spawnMany(qtd, tipo);
            qtdDesenhada += qtd;
        }else{
            var qtdDisponivel = MAX_PEIXES_DESENHADOS - qtdDesenhada;
            if(qtdDisponivel > 0){
                spawnMany(qtdDisponivel , tipo);
                qtdDesenhada = MAX_PEIXES_DESENHADOS;
            }
        }
        atualizaVelocidadeAnimacao($('#velocidadeRange').val());
    }

    //remove do canvas a quantidade e do tipo passados por parametro
    //os dois parametros sao opcionais
    //se nada for passado, remove todos os peixes
    function removerPeixes(qtd, tipo) {
        var removeu = false;
        var qtdAdultos = $('.fish.fish-1').length;
        var qtdFilhotes = $('.fish.fish-2').length;
        //ambos
        if (!tipo) {
            if (qtd) {
                for (var i = 0; i < qtd; i++) {
                    if ($('.fish').length > 0) {
                        $('.fish')[0].remove();
                    }
                }
                removeu = true;
            }
            else {
                if ($('.fish').length > 0) {
                    $('.fish').remove();
                    removeu = true;
                }
            }
            //filhotes
        } else if (tipo.toLowerCase() == 'filhote') {
            if (qtd) {
                if (qtd <= qtdFilhotes) {
                    for (var i = 0; i < qtd; i++) {
                        if ($('.fish.fish-2').length > 0) {
                            $('.fish.fish-2')[0].remove();
                        }
                    }
                    removeu = true;
                }
            } else {
                if ($('.fish.fish-2').length > 0) {
                    $('.fish.fish-2').remove();
                    removeu = true;
                }
            }
            //adultos
        } else if (tipo.toLowerCase() == 'adulto') {
            if (qtd) {
                if (qtd <= qtdAdultos) {
                    for (var i = 0; i < qtd; i++) {
                        if ($('.fish.fish-1').length > 0) {
                            $('.fish.fish-1')[0].remove();
                        }
                    }
                    removeu = true;
                }
            }
            else {
                if ($('.fish.fish-1').length > 0) {
                    $('.fish.fish-1').remove();
                    removeu = true;
                }
            }
        }
        if (removeu) {
            qtdDesenhada -= qtd;
            if (qtdDesenhada < 0) {
                qtdDesenhada = 0;
            }
        }
    }

    function atualizaContadoresPopulacao() {
        $('#populacao').html(populacaoAtual.toFixed(2));
        $('#quantidadeFilhotes').html(populacaoFilhotes.toFixed(2));
        $('#quantidadeAdultos').html(populacaoAdultos.toFixed(2));
    }

    $('#filhotesSim').change(function () {
        permitidoPescaDeFilhotes = true;
    });

    $('#filhotesNao').change(function () {
        permitidoPescaDeFilhotes = false;
    });

    $('#periodoPescaIni').change(function () {
        periodoPescaIni = parseInt($('#periodoPescaIni').val());
    });

    $('#periodoPescaFin').change(function () {
        periodoPescaFin = parseInt($('#periodoPescaFin').val());
    });

    $('#qtdBarcos').change(function () {
        qtdBarcos = $('#qtdBarcos').val();
    });

    function atualizaPopulacao(qtd, variavel, operacao) {
        if (variavel.toLowerCase() == 'adultos') {
            if (operacao == '+') {
                populacaoAdultos += qtd;
            } else if (operacao == '-') {
                populacaoAdultos -= qtd;
                if (populacaoAdultos < 0) {
                    populacaoAdultos = 0;
                }
            }
        } else if (variavel.toLowerCase() == 'filhotes') {
            if (operacao == '+') {
                populacaoFilhotes += qtd;
            } else if (operacao == '-') {
                populacaoFilhotes -= qtd;
                if (populacaoFilhotes < 0) {
                    populacaoFilhotes = 0;
                }
            }
        }
        populacaoAtual = populacaoAdultos + populacaoFilhotes;
        atualizaContadoresPopulacao();
    }
});




