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
		if (text == null) return false;
		text = normalizeNFC(text);
		
		for (int i = 0; i < text.length(); i++) {
			String c = normalizeNFD(text.substring(i, i + 1));
			if (c.matches("[aeiouAEIOU].*") && c.matches(".*(\\u0301|\\u0300).*")) {
				return true;
			}
		}
	    return false;
	}
	
	
	public static String removeVowelAccents(String text) {
		if (text == null) return text;
		text = normalizeNFC(text);
		StringBuilder out = new StringBuilder();
		
		for (int i = 0; i < text.length(); i++) {
			String c = normalizeNFD(text.substring(i, i + 1));
			if (c.matches("[aeiouAEIOU].*")) c = c.replaceAll("[\\u0301\\u0300]", "");
			out.append(normalizeNFC(c));
		}
	    
		return out.toString();
	}
	

}
