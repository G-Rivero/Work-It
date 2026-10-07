// ============================================================
// 1. CONFIGURAÇÕES DAS CIDADES
// ============================================================

// Cada cidade possui uma coordenada padrão.
//
// Como a localização do dispositivo não será utilizada,
// o avatar do profissional será colocado nessa posição
// quando a cidade for selecionada.

const cidades = {

    'franco-da-rocha': {

        nome: 'Franco da Rocha',
        estado: 'SP',

        lat: -23.3233727,
        lng: -46.7294577

    },


    'mairipora': {

        nome: 'Mairiporã',
        estado: 'SP',

        lat: -23.3186,
        lng: -46.5860

    },


    'cajamar': {

        nome: 'Cajamar',
        estado: 'SP',

        lat: -23.3550,
        lng: -46.8781

    },


    'jundiai': {

        nome: 'Jundiaí',
        estado: 'SP',

        lat: -23.1857,
        lng: -46.8978

    }

};


// ============================================================
// 2. CONFIGURAÇÕES GERAIS
// ============================================================

// 10000 metros equivalem a 10 quilômetros.

const RAIO_BUSCA = 10000;


// ============================================================
// 3. CRIAÇÃO DO MAPA
// ============================================================

// O mapa começa em uma posição mais ampla.
//
// Nenhum avatar será mostrado até que uma cidade
// seja selecionada.

const map = L.map('map').setView(
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

let posicaoProfissional = null;

let marcadorProfissional = null;

let circuloBusca = null;

let marcadoresServicos = [];


// ============================================================
// 6. ÍCONE DO PROFISSIONAL
// ============================================================

const iconeProfissional = L.icon({

    iconUrl: '../assets/img/tux_goku.png',

    iconSize: [50, 50],

    iconAnchor: [25, 50],

    popupAnchor: [0, -48]

});


// ============================================================
// 7. ÍCONE DAS SOLICITAÇÕES
// ============================================================

const iconeServico = L.icon({

    iconUrl: '../assets/img/trabalhoIcon2.png',

    iconSize: [38, 38],

    iconAnchor: [19, 38],

    popupAnchor: [0, -36]

});


// ============================================================
// 8. SOLICITAÇÕES DE SERVIÇO
// ============================================================

// Estes dados são exemplos.
//
// Posteriormente poderão ser carregados diretamente
// de um banco de dados.

const solicitacoes = [


    // --------------------------------------------------------
    // FRANCO DA ROCHA
    // --------------------------------------------------------

    {

        id: 1,

        cidade: 'franco-da-rocha',

        lat: -23.3300,
        lng: -46.7350,

        titulo: 'Instalação de chuveiro',

        categoria: 'Eletricista',

        descricao:
            'Preciso de um profissional para instalar um chuveiro novo.'

    },


    {

        id: 2,

        cidade: 'franco-da-rocha',

        lat: -23.3500,
        lng: -46.7300,

        titulo: 'Conserto de torneira',

        categoria: 'Encanador',

        descricao:
            'Minha torneira da cozinha está vazando.'

    },


    {

        id: 3,

        cidade: 'franco-da-rocha',

        lat: -23.3400,
        lng: -46.7200,

        titulo: 'Formatação de computador',

        categoria: 'Informática',

        descricao:
            'Preciso formatar um computador e instalar o sistema.'

    },


    // --------------------------------------------------------
    // MAIRIPORÃ
    // --------------------------------------------------------

    {

        id: 4,

        cidade: 'mairipora',

        lat: -23.3200,
        lng: -46.5900,

        titulo: 'Manutenção elétrica',

        categoria: 'Eletricista',

        descricao:
            'Algumas tomadas da residência pararam de funcionar.'

    },


    {

        id: 5,

        cidade: 'mairipora',

        lat: -23.3050,
        lng: -46.5800,

        titulo: 'Pintura de residência',

        categoria: 'Pintor',

        descricao:
            'Preciso pintar dois cômodos da residência.'

    },


    // --------------------------------------------------------
    // CAJAMAR
    // --------------------------------------------------------

    {

        id: 6,

        cidade: 'cajamar',

        lat: -23.3500,
        lng: -46.8700,

        titulo: 'Montagem de guarda-roupa',

        categoria: 'Montador de móveis',

        descricao:
            'Preciso montar um guarda-roupa novo.'

    },


    {

        id: 7,

        cidade: 'cajamar',

        lat: -23.3650,
        lng: -46.8850,

        titulo: 'Manutenção de computador',

        categoria: 'Informática',

        descricao:
            'O computador está apresentando lentidão e desligando sozinho.'

    },


    // --------------------------------------------------------
    // JUNDIAÍ
    // --------------------------------------------------------

    {

        id: 8,

        cidade: 'jundiai',

        lat: -23.1900,
        lng: -46.9000,

        titulo: 'Instalação de ventilador',

        categoria: 'Eletricista',

        descricao:
            'Preciso instalar um ventilador de teto.'

    },


    {

        id: 9,

        cidade: 'jundiai',

        lat: -23.1750,
        lng: -46.8900,

        titulo: 'Conserto de vazamento',

        categoria: 'Encanador',

        descricao:
            'Existe um vazamento embaixo da pia da cozinha.'

    }

];


// ============================================================
// 9. EVENTO DE SELEÇÃO DA CIDADE
// ============================================================

const selectCidade =
    document.getElementById('selectCidade');


selectCidade.addEventListener(
    'change',
    function (event) {

        const idCidade =
            event.target.value;


        if (!idCidade) {

            limparMapa();

            cidadeAtual = null;

            posicaoProfissional = null;

            map.flyTo(
                [-23.32, -46.75],
                10
            );

            return;

        }


        selecionarCidade(idCidade);

    }
);


// ============================================================
// 10. SELECIONA A CIDADE
// ============================================================

function selecionarCidade(idCidade) {

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


    // A coordenada padrão da cidade passa a representar
    // a posição do profissional.

    posicaoProfissional =
        L.latLng(
            cidade.lat,
            cidade.lng
        );


    // Remove avatar, raio e serviços da cidade anterior.

    limparMapa();


    // Cria o novo avatar.

    criarAvatarProfissional(
        cidade
    );


    // Cria o novo raio de 10 km.

    criarRaioBusca();


    // Exibe as solicitações próximas.

    mostrarServicosProximos();


    // Move e ajusta o zoom do mapa para a cidade.

    redirecionarMapaParaCidade();

}


// ============================================================
// 11. LIMPA O MAPA
// ============================================================

function limparMapa() {

    if (marcadorProfissional) {

        map.removeLayer(
            marcadorProfissional
        );


        marcadorProfissional = null;

    }


    if (circuloBusca) {

        map.removeLayer(
            circuloBusca
        );


        circuloBusca = null;

    }


    removerMarcadoresServicos();

}


// ============================================================
// 12. CRIA O AVATAR DO PROFISSIONAL
// ============================================================

function criarAvatarProfissional(cidade) {

    marcadorProfissional =
        L.marker(
            posicaoProfissional,
            {

                icon:
                    iconeProfissional,

                zIndexOffset:
                    1000

            }
        )
            .addTo(map);


    marcadorProfissional.bindPopup(`

        <div class="popup-profissional">

            <h3>
                Sua região
            </h3>

            <p>
                ${cidade.nome} - ${cidade.estado}
            </p>

            <small>
                Localização padrão da cidade
            </small>

        </div>

    `);

}


// ============================================================
// 13. CRIA O RAIO DE 10 KM
// ============================================================

function criarRaioBusca() {

    circuloBusca =
        L.circle(
            posicaoProfissional,
            {
                radius: RAIO_BUSCA,

                color: '#2456ee',

                fillColor: '#6cbdfc',

                fillOpacity: 0.12,

                opacity: 4,

                weight: 2
            }
        )
            .addTo(map);

}


// ============================================================
// 14. REDIRECIONA O MAPA PARA A CIDADE
// ============================================================

function redirecionarMapaParaCidade() {

    if (!circuloBusca) {

        return;

    }


    // Utiliza os limites do círculo para calcular
    // automaticamente um zoom que mostre a região
    // selecionada e aproximadamente os 10 km.

    map.flyToBounds(
        circuloBusca.getBounds(),
        {

            paddingTopLeft:
                [30, 90],

            paddingBottomRight:
                [80, 30],

            duration:
                1.4

        }
    );

}


// ============================================================
// 15. REMOVE MARCADORES ANTIGOS
// ============================================================

function removerMarcadoresServicos() {

    marcadoresServicos.forEach(
        function (marcador) {

            map.removeLayer(
                marcador
            );

        }
    );


    marcadoresServicos = [];

}


// ============================================================
// 16. MOSTRA SOLICITAÇÕES PRÓXIMAS
// ============================================================

function mostrarServicosProximos() {

    removerMarcadoresServicos();


    solicitacoes.forEach(
        function (solicitacao) {


            // Verifica se a solicitação pertence
            // à cidade selecionada.

            if (
                solicitacao.cidade !==
                cidadeAtual
            ) {

                return;

            }


            const posicaoServico =
                L.latLng(
                    solicitacao.lat,
                    solicitacao.lng
                );


            // Calcula a distância entre a localização
            // padrão do profissional e o serviço.

            const distancia =
                posicaoProfissional.distanceTo(
                    posicaoServico
                );


            // Solicitações acima de 10 km
            // não aparecem no mapa.

            if (
                distancia >
                RAIO_BUSCA
            ) {

                return;

            }


            criarMarcadorServico(
                solicitacao,
                posicaoServico,
                distancia
            );

        }
    );

}


// ============================================================
// 17. CRIA O MARCADOR DO SERVIÇO
// ============================================================

function criarMarcadorServico(
    solicitacao,
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
                    iconeServico

            }
        )
            .addTo(map);


    marcador.bindPopup(`

        <div class="popup-servico">

            <h3>
                ${solicitacao.titulo}
            </h3>

            <p class="categoria-servico">

                <i class="fa-solid fa-briefcase"></i>

                ${solicitacao.categoria}

            </p>

            <p>
                ${solicitacao.descricao}
            </p>

            <p class="distancia-servico">

                <strong>
                    Distância:
                </strong>

                ${distanciaKm} km

            </p>

        </div>

    `);


    marcadoresServicos.push(
        marcador
    );

}


// ============================================================
// 18. CORREÇÃO DE TAMANHO DO LEAFLET
// ============================================================

// Necessário principalmente quando o site for utilizado
// dentro de uma WebView Android.

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

document
    .getElementById('selectCidade')
    .addEventListener(
        'change',
        function (event) {

            const cidadeSelecionada =
                event.target.value;


            if (!cidadeSelecionada) {
                return;
            }


            selecionarCidade(
                cidadeSelecionada
            );

        }
    );