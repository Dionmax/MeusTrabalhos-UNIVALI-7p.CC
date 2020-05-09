$(document).ready(function () {
    let atributos = [];
    let catalogos = [];

    $('form select').each((i, el) => {
        var element = $(el);

        $.ajax({
            type: "GET",
            dataType: "json",
            url: element.attr('data-url'),
            beforeSend: function () {
                // element.prop('disabled', true);
            },
            success: function (response) {
                atributos.push(response);
                response.forEach((el) => {
                    var value = el[Object.keys(el)[0]];
                    element.append('<option value="' + value + '">' + value + '</option>')
                });
                element.prop('disabled', false);
            }
        });
    })

    $('form').submit(function (e) {
        e.preventDefault();
        var element = $(this);

        $.ajax({
            type: "GET",
            dataType: "json",
            url: "http://localhost:3001/catalogos?",
            beforeSend: function () {
                element.prop('disabled', true);
            },
            success: function (response) {
                catalogos = response;

                const GeneroSelected = $("#form-genero :selected").val();
                const DuraçãoSelected = $("#form-duracao :selected").val();
                const AtorSelected = $("#form-ator :selected").val();
                const TipoSelected = $("#form-tipo :selected").val();
                const ProdutoraSelected = $("#form-produtora :selected").val();
                const FaixaIdadeSelected = $("#form-faixa-idade :selected").val();

                const entrada = JSON.parse('{' +
                    '"genero" : "' + GeneroSelected + '",' +
                    '"duracao":"' + DuraçãoSelected + '",' +
                    '"ator":"' + AtorSelected + '",' +
                    '"tipo":"' + TipoSelected + '",' +
                    '"produtora":"' + ProdutoraSelected + '",' +
                    '"faixa_idade":"' + FaixaIdadeSelected + '"' +
                    '}');

                let simGen;
                let simDur;
                let simAtor;
                let simTipo;
                let simProd;
                let simFaix;

                const GeneroPeso = 0.8;
                const DuraçãoPeso = 1;
                const AtorPeso = 0.6;
                const TipoPeso = 1;
                const ProdutoraPeso = 0.4;
                const FaixaIdadePeso = 0.7;

                const PesoTotal = GeneroPeso + DuraçãoPeso + AtorPeso + TipoPeso + ProdutoraPeso + FaixaIdadePeso;

                let resultadoGrauSimilaridade = [];

                catalogos.forEach((catalogo, key) => {

                    simGen = getGeneroPeso(catalogo.genero, entrada.genero);
                    simDur = getDuracaoPeso(catalogo.duracao, entrada.duracao);
                    simAtor = getAtoresPeso(catalogo.ator, entrada.ator);
                    simTipo = getTipoPeso(catalogo.tipo, entrada.tipo);
                    simProd = getProdutoraPeso(catalogo.produtora, entrada.produtora);
                    simFaix = getFaixaPeso(catalogo.faixa_idade, entrada.faixa_idade);

                    let grauSimilaridade = (((simGen * GeneroPeso) + (simDur * DuraçãoPeso) + (simAtor * AtorPeso) + (simTipo * TipoPeso) + (simProd * ProdutoraPeso) + (simFaix * FaixaIdadePeso))) / PesoTotal;

                    resultadoGrauSimilaridade.push(JSON.parse('{"id":' + catalogo.id + ',"sim": ' + grauSimilaridade + '}'));
                })

                resultadoGrauSimilaridade.sort(function compare(a, b) {
                    if (a.sim > b.sim) {
                        return -1;
                    }
                    if (a.sim < b.sim) {
                        return 1;
                    }
                    return 0;
                });

                $("#simtablebody").children().remove();

                resultadoGrauSimilaridade.forEach((value) => {

                    const el = catalogos.find((cat) => { return cat.id == value.id });

                    $("#simtablebody").append(
                        '<tr>' +
                        '<td> ' + el.titulo + '</td>' +
                        '<td> ' + el.genero + '</td>' +
                        '<td> ' + el.duracao + '</td>' +
                        '<td> ' + el.ator + '</td>' +
                        '<td> ' + el.tipo + '</td>' +
                        '<td> ' + el.produtora + '</td>' +
                        '<td> ' + el.faixa_idade + '</td>' +
                        '<td> ' + ((value.sim) * 100).toFixed(2) + '%</td>' +
                        '</tr>'
                    );
                });
            }
        });
    })
})

function normalizeName(nome) {
    return nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function getGeneroPeso(A, B) {
    let i, j;

    const namePosition = ['Indiferente', 'Ação', 'Aventura', 'Comédia', 'Romance', 'Policial', 'Corrida', 'Terror'];

    namePosition.forEach((value, key) => {
        if (normalizeName(A) == normalizeName(namePosition[key]))
            i = key;
    });

    namePosition.forEach((value, key) => {
        if (normalizeName(B) == normalizeName(namePosition[key]))
            j = key;
    });

    const matriz = [
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 0.5, 0.7, 0.2, 0.8, 0.8, 0.3],
        [1, 0.5, 1, 0.4, 0.7, 0.8, 0.1, 0.4],
        [1, 0.7, 0.4, 1, 0.8, 0.8, 0, 0],
        [1, 0.2, 0.7, 0.8, 1, 0.4, 0, 0],
        [1, 0.8, 0.8, 0.8, 0.4, 1, 0.5, 0.8],
        [1, 0.8, 0.1, 0, 0, 0.5, 1, 0],
        [1, 0.3, 0.4, 0.8, 0.8, 0.8, 0, 1]];

    return matriz[i][j];
}

function getDuracaoPeso(A, B) {
    let i, j;

    const namePosition = ['Indiferente', 'Curta', 'Média', 'longa', 'Muito longo'];

    namePosition.forEach((value, key) => {
        if (normalizeName(A) == normalizeName(namePosition[key]))
            i = key;
    });

    namePosition.forEach((value, key) => {
        if (normalizeName(B) == normalizeName(namePosition[key]))
            j = key;
    });

    const matriz = [
        [1, 1, 1, 1, 1],
        [1, 1, 0.6, 0.1, 0],
        [1, 0.6, 1, 0.4, 0.1],
        [1, 0.1, 0.4, 1, 0.8],
        [1, 0, 0.1, 0.8, 1]
    ];

    return matriz[i][j];
}

function getAtoresPeso(A, B) {
    let i, j;

    const namePosition = [
        'Indiferente',
        'Johnny Depp',
        'Will Smith',
        'Vin Diesel',
        'Dwayne Johnson',
        'Robert Downey Jr',
        'Tom Cruise',
        'Brad Pitt',
        'Angelina Jolie',
        'Jim Carrey',
        'Nicolas Cage'];

    namePosition.forEach((value, key) => {
        if (normalizeName(A) == normalizeName(namePosition[key]))
            i = key;
    });

    namePosition.forEach((value, key) => {
        if (normalizeName(B) == normalizeName(namePosition[key]))
            j = key;
    });

    const matriz = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 0.6, 0.2, 0.1, 0.7, 0.1, 0.3, 0.2, 0.6, 0],
        [1, 0.6, 1, 0.2, 0, 0.1, 0.4, 0.2, 0.6, 0.4, 0.3],
        [1, 0.2, 0.2, 1, 0.8, 0.3, 0.5, 0, 0.1, 0, 0.2],
        [1, 0.1, 0, 0.8, 1, 0, 0.2, 0, 0, 0, 0],
        [1, 0.7, 0.1, 0.3, 0, 1, 0.4, 0.1, 0.2, 0.4, 0.4],
        [1, 0.1, 0.4, 0.5, 0.2, 0.4, 1, 0.6, 0.7, 0.1, 0.3],
        [1, 0.3, 0.2, 0, 0, 0.1, 0.6, 1, 0.9, 0, 0.2],
        [1, 0.2, 0.6, 0.1, 0, 0.2, 0.7, 0.9, 1, 0, 0.1],
        [1, 0.6, 0.4, 0, 0, 0.4, 0.1, 0, 0, 1, 0],
        [1, 0, 0.3, 0.2, 0, 0.4, 0.3, 0.2, 0.1, 0, 1]
    ];

    return matriz[i][j];
}

function getTipoPeso(A, B) {
    let i, j;

    const namePosition = ['Indiferente', 'Filme', 'Série'];

    namePosition.forEach((value, key) => {
        if (normalizeName(A) == normalizeName(namePosition[key]))
            i = key;
    });

    namePosition.forEach((value, key) => {
        if (normalizeName(B) == normalizeName(namePosition[key]))
            j = key;
    });

    const matriz = [
        [1, 1, 1],
        [1, 1, 0.8],
        [1, 0.8, 1]
    ];

    return matriz[i][j];
}

function getProdutoraPeso(A, B) {
    let i, j;

    const namePosition = ['Indiferente', 'Fox', 'Warner', 'Universal', 'Disney', 'DreamWorks'];

    namePosition.forEach((value, key) => {
        if (normalizeName(A) == normalizeName(namePosition[key]))
            i = key;
    });

    namePosition.forEach((value, key) => {
        if (normalizeName(B) == normalizeName(namePosition[key]))
            j = key;
    });

    const matriz = [
        [1, 1, 1, 1, 1, 1],
        [1, 1, 0.4, 0.4, 0.6, 0.5],
        [1, 0.4, 1, 0.5, 0.7, 0.3],
        [1, 0.4, 0.5, 1, 0.5, 0.4],
        [1, 0.6, 0.7, 0.5, 1, 0.3],
        [1, 0.5, 0.3, 0.4, 0.3, 1]
    ];

    return matriz[i][j];
}

function getFaixaPeso(A, B) {
    let i, j;

    const namePosition = ['Indiferente', 'L', '10', '16', '18'];

    namePosition.forEach((value, key) => {
        if (normalizeName(A) == normalizeName(namePosition[key]))
            i = key;
    });

    namePosition.forEach((value, key) => {
        if (normalizeName(B) == normalizeName(namePosition[key]))
            j = key;
    });

    const matriz = [
        [1, 1, 1, 1, 1],
        [1, 1, 0.5, 0.1, 0],
        [1, 0.5, 1, 0.6, 0],
        [1, 0.1, 0.1, 1, 0.7],
        [1, 0, 0, 0.7, 1]
    ];

    return matriz[i][j];
}