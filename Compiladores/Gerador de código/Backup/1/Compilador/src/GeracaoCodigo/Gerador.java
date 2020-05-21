package GeracaoCodigo;

import static IDE.IdeCompilador.*;

public class Gerador {
    
    public static void CriarVariaveis(){
        String temp = SaidaASM;
        SaidaASM = "";
        
        if(!VariavelId.isEmpty()){
            SaidaASM += ".data\n";
            
            VariavelTipo.forEach((key, value) -> {
                if("int".equals(value))
                {
                    SaidaASM += ("  "+ VariavelId.get(key)+ ": 0\n");
                }
            });
        }
        
        SaidaASM += temp;
    }
    
    public static void AdcComando(String cmd){
        if(CodigoGeradoF){
            SaidaASM += ".text\n";
            CodigoGeradoF = false;
        }
        
        
        SaidaASM += "   "+cmd + "\n";
    }
}
