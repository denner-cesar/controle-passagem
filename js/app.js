import { extrairDadosQr } from "./qrParser.js";

import { registrarLeituraPassagem } from "./passagemService.js";

import {

    iniciarCamera,
    pararCamera,
    criarLeitorQr

} from "./scanner.js";



// ==========================
// ELEMENTOS
// ==========================


const telaInicio =
document.getElementById("telaInicio");


const telaScanner =
document.getElementById("telaScanner");


const camera =
document.getElementById("camera");


const canvas =
document.getElementById("canvas");


const btnIniciar =
document.getElementById("btnIniciar");


const btnCancelar =
document.getElementById("btnCancelar");


const resultado =
document.getElementById("resultado");


const numero =
document.getElementById("numero");


const destino =
document.getElementById("destino");


const status =
document.getElementById("status");


const btnNovo =
document.getElementById("btnNovo");




// ==========================
// ESTADO
// ==========================


let stream = null;

let leitor = null;

let processando = false;

let ultimoCodigo = "";





console.log(
"Aplicativo iniciado"
);







// ==========================
// INICIAR CAMERA
// ==========================


btnIniciar.onclick = async()=>{


    try{


        console.log(
        "Abrindo câmera..."
        );



        stream =
        await iniciarCamera(camera);



        telaInicio.hidden=true;


        telaScanner.hidden=false;




        leitor =
        criarLeitorQr(

            camera,

            canvas,

            lerQr

        );



        leitor.iniciar();



        status.textContent =
        "Aponte para o QR Code";



    }


    catch(erro){


        console.error(
        erro
        );


        alert(
        "Erro ao abrir câmera"
        );


    }


};









// ==========================
// CANCELAR CAMERA
// ==========================


btnCancelar.onclick = ()=>{


    fecharCamera();


};






function fecharCamera(){



    if(leitor){


        leitor.parar();


        leitor=null;


    }



    pararCamera(stream);



    stream=null;



    telaScanner.hidden=true;


    telaInicio.hidden=false;


}









// ==========================
// LER QR CODE
// ==========================


async function lerQr(codigo){



    console.log(
    "QR encontrado:",
    codigo
    );




    if(processando)
    return;



    if(codigo===ultimoCodigo)
    return;



    ultimoCodigo=codigo;



    processando=true;




    try{


        status.textContent =
        "Registrando passagem...";




        const dados =
        extrairDadosQr(
            codigo
        );



        console.log(
        dados
        );





        const resposta =
        await registrarLeituraPassagem(
            dados
        );





        mostrarResultado(
            resposta
        );



    }


    catch(erro){


        console.error(
        erro
        );


        alert(
        erro.message
        );


    }


    finally{


        setTimeout(()=>{


            processando=false;



        },2000);



    }



}









// ==========================
// RESULTADO
// ==========================


function mostrarResultado(dados){



    resultado.hidden=false;



    numero.textContent =
    dados.numero_passagem;



    destino.textContent =
    dados.destino ??
    "Não informado";



    leitor?.pausar();



}






// ==========================
// NOVA LEITURA
// ==========================


btnNovo.onclick = ()=>{


    resultado.hidden=true;



    ultimoCodigo="";



    leitor?.retomar();


};