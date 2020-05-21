package UsageHistory;

import static IDE.IdeCompilador.*;

/**
 *
 * @author dionmax
 */
public class History {

    //Inicializadas
    public static void setVariaveisInicializadas(String id) {
        VariavelInicializada.put(id, true);
    }

    public static String getVariaveisInicializadas(String id) {
        return (VariavelInicializada.get(id) != null) ? "Sim" : "Não";
    }

    //Tipo
    public static void setVariaveisTipo(String id, String tipo) {
        VariavelTipo.put(id, tipo);
    }

    public static String getVariaveisTipo(String id) {
        return (VariavelTipo.get(id) != null) ? VariavelTipo.get(id) : "Error";
    }
    
    //Tipo descritivo
    public static String getVariaveisTipoAdicional(String id) {
        return (VariavelTipoAdicional.get(id) != null) ? VariavelTipo.get(id) : "Error";
    }

    //Usada
    public static void setVariaveisUsadas(String id) {
        VariavelUsada.put(id, true);
    }

    public static String getVariaveisUsadas(String id) {
        return (VariavelUsada.get(id) != null) ? "Sim" : "Não";
    }
    
    //ID
    public static void setVariaveisId(String id, String tipo) {
        VariavelId.put(id, tipo);
    }

    public static String getVariaveisId(String id) {
        return (VariavelId.get(id) != null) ? VariavelId.get(id) : "Error";
    }
    
    //Escopo
    public static void setVariaveisEscopo(String id, int escopo) {
        VariavelEscopo.put(id, escopo);
    }

    public static String getVariaveisEscopo(String id) {
        return (VariavelEscopo.get(id) != null) ? String.valueOf(VariavelEscopo.get(id)) : "Error";
    }
}
