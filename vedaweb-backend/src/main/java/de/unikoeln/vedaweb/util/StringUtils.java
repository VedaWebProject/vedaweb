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
	
	
	public static String normalizeId(String id){
		if (id.matches("\\d{7}"))
			return id;
		else if (id.matches("\\D*\\d{2}\\D\\d{3}\\D\\d{2}\\D*"))
			id = id.replaceAll("\\D", "");
		else
			id = constructId(id);
		return id;
	}
	
	
	public static String constructId(String input){
		String[] digits = input.split("\\D+");
		if (digits.length != 3) return "invalid";
		
		StringBuffer sb = new StringBuffer();
		
		sb.append(String.format("%02d", Integer.parseInt(digits[0])));
		sb.append(String.format("%03d", Integer.parseInt(digits[1])));
		sb.append(String.format("%02d", Integer.parseInt(digits[2])));
		
		return sb.toString();
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
