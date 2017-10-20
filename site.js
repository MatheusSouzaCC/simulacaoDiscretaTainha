
$(document).ready(function () {
    var wto;
    $("#velocidade").html($("#velocidadeRange").val());

    $("#velocidadeRange").on("change mousemove", function () {
        $("#velocidade").html($(this).val());
    });

    $('#play').click(function () {
        $(this).prop('disabled', true);
        $('#stop').prop('disabled', false);
        $('#cog-parent').css('color', 'green');
        $('#cog-parent').get(0).lastChild.nodeValue = ' Rodando...';
        $('#cog').addClass('fa-spin');
    });

    $('#stop').click(function () {
        $(this).prop('disabled', true);
        $('#play').prop('disabled', false);
        $('#cog-parent').css('color', 'red');
        $('#cog-parent').get(0).lastChild.nodeValue = ' Parado';
        $('#cog').removeClass('fa-spin');
    });

    $('#velocidadeRange').change(function () {
        clearTimeout(wto);
        wto = setTimeout(function() {
            console.log('executou');
            atualizaVelocidadeAnimacao($('#velocidadeRange').val());
        }, 100);
        
    });

    function atualizaVelocidadeAnimacao(velocidade) {
        var peixes = $('.fish-bob');

        switch (parseFloat(velocidade)) {
            case 1:
                updateSpeed(peixes, 6,30);
                break;
            case 5:
                updateSpeed(peixes, 0.2,0.2);
                break;
        }
    }

    function updateSpeed(peixes, tempoBob,tempoTransition) {
        $('.fish').css('transition',`${tempoTransition}s`);
        for (var index = 0; index < peixes.length; index++) {
            var element = peixes[index];
            $(element).css('animation', 'bob ' + tempoBob + 's infinite');
            $(element).css('animation-delay', `-${Math.random() * 1}s`);
        }
    }
});




