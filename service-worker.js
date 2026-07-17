const CACHE_NAME = "scanner-passagens-v1";


const FILES_CACHE = [

    "./",

    "./index.html",

    "./css/style.css",

    "./js/app.js",

    "./js/passagemService.js",

    "./js/supabaseClient.js",

    "./icons/icon-192.png",

    "./icons/icon-512.png"

];




// Instala o aplicativo

self.addEventListener(
"install",
(event)=>{


    event.waitUntil(

        caches.open(CACHE_NAME)

        .then(cache=>{

            return cache.addAll(FILES_CACHE);

        })

    );


});





// Ativa nova versão

self.addEventListener(
"activate",
(event)=>{


    event.waitUntil(

        caches.keys()

        .then(keys=>{


            return Promise.all(

                keys.map(key=>{


                    if(key !== CACHE_NAME){

                        return caches.delete(key);

                    }


                })

            );


        })

    );


});







// Busca arquivos no cache

self.addEventListener(
"fetch",
(event)=>{


    event.respondWith(

        caches.match(event.request)

        .then(response=>{


            return response ||

            fetch(event.request);


        })

    );


});