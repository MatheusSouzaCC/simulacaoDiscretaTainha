
$(document).ready(function () {
    var wto;
    var mesAtual = 1;
    var populacaoAtual = 0;
    var timer;
    var tempoDecorrido = 0;
    var iniciado = false;

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
        if(iniciado){
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

    function atualizaMesAtual() {
        if (mesAtual < 12) {
            mesAtual++;
        } else {
            mesAtual = 1;
        }
        atualizaTempoDecorrido();
    }

    function atualizaTempoDecorrido() {
        $("#tempoDecorrido").html(++tempoDecorrido);
    }

    function iniciar() {
        destruirGrafico();
        iniciarGrafico();

        $("#tempoDecorrido").html(tempoDecorrido = 0);
        populacaoAtual = parseFloat($("#peixesIniciais").val());

        $("#peixesIniciais").prop('disabled', true);

        //isso atribui a velocidade para 1 e chama o timer com 3 segundos
        $('#velocidadeRange').val('1');
        $('.range-slider__value').html('1');
        startTimer(3000);

        spawnStartingFish(populacaoAtual);
    }

    function parar() {
        clearInterval(timer);
        //remover os peixes
        mesAtual = 1;
        $("#peixesIniciais").prop('disabled', false);
    }

    function startTimer(mili) {
        clearInterval(timer);
        timer = setInterval(function () {
            atualizaGrafico(mesAtual, populacaoAtual);
            atualizaMesAtual();
        }, mili);
    }
});




