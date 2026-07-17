-- =========================================
-- BANCO DE PASSAGENS
-- Sistema de controle de bilhetes
-- =========================================


CREATE EXTENSION IF NOT EXISTS "pgcrypto";



-- =========================================
-- TABELA PASSAGENS
-- =========================================


CREATE TABLE IF NOT EXISTS public.passagens (

    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    numero_passagem text NOT NULL,

    nome_cliente text NOT NULL,

    destino text NOT NULL,


    data date DEFAULT CURRENT_DATE,

    hora time DEFAULT CURRENT_TIME,


    status text NOT NULL DEFAULT 'Normal',

    quantidade_leituras integer NOT NULL DEFAULT 1,


    criado_em timestamptz DEFAULT now(),

    atualizado_em timestamptz DEFAULT now(),


    CONSTRAINT passagens_status_check

    CHECK (

        status = ANY (

            ARRAY[

                'Normal'::text,

                'Possível Fraude'::text

            ]

        )

    )

);





-- =========================================
-- FUNÇÃO REGISTRAR PASSAGEM
-- =========================================


CREATE OR REPLACE FUNCTION public.registrar_passagem(

    p_numero_passagem text,

    p_nome_cliente text,

    p_destino text

)

RETURNS public.passagens

LANGUAGE plpgsql

AS $$


DECLARE

    v_passagem public.passagens;


BEGIN



    -- procura bilhete existente

    SELECT *

    INTO v_passagem

    FROM public.passagens

    WHERE numero_passagem = p_numero_passagem;





    -- se já existe

    IF FOUND THEN



        UPDATE public.passagens

        SET

            quantidade_leituras =
            public.passagens.quantidade_leituras + 1,


            status =
            'Possível Fraude',


            atualizado_em =
            now()


        WHERE id = v_passagem.id;





    ELSE



        INSERT INTO public.passagens

        (

            numero_passagem,

            nome_cliente,

            destino,

            status,

            quantidade_leituras

        )


        VALUES

        (

            p_numero_passagem,

            p_nome_cliente,

            p_destino,

            'Normal',

            1

        );



    END IF;





    -- retorna registro atualizado


    SELECT *

    INTO v_passagem

    FROM public.passagens

    WHERE numero_passagem = p_numero_passagem;



    RETURN v_passagem;



END;

$$;







-- =========================================
-- PERMISSÃO PARA O APP ACESSAR
-- =========================================


GRANT EXECUTE ON FUNCTION public.registrar_passagem(
    text,
    text,
    text
)
TO anon;



GRANT SELECT, INSERT, UPDATE
ON public.passagens
TO anon;