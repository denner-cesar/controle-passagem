/* global jsQR */

export async function iniciarCamera(videoEl) {

  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: {
        ideal: "environment"
      },
      width: {
        ideal: 1280
      },
      height: {
        ideal: 720
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

  if(!stream) return;

  stream.getTracks().forEach(track=>{
    track.stop();
  });

}


export function suportaLanterna(stream){

  const track = stream?.getVideoTracks()[0];

  const capabilities = track?.getCapabilities?.();

  return !!capabilities?.torch;

}


export async function definirLanterna(stream,ligada){

  const track = stream?.getVideoTracks()[0];

  if(!track) return;

  await track.applyConstraints({
    advanced:[
      {
        torch:ligada
      }
    ]
  });

}



export function criarLeitorQr(video,canvas,aoDetectar){

 const ctx = canvas.getContext("2d");


 let ativo=false;
 let pausado=false;
 let frame=null;


 function ler(){

    if(!ativo) return;


    frame=requestAnimationFrame(ler);


    if(pausado) return;


    if(video.readyState !== video.HAVE_ENOUGH_DATA)
      return;



    const largura=video.videoWidth;
    const altura=video.videoHeight;


    canvas.width=largura;
    canvas.height=altura;


    ctx.drawImage(
      video,
      0,
      0,
      largura,
      altura
    );


    const imagem=ctx.getImageData(
      0,
      0,
      largura,
      altura
    );


    const codigo=jsQR(
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

      aoDetectar(codigo.data);

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

 }


}