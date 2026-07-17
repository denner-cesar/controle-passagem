/* global jsQR */

export async function iniciarCamera(videoEl) {

    console.log("Iniciando câmera...");

    const stream = await navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: "environment"
        },
        audio: false
    });


    videoEl.srcObject = stream;

    videoEl.setAttribute("playsinline", "");
    videoEl.muted = true;


    await videoEl.play();


    console.log("Câmera ligada");

    return stream;
}



export function pararCamera(stream){

    stream?.getTracks()
    .forEach(track => track.stop());

}



export function suportaLanterna(){
    return false;
}



export async function definirLanterna(){
    return;
}




export function criarLeitorQr(video, canvas, aoDetectar){


let ativo = false;
let id = null;

const ctx = canvas.getContext("2d");

let contador = 0;


function lerFrame(){


    if(!ativo) return;


    id = requestAnimationFrame(lerFrame);



    if(video.readyState !== video.HAVE_ENOUGH_DATA){
        return;
    }


    contador++;


    if(contador % 30 === 0){
        console.log(
            "Analisando câmera...",
            video.videoWidth,
            video.videoHeight
        );
    }



    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;



    ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );



    const imagem =
    ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    );



    const codigo =
    jsQR(
        imagem.data,
        imagem.width,
        imagem.height,
        {
            inversionAttempts:"attemptBoth"
        }
    );



    if(codigo){


        console.log(
            "QR ENCONTRADO:",
            codigo.data
        );


        aoDetectar(
            codigo.data
        );


    }


}



return {


 iniciar(){

    console.log("Leitor iniciado");

    ativo=true;

    lerFrame();

 },


 pausar(){

    ativo=false;

 },


 retomar(){

    if(!ativo){

        ativo=true;

        lerFrame();

    }

 },


 parar(){

    ativo=false;

    if(id)
    cancelAnimationFrame(id);

 }


};


}