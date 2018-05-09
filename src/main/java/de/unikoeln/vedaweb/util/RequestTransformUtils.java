package de.unikoeln.vedaweb.util;

import java.text.Normalizer;
import java.text.Normalizer.Form;

public class RequestTransformUtils {
	
	
	public static String normalizeNFD(String s){
		return Normalizer.normalize(s, Form.NFD);
	}
	
	
	public static synchronized boolean isQueryForLocation(String input){
		return input.matches(".*\\d.*");
	}
	
	
	public static synchronized String normalizeId(String id){
		if (id.matches("\\d{7}"))
			return id;
		else if (id.matches("\\D*\\d{2}\\D\\d{3}\\D\\d{2}\\D*"))
			id = id.replaceAll("\\D", "");
		else
			id = constructId(id);
		return id;
	}
	
	
	public static synchronized String constructId(String input){
		String[] digits = input.split("\\D+");
		if (digits.length != 3) return "invalid";
		
		StringBuffer sb = new StringBuffer();
		
		sb.append(String.format("%02d", Integer.parseInt(digits[0])));
		sb.append(String.format("%03d", Integer.parseInt(digits[1])));
		sb.append(String.format("%02d", Integer.parseInt(digits[2])));
		
		return sb.toString();
	}
	
	
	public static synchronized int normalizeIndex(int index, int docCount){
		if (index < 0)
			index = docCount + index;
		else if (index >= docCount)
			index = index - docCount;
		return index;
	}
	

}
