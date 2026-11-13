// tokens.js · a lista de tokens da linguagem (Fase 1)
//
// Cada regra é um objeto com:
//   tipo:    o nome do token
//   padrao:  a expressão regular, SEMPRE com a flag y
//   ignorar: true para tokens que não vão para a lista (espaços, comentários)
//
// A sintaxe segue o exemplo do enunciado (tela, retangulo, circulo, linha, grupo...).

export const regras = [
    { tipo: "ESPACO",        padrao: /\s+/y,          ignorar: true },
    { tipo: "COMENTARIO",    padrao: /\/\/[^\n]*/y,   ignorar: true },

    // palavras reservadas
    { tipo: "TELA",          padrao: /tela\b/y },
    { tipo: "RETANGULO",     padrao: /retangulo\b/y },
    { tipo: "CIRCULO",       padrao: /circulo\b/y },
    { tipo: "LINHA",         padrao: /linha\b/y },
    { tipo: "GRUPO",         padrao: /grupo\b/y },
    { tipo: "DESLOCAMENTO",  padrao: /deslocamento\b/y },
    { tipo: "ROTACAO",       padrao: /rotacao\b/y },
    { tipo: "PREENCHIMENTO", padrao: /preenchimento\b/y },
    { tipo: "TRACO",         padrao: /traco\b/y },
    { tipo: "ESPESSURA",     padrao: /espessura\b/y },

    // cores: os nomes da linguagem (a tabela de conversão está no gerador.js) ou #RRGGBB
    { tipo: "COR",           padrao: /(preto|branco|cinza|prata|vermelho|verde|azul|amarelo|laranja|roxo|rosa|marrom)\b/y },
    { tipo: "HEX",           padrao: /#[0-9A-Fa-f]{6}\b/y },

    // números: inteiros ou decimais, com sinal opcional (o zero é aceito)
    { tipo: "NUM",           padrao: /-?\d+(\.\d+)?\b/y },

    { tipo: "ABRE",          padrao: /\[/y },
    { tipo: "FECHA",         padrao: /\]/y },
];
