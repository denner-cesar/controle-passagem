export function extrairDadosQr(conteudoBruto) {

    const codigo = String(conteudoBruto ?? "").trim();


    if (!codigo) {
        throw new Error("QR Code vazio");
    }


    console.log("Código bruto do cupom:", codigo);


    return {

        numero_passagem: codigo,

        destino: "Cupom de embarque"

    };

}