
//the ISO-transliterations's alphabet (in order)
const alphabet = ["a", "ā", "i", "ī", "u", "ū", "r̥", "r̥̄", "l̥", "l̥̄", "ē", "e", "ai",
                  "ō", "o", "au", "k", "kh", "g", "gh", "ṅ", "c", "ch", "j", "jh",
                  "ñ", "ṭ", "ṭh", "ḍ", "ḍh", "ṇ", "t", "th", "d", "dh", "n", "p", "ph",
                  "b", "bh", "m", "y", "r", "l", "v", "ś", "ṣ", "s", "h", "ḻ", "kṣ", "jñ"];

//length of longest character representation
const maxLetterLen = Math.max(...(alphabet.map(e => e.length)));

//remove excess iso chars
function cleanIsoString(s){
  return s
    .normalize("NFD")
    .replace(/[\u0300\u0301\u221A\s\-.]/g, "")
    .normalize("NFC")
    .split("")
    .filter(letter => alphabet.indexOf(letter) >= 0)
    .join("");
}

//find first iso "letter" of string
function findFirstLetter(s = ""){
    for (let i = maxLetterLen; i > 0; i--) {
        if (s.length < i) continue;
        if (alphabet.indexOf(s.substr(0, i)) >= 0){
            return s.substr(0, i);
        }
    }
    return null;
}

//the actual comparison
function isoCompare(a, b){
    //remove excess characters
    a = cleanIsoString(a);
    b = cleanIsoString(b);

    //declare vars for current letters
    let letterA;
    let letterB;

    //loop through "letters" of a and b
    while (a.length > 0 && b.length > 0) {
        //get next letters of a and b
        letterA = findFirstLetter(a);
        letterB = findFirstLetter(b);

        //trim a and b from beginning by length of current letters or 1
        a = a.substr(letterA ? letterA.length : 1);
        b = b.substr(letterB ? letterB.length : 1);

        //evaluate current letters
        if ((letterA && letterB) && (letterA !== letterB)){
            return alphabet.indexOf(letterA) - alphabet.indexOf(letterB);
        }
    }

    return a.length - b.length;
}

export default isoCompare;