package gals;

import static IDE.IdeCompilador.*;

import UsageHistory.History;

public class Semantico implements Constants {

    public static String saida = "";

    private boolean declarandoVariaveis = false;
    private String lastVar = "";
    private String lastVarVec = "";
    private int lastVarType;
    private int ultimoOperador;
    private int fimTypeOfExp;
    private boolean usoIDVetor = false;
    
    private boolean SaidaAMSTemp = false;

    public void executeAction(int action, Token token) throws SemanticError {

        saida += "Ação #" + action + ", Token: " + token + "\n";
        String tokenStr = token.getLexeme();
        String keyVar;

        switch (action) {
            case 1: //Tipo variavel
                TipoVariavel.push(tokenStr);
                declarandoVariaveis = true;
                break;

            case 2:
                declarandoVariaveis = false;
                TipoVariavel.clear();
                break;

            case 4://Coloca na pilha de variaveis
                if (Escopo.empty()) { // Caso declaração de variaveis
                    Escopo.push(contador);
                }

                keyVar = tokenStr + "$" + Escopo.lastElement();

                if (varNaoDeclarada(keyVar) && declarandoVariaveis) {
                    VariavelId.put(keyVar, tokenStr);
                    VariavelTipo.put(keyVar, TipoVariavel.lastElement());
                    VariavelEscopo.put(keyVar, Escopo.lastElement());
                } else if (declarandoVariaveis && !usoIDVetor) {
                    throw new SemanticError("ID já declarado (1) " + action + " TK " + token);
                }

                break;

            case 5: //Declaração de vetores
                if (Escopo.empty()) { // Caso declaração de variaveis
                    Escopo.push(contador);
                }

                keyVar = tokenStr + "$" + Escopo.lastElement();

                if (varNaoDeclarada(keyVar) && declarandoVariaveis) {
                    VariavelId.put(keyVar, tokenStr);
                    VariavelTipo.put(keyVar, TipoVariavel.lastElement());
                    VariavelTipoAdicional.put(keyVar, "[ ]");
                    VariavelEscopo.put(keyVar, Escopo.lastElement());
                } else if (declarandoVariaveis) {
                    throw new SemanticError("ID já declarado (2) " + action + " TK " + token);
                }

                lastVarVec = tokenStr;
                break;

            case 6: //Abre escopo
                Escopo.push(contador);
                contador++;
                break;

            case 7: //Fecha escopo
                Escopo.pop();
                // reiniciarVariaveis();
                break;

            case 10: // Atribuição de uma ID
//                declarandoVariaveis = false;
                if (!"".equals(lastVarVec)) {
                    tokenStr = lastVarVec;
                    lastVarVec = "";
                }

                keyVar = tokenStr + "$" + Escopo.lastElement();

                for (int i = Escopo.size(); i > Escopo.size(); i--) {
                    if (VariavelId.get(tokenStr + "$" + i) != null) {
                        keyVar = tokenStr + "$" + i;
                    }
                }

                if ((VariavelId.get(keyVar) != null
                        && VariavelEscopo.get(keyVar) <= Escopo.lastElement())
                        || (declarandoVariaveis || !usoIDVetor)) {
                    History.setVariaveisInicializadas(keyVar);
                } else {
                    throw new SemanticError("Variavel '" + tokenStr + "' não declarada (1)");
                }

                lastVar = keyVar;
                ultimoOperador = Tabela.SemanticTable.REL;
                expTypeStack.push(convertType(VariavelTipo.get(keyVar)));
                break;
            case 11://Fim de uma atribuição
                keyVar = lastVar;

                if (VariavelTipo.get(keyVar) != null) {
                    expTypeStack.push(convertType(VariavelTipo.get(keyVar)));
                }

                if (!podeAtribuir(keyVar)) {
                    throw new SemanticError("Tipo incompativel de variaveis (1) " + tokenStr);
                }
                
                GeracaoCodigo.Gerador.AdcComando("LD " + VariavelId.get(lastVar));
                GeracaoCodigo.Gerador.AdcComando("ADDI " + tokenStr);

                expTypeStack.clear();
                break;

            case 17: //Uso de um ID                
                keyVar = tokenStr + "$" + Escopo.lastElement();

                for (int i = 0; i < Escopo.size(); i++) {
                    if (VariavelId.get(tokenStr + "$" + i) != null) {
                        keyVar = tokenStr + "$" + i;
                    }
                }

                if (VariavelId.get(keyVar) != null) {
                    if ("Sim".equals(History.getVariaveisInicializadas(keyVar))) {
                        VariavelUsada.put(keyVar, true);
                    } else if (declarandoVariaveis && !usoIDVetor) {
                        throw new SemanticError("Variavel '" + tokenStr + "' não declarada (2)\n");
                    } else {
                        VariavelUsada.put(keyVar, true);
                        saida += ("WARNING - Variavel '" + tokenStr + "' não inicializada\n");
                    }

                    expTypeStack.push(convertType(VariavelTipo.get(keyVar)));

                    if (!podeAtribuir(keyVar)) {
                        throw new SemanticError("Tipo incompativel de variaveis (2)");
                    }
                } else {
                    throw new SemanticError("Variavel '" + tokenStr + "' não declarada (3)");
                }
                break;

            case 18: //Fim de declaração de parametro
                declarandoVariaveis = false;
                break;

            case 27:
                usoIDVetor = true;
                break;

            case 28:
                // System.out.println(lastVarType);

                System.out.println(expTypeStack.lastElement());

                usoIDVetor = false;
                break;

            //Tipo de operação
            case 12:
                ultimoOperador = Tabela.SemanticTable.SUM;
                break;
            case 13:
                ultimoOperador = Tabela.SemanticTable.SUB;
                break;
            case 14:
                ultimoOperador = Tabela.SemanticTable.MUL;
                break;
            case 15:
                ultimoOperador = Tabela.SemanticTable.DIV;
                break;
            case 22:
                ultimoOperador = Tabela.SemanticTable.REL;
                break;

            //Tipos de saídas
            case 30:
                lastVarType = Tabela.SemanticTable.INT;
                expTypeStack.push(lastVarType);
                break;
            case 31:
                lastVarType = Tabela.SemanticTable.FLO;
                expTypeStack.push(lastVarType);
                break;
            case 32:
                lastVarType = Tabela.SemanticTable.STR;
                expTypeStack.push(lastVarType);
                break;
            case 33:
                lastVarType = Tabela.SemanticTable.CHA;
                expTypeStack.push(lastVarType);
                break;
            case 34:
            case 35:
                lastVarType = Tabela.SemanticTable.BOO;
                expTypeStack.push(lastVarType);
                break;

            case 40://Fim condição do if 

                if (fimTypeOfExp != Tabela.SemanticTable.BOO) {
                    throw new SemanticError("Condicional inválido.");
                }
                break;

            case 70://Parametros fim de expressão
                int temp = expTypeStack.pop();

                int retorno = temp;

                while (expTypeStack.size() > 0 && retorno != -1) {
                    int aemp = Tabela.SemanticTable.resultType(temp, expTypeStack.pop(), ultimoOperador);
                    retorno = aemp;
                }

                fimTypeOfExp = retorno;
                expTypeStack.clear();
                break;

            default:

        }
    }

    private boolean podeAtribuir(String keyVar) {

        int temp = expTypeStack.firstElement();
        int limit = 100;

        while (expTypeStack.size() > 0 && temp != -1 && limit > 0) {

            int aemp = Tabela.SemanticTable.atribType(temp, expTypeStack.pop());

            if (aemp == -1) {
                temp = aemp;
            }
            limit--;
        }

        if (temp != -1) {
            expTypeStack.push(temp);
            return true;
        }

        return false;
    }

    private boolean podeOperar() {
        int temp = expTypeStack.pop();

        while (expTypeStack.size() > 0 && temp != -1) {
            int aemp = Tabela.SemanticTable.resultType(temp, expTypeStack.pop(), ultimoOperador);
            temp = aemp;
        }

        if (temp != -1) {
            expTypeStack.push(temp);
            return true;
        }
        return false;
    }

    //TODO: refatorar isso
    private int convertType(String type) {
        if ("int".equals(type) || "INT".equals(type)) {
            return Tabela.SemanticTable.INT;
        }

        if ("string".equals(type) || "STRING".equals(type)) {
            return Tabela.SemanticTable.STR;
        }

        if ("char".equals(type) || "CHAR".equals(type)) {
            return Tabela.SemanticTable.CHA;
        }

        if ("float".equals(type) || "FLOAT".equals(type)) {
            return Tabela.SemanticTable.FLO;
        }

        if ("bool".equals(type) || "BOOL".equals(type)) {
            return Tabela.SemanticTable.BOO;
        }

        return -1;
    }

    public boolean varNaoDeclarada(String Id) {
        if (VariavelId.get(Id) == null) {
            return true;
        }

        return VariavelEscopo.get(Id) < Escopo.lastElement();
    }

    public String getSaidaMessage() {
        String s = saida;
        saida = "";
        return s;
    }

    public void reiniciarVariaveis() {
        declarandoVariaveis = false;
        lastVar = "";
        lastVarVec = "";
        lastVarType = 0;
        ultimoOperador = 0;
        fimTypeOfExp = 0;
        usoIDVetor = false;
    }
}
