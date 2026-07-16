/* global jsQR */



export async function iniciarCamera(video){



    const stream =
    await navigator.mediaDevices.getUserMedia({

        video:{


            facingMode:{
                ideal:"environment"
            },

            width:{
                ideal:1280
            },


            height:{
                ideal:720
            }


        },


        audio:false

    });





    video.srcObject =
    stream;



    await video.play();



    return stream;


}






export function pararCamera(stream){


    if(!stream)
    return;



    stream
    .getTracks()
    .forEach(track=>{


        track.stop();


    });


}









export function criarLeitorQr(
    video,
    canvas,
    callback
){



    const ctx =
    canvas.getContext("2d");



    let ativo=false;



    let frame;



    function ler(){



        if(!ativo)
        return;



        frame =
        requestAnimationFrame(ler);




        if(video.readyState !== video.HAVE_ENOUGH_DATA)
        return;





        canvas.width =
        video.videoWidth;



        canvas.height =
        video.videoHeight;




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

            imagem.height

        );





        if(codigo){


            callback(
                codigo.data
            );


        }



    }





    return {


        iniciar(){


            ativo=true;

            ler();


        },



        parar(){


            ativo=false;


            cancelAnimationFrame(frame);


        },


        pausar(){


            ativo=false;


        },


        retomar(){


            if(!ativo){

                ativo=true;

                ler();

            }


        }


    };


}