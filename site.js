
$(document).ready(function(){
    $("#velocidade").html($("#velocidadeRange").val());

    $("#velocidadeRange").on("change mousemove",function(){
        $("#velocidade").html($(this).val());
    });
});
