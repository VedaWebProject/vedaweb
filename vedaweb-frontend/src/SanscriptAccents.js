import Sanscript from "sanscript";

class SanscriptAccents {

    static t(input, from, to){
        input = input.normalize("NFD");
        let noAcc = "";
        let accents = [];

        //strip accents, collect accents positions
        for (var i = 0; i < input.length; i++) {
            let c = input.charAt(i);
            if (c === "\u0301"){
                accents.push(i - accents.length - 1);
            } else {
                noAcc += c;
            }
        }

        //process string without accents
        noAcc = Sanscript.t(noAcc, from, to);

        //re-add accents (if any) to right chars (only if target is roman scheme!)
        if(Sanscript.isRomanScheme(to)){
            for (let i = 0; i < accents.length; i++) {
                noAcc = noAcc.substring(0, accents[i]+i+1) + "\u0301" + noAcc.substr(accents[i]+i+1);
                continue;
            }
        }
        
        return noAcc.normalize("NFC");
    }

}

export default SanscriptAccents;