package de.unikoeln.vedaweb.util;

import java.text.Normalizer;
import java.text.Normalizer.Form;

public class StringUtils {
	
	
	public static String normalizeNFC(String s){
		return s == null ? "" :
			Normalizer.normalize(s, Form.NFC);
	}
	
	
	public static String normalizeNFD(String s){
		return s == null ? "" :
			Normalizer.normalize(s, Form.NFD);
	}
	
	
	public static int normalizeIndex(int index, int docCount){
		if (index < 0)
			index = docCount + index;
		else if (index >= docCount)
			index = index - docCount;
		return index;
	}
	
	
	public static boolean containsAccents(String text) {
	    return text == null ? false :
	        normalizeNFD(text).matches(".*(\\u0301|\\u0300).*");
	}
	
	
	public static String removeUnicodeAccents(String text, boolean nfc) {
	    text = text == null ? "" :
        		normalizeNFD(text)
		        .replaceAll("\\u0301", "")
		        .replaceAll("\\u0300", "");
	    if (nfc) return normalizeNFC(text);
	    else	 return text;
	}
	

}
