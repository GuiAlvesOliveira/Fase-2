// semantica.js · verificações semânticas (Fase 2)
//
//   Recebe:  a AST do programa
//   Devolve: um vetor de erros: [ { linha, mensagem }, ... ]
//            (vetor vazio = nenhum erro encontrado)
//
// Verificações:
//   1. tela com largura ou altura menor ou igual a zero
//   2. círculo com raio menor ou igual a zero
//   3. retângulo com largura ou altura menor ou igual a zero
// (a gramática aceita o zero e números negativos; os dois não fazem sentido nesses casos)

export function verificar(ast) {
    const erros = [];

    const tela = ast.tela;
    if (tela.largura <= 0 || tela.altura <= 0) {
        erros.push({ linha: tela.linha, mensagem: "a tela precisa ter largura e altura maiores que zero" });
    }

    verificarComandos(ast.comandos, erros);
    return erros;
}

// Percorre uma lista de comandos e desce nos grupos (recursão: pega qualquer nível)
function verificarComandos(comandos, erros) {
    for (const no of comandos) {
        if (no.tipo === "Circulo") {
            if (no.raio <= 0) {
                erros.push({ linha: no.linha, mensagem: "o círculo precisa ter raio maior que zero" });
            }
        } else if (no.tipo === "Retangulo") {
            if (no.largura <= 0 || no.altura <= 0) {
                erros.push({ linha: no.linha, mensagem: "o retângulo precisa ter largura e altura maiores que zero" });
            }
        } else if (no.tipo === "Grupo") {
            verificarComandos(no.comandos, erros);
        }
    }
}
