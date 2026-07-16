export function extrairDadosQr(conteudo) {

    const texto = String(conteudo ?? "").trim();


    if (!texto) {

        throw new Error(
            "QR Code vazio"
        );

    }



    // QR em formato JSON
    if (texto.startsWith("{")) {


        try {

            const dados =
            JSON.parse(texto);


            const numero =
            dados.numero_passagem ??
            dados.numero ??
            dados.codigo ??
            dados.id;



            if (!numero) {

                throw new Error(
                    "Número da passagem não encontrado"
                );

            }


            return {

                numero_passagem:
                String(numero),


                destino:
                dados.destino ?? null

            };


        } catch(e) {


            throw new Error(
                "QR Code JSON inválido"
            );

        }

    }




    // QR formato:
    // ABC123|Belém

    if (texto.includes("|")) {


        const partes =
        texto.split("|");



        return {


            numero_passagem:
            partes[0].trim(),


            destino:
            partes[1]?.trim() ?? null


        };


    }





    // QR somente código

    return {


        numero_passagem:
        texto,


        destino:null


    };


}