
$(document).ready(function () {
    const mesesParaVirarAdulto = 42;
    var wto;
    var mesAtual = 1;
    var populacaoAtual = 0;
    var populacaoAdultos = 0;
    var populacaoFilhotes = 0;
    var timer;
    var tempoDecorrido = 0;
    var iniciado = false;
    //var tainhas = [];
    var qtdDesenhada = 0;
    var gruposFilhotes = [];
    //adulto 42 meses

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
            console.log('executou');
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
        populacaoAtual = parseFloat($("#peixesIniciais").val());
        //iniciam todos adultos
        populacaoAdultos = populacaoAtual;
        qtdDesenhada = populacaoAtual;
        $('#populacao').html(populacaoAtual);
        $('#mesAtual').html(retornarNomeMes(mesAtual));

        $("#peixesIniciais").prop('disabled', true);

        //isso atribui a velocidade para 1 e chama o timer com 3 segundos
        $('#velocidadeRange').val('1');
        $('.range-slider__value').html('1');
        startTimer(3000);
        if (populacaoAtual < 500) {
            spawnStartingFish(populacaoAtual);
        } else {
            spawnStartingFish(500);
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

            var sobreviventes = reproduzir(mesAtual, populacaoAdultos);

            if (qtdDesenhada + sobreviventes <= 500) {
                desenharPeixes(sobreviventes, 'filhote');
            }

            envelhecerPeixes(gruposFilhotes);
            desenharPeixes(sobreviventes, 'filhote');
            
            atualizaContadoresPopulacao();
            atualizaMesAtual();
        }, mili);
    }

    function reproduzir(mes, adultos) {
        var sobreviventes = 0;
        //somente se tiver adultos
        if (adultos > 0) {
            //reproduz entre abril e julho      
            if (mes >= 4 && mes <= 7) {
                console.log(mes);
                sobreviventes = 40 / 4;// formula
                populacaoAtual += sobreviventes;
                populacaoFilhotes += sobreviventes;
                gruposFilhotes.push({ qtd: sobreviventes, idade: 0 });
            }
            //remover isso, somente para testes
            if (mes == 12) {
                pescar(0, 0, false);
            }
        }
        return sobreviventes;
    }

    function envelhecerPeixes(gruposDePeixes) {
        console.log(gruposDePeixes);
        if (gruposDePeixes.length > 0) {
            for (var index = 0; index < gruposDePeixes.length; index++) {
                var grupo = gruposDePeixes[index];
                if (grupo.idade == mesesParaVirarAdulto) {
                    let novosAdultos = grupo.qtd;
                    //atualiza população de adultos
                    populacaoAdultos += novosAdultos;
                    //atualiza população de filhotes
                    populacaoFilhotes -= novosAdultos;
                    //atualiza população atual
                    populacaoAtual += novosAdultos;
                    //remove dos grupos de peixes
                    gruposDePeixes.splice(index, 1);
                } else {
                    grupo.idade++;
                }
            }
        }
    }

    function pescar(qtdBarcos, qtdMaxPescadosPorBarco, pescaFilhotes) {

        var qtdPescada = 10; // formula
        //se nao pesca filhotes
        if (!pescaFilhotes) {
            populacaoAdultos -= qtdPescada;
            populacaoAtual -= qtdPescada;
            //remove os peixes do canvas
            removerPeixes(qtdPescada, 'adulto');
            //se pesca filhotes
        } else {
            populacaoAtual -= qtdPescada;
            //remove os peixes do canvas
            for (var index = 0; index < qtdPescada; index++) {
                //divide igualmente a quantidade pescada entre os filhotes e os adultos
                if (i % 2 == 0) {
                    qtdAdultos -= qtdPescada;
                    removerPeixes(1, 'adulto');
                } else {
                    qtdFilhotes -= qtdPescada;
                    removerPeixes(1, 'filhote');
                }
            }
        }
    }

    function desenharPeixes(qtd, tipo) {
        if(qtdDesenhada + qtd <= 500){
            spawnMany(qtd, tipo);
            qtdDesenhada += qtd;
        }      
    }

    //remove do canvas a quantidade e do tipo passados por parametro
    //os dois parametros sao opcionais
    //se nada for passado, remove todos os peixes
    function removerPeixes(qtd, tipo) {
        //ambos
        if (!tipo) {
            if (qtd) {
                for (var i = 0; i < qtd; i++) {                    
                    $('.fish')[0].remove();
                }
            }
            else {
                $('.fish').remove();
            }
            //filhotes
        } else if (tipo.toLowerCase() == 'filhote') {
            if (qtd) {
                for (var i = 0; i < qtd; i++) {
                    $('.fish.fish-2')[0].remove();
                }
            } else {
                $('.fish.fish-2').remove();
            }
            //adultos
        } else if (tipo.toLowerCase() == 'adulto') {
            if (qtd) {
                for (var i = 0; i < qtd; i++) {
                    $('.fish.fish-1')[0].remove();
                }
            }
            else {
                $('.fish.fish-1').remove();
            }
        }
        qtdDesenhada -= qtd;
    }

    function atualizaContadoresPopulacao() {
        $('#populacao').html(populacaoAtual);
        $('#quantidadeFilhotes').html(populacaoFilhotes);
        $('#quantidadeAdultos').html(populacaoAdultos);
    }
});




