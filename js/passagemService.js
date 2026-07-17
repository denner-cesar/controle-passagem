import { supabase } from "./supabaseClient.js";


export async function registrarPassagem(dados){


    const {

        numero_passagem,
        foto

    } = dados;




    // ===========================
    // Validações
    // ===========================


    if(!numero_passagem){

        throw new Error(
            "Número do bilhete obrigatório"
        );

    }



    if(!foto){

        throw new Error(
            "Foto do bilhete obrigatória"
        );

    }



    if(!foto.type.startsWith("image/")){

        throw new Error(
            "Arquivo precisa ser uma imagem"
        );

    }



    if(foto.size > 5 * 1024 * 1024){

        throw new Error(
            "Imagem muito grande. Máximo 5MB"
        );

    }





    // ===========================
    // Upload foto privada
    // ===========================


    const extensao =
    foto.name.split(".").pop().toLowerCase();



    const nomeArquivo =

    `bilhetes/${crypto.randomUUID()}.${extensao}`;





    const { error:uploadError } =

    await supabase.storage

    .from("bilhetes")

    .upload(

        nomeArquivo,

        foto,

        {

            upsert:false

        }

    );





    if(uploadError){

        throw uploadError;

    }





    // ===========================
    // Informações do dispositivo
    // ===========================


    const dispositivo =

    navigator.userAgent.substring(0,100);





    // ===========================
    // Registrar leitura
    // ===========================


    const { data,error } =

    await supabase.rpc(

        "registrar_leitura",

        {

            p_numero_passagem:

            numero_passagem,



            p_destino:

            null,



            p_dispositivo:

            dispositivo,



            p_cobrador_id:

            null,



            p_foto_bilhete:

            nomeArquivo

        }

    );





    if(error){

        console.error(error);

        throw error;

    }





    return {


        ...data[0],


        foto_bilhete:

        nomeArquivo,


        eh_fraude:

        data[0].eh_fraude

    };


}