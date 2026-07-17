import { registrarPassagem } from "./passagemService.js";


// CAMPOS

const numeroBilhete = 
document.getElementById("numero-bilhete");


const botaoCamera =
document.getElementById("botao-camera");


const fotoBilhete =
document.getElementById("foto-bilhete");


const previewFoto =
document.getElementById("preview-foto");


const botaoRemoverFoto =
document.getElementById("botao-remover-foto");


const botaoRegistrar =
document.getElementById("botao-registrar");



// RESULTADO

const resultado =
document.getElementById("resultado");


const resultadoTitulo =
document.getElementById("resultado-titulo");


const resultadoBilhete =
document.getElementById("resultado-bilhete");


const resultadoLeituras =
document.getElementById("resultado-leituras");



// MENSAGEM

const mensagem =
document.createElement("div");


mensagem.className = "mensagem";


botaoRegistrar.parentNode.insertBefore(
    mensagem,
    botaoRegistrar
);



let arquivoFoto = null;



// ABRIR CAMERA

botaoCamera.addEventListener(
"click",
()=>{

    fotoBilhete.click();

});





// PEGAR FOTO

fotoBilhete.addEventListener(
"change",
()=>{


    arquivoFoto = fotoBilhete.files[0];


    if(arquivoFoto){


        previewFoto.src =
        URL.createObjectURL(arquivoFoto);


        previewFoto.hidden = false;


        botaoRemoverFoto.hidden = false;


        botaoCamera.textContent =
        "Trocar foto";


        mostrarMensagem(
        "Foto adicionada com sucesso",
        "sucesso"
        );

    }


});






// REMOVER FOTO

botaoRemoverFoto.addEventListener(
"click",
()=>{


    arquivoFoto = null;


    fotoBilhete.value = "";


    previewFoto.src = "";


    previewFoto.hidden = true;


    botaoRemoverFoto.hidden = true;


    botaoCamera.textContent =
    "Abrir câmera";


});







// REGISTRAR PASSAGEM

botaoRegistrar.addEventListener(
"click",
async()=>{


    if(!numeroBilhete.value.trim()){


        mostrarMensagem(
        "Digite o número da passagem",
        "erro"
        );


        numeroBilhete.focus();


        return;

    }





    if(!arquivoFoto){


        mostrarMensagem(
        "Tire a foto do bilhete antes de continuar",
        "erro"
        );


        return;

    }







    try{


        botaoRegistrar.disabled = true;


        botaoRegistrar.textContent =
        "Registrando...";






        const resposta =

        await registrarPassagem({

            numero_passagem:

            numeroBilhete.value.trim(),


            foto:

            arquivoFoto

        });






        mostrarResultado(resposta);





        mostrarMensagem(
        "Passagem registrada com sucesso",
        "sucesso"
        );







        // LIMPAR FORMULÁRIO

        numeroBilhete.value = "";


        arquivoFoto = null;


        fotoBilhete.value = "";


        previewFoto.src = "";


        previewFoto.hidden = true;


        botaoRemoverFoto.hidden = true;


        botaoCamera.textContent =
        "Abrir câmera";







        // LIMPAR MENSAGEM

        setTimeout(()=>{


            mensagem.textContent = "";


            mensagem.className =
            "mensagem";


        },1000);








        // RELOAD

        setTimeout(()=>{


            window.location.reload();


        },1500);






    }catch(error){


        console.error(error);


        mostrarMensagem(
        "Erro ao registrar passagem",
        "erro"
        );


    }

    finally{


        botaoRegistrar.disabled = false;


        botaoRegistrar.textContent =
        "Registrar passagem";


    }



});








function mostrarResultado(dados){


    resultado.hidden = false;


    resultadoTitulo.textContent =
    "Passagem registrada";


    resultadoBilhete.textContent =
    dados.numero_passagem;


    resultadoLeituras.textContent =
    dados.quantidade_leituras;


}







function mostrarMensagem(texto,tipo){


    mensagem.textContent =
    texto;


    mensagem.className =
    "mensagem " + tipo;



    setTimeout(()=>{


        mensagem.textContent = "";


        mensagem.className =
        "mensagem";


    },3000);


}