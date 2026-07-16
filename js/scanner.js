/* global jsQR */


export async function iniciarCamera(videoEl) {

  const stream = await navigator.mediaDevices.getUserMedia({

    video: {
      facingMode: {
        ideal: "environment"
      },

      width: {
        ideal: 1920
      },

      height: {
        ideal: 1080
      }
    },

    audio:false

  });


  videoEl.srcObject = stream;

  videoEl.setAttribute("playsinline","");
  videoEl.setAttribute("autoplay","");
  videoEl.muted = true;


  await videoEl.play();


  return stream;

}



export function pararCamera(stream){

  stream?.getTracks()
  .forEach(track=>track.stop());

}



export function suportaLanterna(stream){

 const track =
 stream?.getVideoTracks?.()[0];


 const cap =
 track?.getCapabilities?.();


 return Boolean(cap?.torch);

}



export async function definirLanterna(stream,ligada){

 const track =
 stream?.getVideoTracks?.()[0];


 if(!track) return;


 await track.applyConstraints({

  advanced:[
   {
    torch:ligada
   }
  ]

 });

}





export function criarLeitorQr(
 video,
 canvas,
 aoDetectar
){


let ativo=false;

let pausado=false;

let frame=null;


const ctx =
canvas.getContext("2d");


// leitor nativo do Chrome Android

const detector =
"BarcodeDetector" in window
?
new BarcodeDetector({
 formats:["qr_code"]
})
:
null;



async function ler(){


 if(!ativo)
 return;



 frame=requestAnimationFrame(ler);



 if(pausado)
 return;



 if(video.readyState !== video.HAVE_ENOUGH_DATA)
 return;



 try{


   // =====================
   // MÉTODO NATIVO ANDROID
   // =====================


   if(detector){


    const codigos =
      await detector.detect(video);



    if(codigos.length){


      console.log(
       "QR NATIVO:",
       codigos[0].rawValue
      );


      aoDetectar(
       codigos[0].rawValue
      );


      return;

    }

   }





   // =====================
   // FALLBACK jsQR
   // =====================


   const largura =
   video.videoWidth;


   const altura =
   video.videoHeight;



   canvas.width=largura;

   canvas.height=altura;



   ctx.drawImage(
    video,
    0,
    0,
    largura,
    altura
   );



   const imagem =
   ctx.getImageData(
    0,
    0,
    largura,
    altura
   );



   const codigo =
   jsQR(
    imagem.data,
    imagem.width,
    imagem.height,
    {
     inversionAttempts:
     "attemptBoth"
    }
   );



   if(codigo){


    console.log(
     "QR jsQR:",
     codigo.data
    );


    aoDetectar(
     codigo.data
    );


   }



 }catch(e){

   console.log(
    "Erro leitura QR",
    e
   );

 }


}




return {


 iniciar(){

  ativo=true;

  ler();

 },


 pausar(){

  pausado=true;

 },


 retomar(){

  pausado=false;

 },


 parar(){

  ativo=false;

  if(frame)
  cancelAnimationFrame(frame);

 }


};


}