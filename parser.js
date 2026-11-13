// parser.js · o analisador sintático da linguagem (Fase 1, com o ajuste da Fase 2)
//
//   Recebe:  a lista de tokens, já sem erros léxicos: [ { tipo, lexema, linha }, ... ]
//   Devolve: a AST do programa
//   Erro sintático: lança um erro com a linha, o que era esperado e o que foi encontrado
//
// Gramática:
//   programa    → tela comando*
//   tela        → TELA NUM NUM
//   comando     → forma | grupo
//   forma       → RETANGULO NUM NUM NUM NUM estilo*
//               | CIRCULO NUM NUM NUM estilo*
//               | LINHA NUM NUM NUM NUM estilo*
//   estilo      → PREENCHIMENTO cor | TRACO cor | ESPESSURA NUM
//   cor         → COR | HEX
//   grupo       → GRUPO modificador* ABRE comando* FECHA
//   modificador → DESLOCAMENTO NUM NUM | ROTACAO NUM
//
// Ajuste da Fase 2: os nós Tela, Retangulo, Circulo, Linha e Grupo guardam
// o campo "linha" (a linha do token que abre o comando), usado nos erros semânticos.

export function analisarSintatico(tokens) {
    let pos = 0;

    function atual() {
        return tokens[pos];
    }

    function esperar(tipo) {
        const token = tokens[pos];
        if (token === undefined) {
            const linha = tokens.length > 0 ? tokens[tokens.length - 1].linha : 1;
            throw new Error("Erro sintático na linha " + linha + ": esperado " + tipo + ", encontrado fim do programa");
        }
        if (token.tipo !== tipo) {
            throw new Error("Erro sintático na linha " + token.linha + ": esperado " + tipo + ", encontrado " + token.tipo);
        }
        pos = pos + 1;
        return token;
    }

    function numero() {
        return Number(esperar("NUM").lexema);
    }

    // programa → tela comando*
    function programa() {
        const tela = lerTela();
        const comandos = [];
        while (atual() !== undefined) {
            comandos.push(comando());
        }
        return { tipo: "Programa", tela: tela, comandos: comandos };
    }

    // tela → TELA NUM NUM
    function lerTela() {
        const token = esperar("TELA");
        const largura = numero();
        const altura = numero();
        return { tipo: "Tela", largura: largura, altura: altura, linha: token.linha };
    }

    // comando → forma | grupo
    function comando() {
        const token = atual();
        if (token.tipo === "RETANGULO") return retangulo();
        if (token.tipo === "CIRCULO") return circulo();
        if (token.tipo === "LINHA") return linha();
        if (token.tipo === "GRUPO") return grupo();
        throw new Error("Erro sintático na linha " + token.linha + ": esperado RETANGULO, CIRCULO, LINHA ou GRUPO, encontrado " + token.tipo);
    }

    function retangulo() {
        const token = esperar("RETANGULO");
        const x = numero();
        const y = numero();
        const largura = numero();
        const altura = numero();
        return { tipo: "Retangulo", x: x, y: y, largura: largura, altura: altura, estilos: estilos(), linha: token.linha };
    }

    function circulo() {
        const token = esperar("CIRCULO");
        const cx = numero();
        const cy = numero();
        const raio = numero();
        return { tipo: "Circulo", cx: cx, cy: cy, raio: raio, estilos: estilos(), linha: token.linha };
    }

    function linha() {
        const token = esperar("LINHA");
        const x1 = numero();
        const y1 = numero();
        const x2 = numero();
        const y2 = numero();
        return { tipo: "Linha", x1: x1, y1: y1, x2: x2, y2: y2, estilos: estilos(), linha: token.linha };
    }

    // estilo* : guarda todos, na ordem escrita (o gerador aplica "vale o último")
    function estilos() {
        const lista = [];
        while (atual() !== undefined) {
            const tipo = atual().tipo;
            if (tipo === "PREENCHIMENTO") {
                esperar("PREENCHIMENTO");
                lista.push({ tipo: "Estilo", propriedade: "preenchimento", valor: cor() });
            } else if (tipo === "TRACO") {
                esperar("TRACO");
                lista.push({ tipo: "Estilo", propriedade: "traco", valor: cor() });
            } else if (tipo === "ESPESSURA") {
                esperar("ESPESSURA");
                lista.push({ tipo: "Estilo", propriedade: "espessura", valor: numero() });
            } else {
                break;
            }
        }
        return lista;
    }

    // cor → COR | HEX
    function cor() {
        const token = atual();
        if (token !== undefined && token.tipo === "HEX") {
            return esperar("HEX").lexema;
        }
        return esperar("COR").lexema;
    }

    // grupo → GRUPO modificador* ABRE comando* FECHA
    function grupo() {
        const token = esperar("GRUPO");
        const modificadores = [];
        while (atual() !== undefined && (atual().tipo === "DESLOCAMENTO" || atual().tipo === "ROTACAO")) {
            if (atual().tipo === "DESLOCAMENTO") {
                esperar("DESLOCAMENTO");
                const x = numero();
                const y = numero();
                modificadores.push({ tipo: "Deslocamento", x: x, y: y });
            } else {
                esperar("ROTACAO");
                modificadores.push({ tipo: "Rotacao", angulo: numero() });
            }
        }
        esperar("ABRE");
        const comandos = [];
        while (atual() !== undefined && atual().tipo !== "FECHA") {
            comandos.push(comando());
        }
        esperar("FECHA");
        return { tipo: "Grupo", modificadores: modificadores, comandos: comandos, linha: token.linha };
    }

    return programa();
}
