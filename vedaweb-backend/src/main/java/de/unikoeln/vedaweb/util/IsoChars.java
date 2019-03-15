package de.unikoeln.vedaweb.util;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class IsoChars {
	
	public static final List<String> ISO_VOWELS = Arrays.asList(new String[]
		{"au", "ai", "a", "ā", "i", "ī", "u", "ū", "r̥", "r̥̄", "l̥", "l̥̄", "ē", "e", "ō", "o"}
	);
	
	public static final List<String> ISO_OTHERS = Arrays.asList(new String[]
		{"ṁ", "ḥ", "~"}
	);
	
	public static final List<String> ISO_CONSONANTS = Arrays.asList(new String[]
		{"k", "kh", "g", "gh", "ṅ", "c", "ch", "j", "jh", "ñ", "ṭ", "ṭh", "ḍ", "ḍh", "ṇ", "t", "th", "d", "dh", "n", "p", "ph", "b", "bh", "m", "y", "r", "l", "v", "ś", "ṣ", "s", "h", "ḻ", "kṣ", "jñ"}
	);
	
	public static final List<String> ISO_SYMBOLS = Arrays.asList(new String[]
		{"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "oṃ", "", "।", "॥"}
	);
	
	public static final Map<String, String> VOWELS_WITH_TO_NO_ACCENTS;
	
	static {
		Map<String, String> vmap = new HashMap<>();
		vmap.put("á", "a");
		vmap.put("ā́", "ā");
		vmap.put("í", "i");
		vmap.put("ī́", "ī");
		vmap.put("ú", "u");
		vmap.put("ū́", "ū");
		vmap.put("ŕ̥", "r̥");
		vmap.put("ĺ̥", "l̥");
		vmap.put("é", "e");
		vmap.put("ó", "o");
		VOWELS_WITH_TO_NO_ACCENTS = vmap;
	}

}
