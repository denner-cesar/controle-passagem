/* global jsQR */


// ===============================
// INICIAR CAMERA
// ===============================

export async function iniciarCamera(videoEl) {

  console.log("Iniciando câmera...");

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

  videoEl.autoplay = true;
  videoEl.playsInline = true;
  videoEl.muted = true;


  await videoEl.play();


  console.log("Câmera pronta");


  return stream;

}



// ===============================
// PARAR CAMERA
// ===============================

export function pararCamera(stream){

  if(!stream) return;


  stream
    .getTracks()
    .forEach(track=>track.stop());

}



// ===============================
// LANTERNA
// ===============================

export function suportaLanterna(stream){

  const track =
    stream?.getVideoTracks?.()[0];


  const capacidades =
    track?.getCapabilities?.();


  return Boolean(
    capacidades &&
    capacidades.torch
  );

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



// ===============================
// LEITOR QR CODE
// ===============================

export function criarLeitorQr(
  video,
  canvas,
  aoDetectar
){


 const ctx =
   canvas.getContext(
     "2d",
     {
       willReadFrequently:true
     }
   );


 let ativo=false;

 let pausado=false;

 let frame=null;



 function processar(){


   if(!ativo) return;



   frame =
    requestAnimationFrame(processar);



   if(pausado)
     return;



   if(
     video.readyState !==
     video.HAVE_ENOUGH_DATA
   ){
     return;
   }



   const largura =
      video.videoWidth;


   const altura =
      video.videoHeight;



   if(!largura || !altura)
      return;



   console.log(
     "Camera:",
     largura,
     altura
   );



   canvas.width =
      largura;


   canvas.height =
      altura;



   ctx.drawImage(
     video,
     0,
     0,
     largura,
     altura
   );



   // ===============================
   // RECORTE CENTRAL
   // ===============================


   const tamanho =
     Math.floor(
       Math.min(
         largura,
         altura
       ) * 0.75
     );


   const x =
     Math.floor(
       (largura - tamanho) / 2
     );


   const y =
     Math.floor(
       (altura - tamanho) / 2
     );



   const imagem =
      ctx.getImageData(
        x,
        y,
        tamanho,
        tamanho
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
        "===================="
      );

      console.log(
        "QR ENCONTRADO:",
        codigo.data
      );

      console.log(
        "===================="
      );


      aoDetectar(
        codigo.data
      );

   }



 }




 return {


   iniciar(){

     console.log(
       "Leitor iniciado"
     );

     ativo=true;

     processar();

   },



   pausar(){

     pausado=true;

   },



   retomar(){

     pausado=false;

   },



   parar(){

     ativo=false;


     if(frame){

       cancelAnimationFrame(frame);

     }

   }


 };


}