// gerador.js · gera o texto SVG a partir da AST (Fase 2)
//
//   Recebe:  a AST do programa (já verificada pela semântica)
//   Devolve: uma string com o SVG completo, começando em <svg ...> e terminando em </svg>
//
// Percorre a AST recursivamente, como o paraMermaid da aula de AST:
// visita o nó, desce nos filhos e monta o texto.

// Tabela de cores: nome da linguagem → nome de cor do SVG. #RRGGBB passa direto.
export const CORES = {
    preto: "black",
    branco: "white",
    cinza: "gray",
    prata: "silver",
    vermelho: "red",
    verde: "green",
    azul: "blue",
    amarelo: "yellow",
    laranja: "orange",
    roxo: "purple",
    rosa: "pink",
    marrom: "saddlebrown",
};

export function gerarSVG(ast) {
    const l = ast.tela.largura;
    const a = ast.tela.altura;
    const linhas = [];
    linhas.push('<svg xmlns="http://www.w3.org/2000/svg" width="' + l + '" height="' + a + '" viewBox="0 0 ' + l + " " + a + '">');
    for (const no of ast.comandos) {
        gerarNo(no, 1, linhas);              // ordem do programa: o que vem depois fica por cima
    }
    linhas.push("</svg>");
    return linhas.join("\n");
}

// Gera um nó (forma ou grupo) com o recuo do nível em que está
function gerarNo(no, nivel, linhas) {
    const recuo = "  ".repeat(nivel);

    if (no.tipo === "Retangulo") {
        linhas.push(recuo + '<rect x="' + no.x + '" y="' + no.y + '" width="' + no.largura + '" height="' + no.altura + '" ' + estilo(no.estilos) + "/>");
    } else if (no.tipo === "Circulo") {
        linhas.push(recuo + '<circle cx="' + no.cx + '" cy="' + no.cy + '" r="' + no.raio + '" ' + estilo(no.estilos) + "/>");
    } else if (no.tipo === "Linha") {
        linhas.push(recuo + '<line x1="' + no.x1 + '" y1="' + no.y1 + '" x2="' + no.x2 + '" y2="' + no.y2 + '" ' + estilo(no.estilos) + "/>");
    } else if (no.tipo === "Grupo") {
        const transform = transformacao(no.modificadores);
        if (transform === "") {
            linhas.push(recuo + "<g>");                                   // grupo sem modificadores: <g> sem transform
        } else {
            linhas.push(recuo + '<g transform="' + transform + '">');
        }
        for (const filho of no.comandos) {
            gerarNo(filho, nivel + 1, linhas);                          // recursão: grupos aninhados
        }
        linhas.push(recuo + "</g>");
    } else {
        throw new Error("nó desconhecido na AST: " + no.tipo);
    }
}

// Modificadores → transform, na ordem em que foram escritos
function transformacao(modificadores) {
    const partes = [];
    for (const m of modificadores) {
        if (m.tipo === "Deslocamento") {
            partes.push("translate(" + m.x + " " + m.y + ")");
        } else if (m.tipo === "Rotacao") {
            partes.push("rotate(" + m.angulo + ")");
        }
    }
    return partes.join(" ");
}

// Estilo: começa nos padrões e aplica os estilos na ordem escrita (o último vence).
// Sempre escreve os três atributos, para não cair nos padrões do SVG.
function estilo(estilos) {
    let fill = "none";
    let stroke = "black";
    let espessura = 1;
    for (const e of estilos) {
        if (e.propriedade === "preenchimento") {
            fill = cor(e.valor);
        } else if (e.propriedade === "traco") {
            stroke = cor(e.valor);
        } else if (e.propriedade === "espessura") {
            espessura = e.valor;
        }
    }
    return 'fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + espessura + '"';
}

function cor(valor) {
    if (valor.startsWith("#")) {
        return valor;                        // #RRGGBB passa direto
    }
    return CORES[valor];
}
