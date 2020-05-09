let json = require('./simTable.json');

var testeEntrada = JSON.parse('{"Gênero": "Ação","Duração": "Muito longo","Ator": "Will Smith","Tipo": "Série","Produtora": "DreamWorks","Ano": 2016,"Faixa Idade": "10"}');

console.log(json.Gênero[1].Gênero);

console.log(testeEntrada.Gênero)
