import { supabase } from "./supabaseClient.js";



const ID_DISPOSITIVO =

`web-${Math.random()
.toString(36)
.substring(2,10)}`;



export async function registrarLeituraPassagem(dados){



    console.log(
        "Enviando para banco:",
        dados
    );



    const {data,error} = await supabase.rpc(

        "registrar_leitura",

        {

            p_numero_passagem:
            dados.numero_passagem,


            p_destino:
            dados.destino ?? null,


            p_dispositivo:
            ID_DISPOSITIVO,


            p_cobrador_id:
            null

        }

    );




    console.log(
        "Resposta Supabase:",
        data
    );


    console.log(
        "Erro:",
        error
    );





    if(error){

        throw new Error(
            error.message
        );

    }





    const resultado =
    Array.isArray(data)
    ? data[0]
    : data;




    return {


        numero_passagem:
        resultado.numero_passagem,


        destino:
        resultado.destino,


        status:
        resultado.status,


        quantidade_leituras:
        resultado.quantidade_leituras


    };


}