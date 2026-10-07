// ============================================================
// 1. CIDADES
// ============================================================

// Cada cidade possui uma posição padrão.
//
// Como não estamos utilizando a localização do dispositivo,
// esta posição representa temporariamente a localização
// do cliente.

const cidades = {

    'franco-da-rocha': {

        nome: 'Franco da Rocha',

        estado: 'São Paulo',

        lat: -23.3233727,

        lng: -46.7294577

    },


    'mairipora': {

        nome: 'Mairiporã',

        estado: 'São Paulo',

        lat: -23.3186,

        lng: -46.5860

    },


    'cajamar': {

        nome: 'Cajamar',

        estado: 'São Paulo',

        lat: -23.3550,

        lng: -46.8781

    },


    'jundiai': {

        nome: 'Jundiaí',

        estado: 'São Paulo',

        lat: -23.1857,

        lng: -46.8978

    }

};


// ============================================================
// 2. CONFIGURAÇÕES
// ============================================================

const RAIO_BUSCA = 10000;


// ============================================================
// 3. MAPA
// ============================================================

const map = L.map(
    'map'
).setView(
    [-23.32, -46.75],
    10
);


// ============================================================
// 4. OPENSTREETMAP
// ============================================================

L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {

        maxZoom: 19,

        attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

    }
).addTo(map);


// ============================================================
// 5. VARIÁVEIS
// ============================================================

let cidadeAtual = null;

let posicaoCliente = null;

let marcadorCliente = null;

let circuloBusca = null;

let marcadorPesquisa = null;

let marcadoresProfissionais = [];


// ============================================================
// 6. ÍCONE DO CLIENTE
// ============================================================

// Imagem 2.

const iconeCliente = L.icon({

    iconUrl: '../assets/img/tux_mario.png',

    iconSize: [60, 60],

    iconAnchor: [30, 60],

    popupAnchor: [0, -55]

});


// ============================================================
// 7. ÍCONE DOS PROFISSIONAIS
// ============================================================

// Imagem 1.

const iconeProfissional = L.icon({

    iconUrl: '../assets/img/user.png',

    iconSize: [42, 42],

    iconAnchor: [21, 42],

    popupAnchor: [0, -38]

});


// ============================================================
// 8. PROFISSIONAIS
// ============================================================

// Dados de teste.
//
// Futuramente eles podem vir do banco de dados.

const profissionais = [


    // --------------------------------------------------------
    // FRANCO DA ROCHA
    // --------------------------------------------------------

    {

        id: 1,

        cidade: 'franco-da-rocha',

        lat: -23.3300,

        lng: -46.7350

    },


    {

        id: 2,

        cidade: 'franco-da-rocha',

        lat: -23.3500,

        lng: -46.7300

    },


    {

        id: 3,

        cidade: 'franco-da-rocha',

        lat: -23.3400,

        lng: -46.7200

    },


    // --------------------------------------------------------
    // MAIRIPORÃ
    // --------------------------------------------------------

    {

        id: 4,

        cidade: 'mairipora',

        lat: -23.3200,

        lng: -46.5900

    },


    {

        id: 5,

        cidade: 'mairipora',

        lat: -23.3050,

        lng: -46.5800

    },


    // --------------------------------------------------------
    // CAJAMAR
    // --------------------------------------------------------

    {

        id: 6,

        cidade: 'cajamar',

        lat: -23.3500,

        lng: -46.8700

    },


    {

        id: 7,

        cidade: 'cajamar',

        lat: -23.3650,

        lng: -46.8850

    },


    // --------------------------------------------------------
    // JUNDIAÍ
    // --------------------------------------------------------

    {

        id: 8,

        cidade: 'jundiai',

        lat: -23.1900,

        lng: -46.9000

    },


    {

        id: 9,

        cidade: 'jundiai',

        lat: -23.1750,

        lng: -46.8900

    }

];


// ============================================================
// 9. ELEMENTOS HTML
// ============================================================

const selectEstado =
    document.getElementById(
        'selectEstado'
    );


const selectCidade =
    document.getElementById(
        'selectCidade'
    );


const pesquisaInput =
    document.getElementById(
        'pesquisaInput'
    );


const btnPesquisaLocal =
    document.getElementById(
        'btnPesquisaLocal'
    );


// ============================================================
// 10. ALTERAÇÃO DA CIDADE
// ============================================================

selectCidade.addEventListener(
    'change',
    function () {

        const idCidade =
            selectCidade.value;


        if (!idCidade) {

            limparMapa();


            cidadeAtual = null;

            posicaoCliente = null;


            map.flyTo(
                [-23.32, -46.75],
                10,
                {

                    animate: true,

                    duration: 1

                }
            );


            return;

        }


        selecionarCidade(
            idCidade
        );

    }
);


// ============================================================
// 11. SELECIONA A CIDADE
// ============================================================

function selecionarCidade(
    idCidade
) {

    const cidade =
        cidades[idCidade];


    if (!cidade) {

        console.error(
            'Cidade não encontrada:',
            idCidade
        );

        return;

    }


    cidadeAtual =
        idCidade;


    // A posição padrão da cidade passa a ser
    // a posição do cliente.

    posicaoCliente =
        L.latLng(
            cidade.lat,
            cidade.lng
        );


    limparMapa();


    criarMarcadorCliente(
        cidade
    );


    criarRaioBusca();


    mostrarProfissionaisProximos();


    redirecionarMapa();

}


// ============================================================
// 12. LIMPA MAPA
// ============================================================

function limparMapa() {

    if (
        marcadorCliente
    ) {

        map.removeLayer(
            marcadorCliente
        );


        marcadorCliente =
            null;

    }


    if (
        circuloBusca
    ) {

        map.removeLayer(
            circuloBusca
        );


        circuloBusca =
            null;

    }


    removerMarcadoresProfissionais();

}


// ============================================================
// 13. CRIA O CLIENTE
// ============================================================

function criarMarcadorCliente(
    cidade
) {

    marcadorCliente =
        L.marker(
            posicaoCliente,
            {

                icon:
                    iconeCliente,

                zIndexOffset:
                    1000

            }
        )
            .addTo(map);


    marcadorCliente.bindPopup(`

        <div class="popup-usuario">

            <h3>
                Sua região
            </h3>

            <p>
                ${cidade.nome} - SP
            </p>

        </div>

    `);

}


// ============================================================
// 14. CRIA O RAIO
// ============================================================

function criarRaioBusca() {

    circuloBusca =
        L.circle(
            posicaoCliente,
            {

                radius:
                    RAIO_BUSCA,

                color:
                    '#2456ee',

                fillColor:
                    '#6cbdfc',

                opacity: 4,

                fillOpacity:
                    0.18,

                weight: 2

            }
        )
            .addTo(map);

}


// ============================================================
// 15. REDIRECIONA O MAPA
// ============================================================

function redirecionarMapa() {

    if (
        !circuloBusca
    ) {

        return;

    }


    map.flyToBounds(
        circuloBusca.getBounds(),
        {

            padding:
                [40, 40],

            maxZoom:
                12,

            duration:
                1.4

        }
    );

}


// ============================================================
// 16. REMOVE PROFISSIONAIS
// ============================================================

function removerMarcadoresProfissionais() {

    marcadoresProfissionais.forEach(
        function (marcador) {

            map.removeLayer(
                marcador
            );

        }
    );


    marcadoresProfissionais = [];

}


// ============================================================
// 17. MOSTRA PROFISSIONAIS DA REGIÃO
// ============================================================

function mostrarProfissionaisProximos() {

    removerMarcadoresProfissionais();


    profissionais.forEach(
        function (profissional) {


            // Mostra apenas profissionais da cidade escolhida.

            if (
                profissional.cidade !==
                cidadeAtual
            ) {

                return;

            }


            const posicaoProfissional =
                L.latLng(
                    profissional.lat,
                    profissional.lng
                );


            const distancia =
                posicaoCliente.distanceTo(
                    posicaoProfissional
                );


            // Profissionais acima de 10 km
            // não aparecem.

            if (
                distancia >
                RAIO_BUSCA
            ) {

                return;

            }


            criarMarcadorProfissional(
                profissional,
                posicaoProfissional,
                distancia
            );

        }
    );

}


// ============================================================
// 18. CRIA MARCADOR DO PROFISSIONAL
// ============================================================

function criarMarcadorProfissional(
    profissional,
    posicao,
    distancia
) {

    const distanciaKm =
        (
            distancia /
            1000
        )
            .toFixed(2);


    const marcador =
        L.marker(
            posicao,
            {

                icon:
                    iconeProfissional

            }
        )
            .addTo(map);


    marcador.bindPopup(`

        <div class="popup-profissional">

            <h3>
                Profissional pela região.
            </h3>

            <p>
                Profissional analisando seu chamado.
            </p>

            <p>

                <strong>
                    Distância aproximada:
                </strong>

                ${distanciaKm} km

            </p>

        </div>

    `);


    marcadoresProfissionais.push(
        marcador
    );

}


// ============================================================
// 19. PESQUISA
// ============================================================

async function pesquisarLocal() {

    const pesquisa =
        pesquisaInput.value.trim();


    if (!pesquisa) {

        return;

    }


    let consulta =
        pesquisa;


    // Caso exista uma cidade selecionada,
    // adiciona a cidade automaticamente à pesquisa.

    if (
        cidadeAtual &&
        cidades[cidadeAtual]
    ) {

        consulta +=
            `, ${cidades[cidadeAtual].nome}`;

    }


    consulta +=
        ', São Paulo, Brasil';


    const url =
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(consulta)}`;


    try {

        const response =
            await fetch(url);


        if (
            !response.ok
        ) {

            throw new Error(
                `Erro HTTP ${response.status}`
            );

        }


        const resultado =
            await response.json();


        if (
            resultado.length === 0
        ) {

            alert(
                'Local não encontrado.'
            );

            return;

        }


        const local =
            resultado[0];


        const lat =
            Number(local.lat);


        const lng =
            Number(local.lon);


        if (
            marcadorPesquisa
        ) {

            map.removeLayer(
                marcadorPesquisa
            );

        }


        marcadorPesquisa =
            L.marker(
                [lat, lng]
            )
                .addTo(map)
                .bindPopup(
                    local.display_name
                );


        map.flyTo(
            [lat, lng],
            16,
            {

                animate:
                    true,

                duration:
                    1.3

            }
        );


        marcadorPesquisa
            .openPopup();


    } catch (error) {

        console.error(
            'Erro na pesquisa:',
            error
        );


        alert(
            'Não foi possível realizar a pesquisa.'
        );

    }

}


// ============================================================
// 20. BOTÃO DE PESQUISA
// ============================================================

btnPesquisaLocal.addEventListener(
    'click',
    pesquisarLocal
);


// ============================================================
// 21. ENTER
// ============================================================

pesquisaInput.addEventListener(
    'keydown',
    function (event) {

        if (
            event.key ===
            'Enter'
        ) {

            pesquisarLocal();

        }

    }
);


// ============================================================
// 22. WEBVIEW E RESPONSIVIDADE
// ============================================================

window.addEventListener(
    'resize',
    function () {

        map.invalidateSize();

    }
);


setTimeout(
    function () {

        map.invalidateSize();

    },
    250
);