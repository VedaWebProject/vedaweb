package de.unikoeln.vedaweb.util;

import java.text.Normalizer;
import java.text.Normalizer.Form;

/**
 * Parses an ISO-15919-transliterated Sanskrit string
 * into a metrical notation with long/short syllable markers.
 * @author bkis 
 *
 */
public class MetricalParser {
	
	//default long/short marks
	private static final String S_LONG = "—";
	private static final String S_SHORT = "◡";
	
	//whitespace supplements
	private static final String SPC = "\\s+";
	private static final String SPC_MARK = "_";
	private static final String SPC_MARK_OPT = SPC_MARK + "?";
	
	//matching and marking consonants
	private static final String C = "(?!(a|i|u|r̥|l̥|\\s|" + S_SHORT + "|" + S_LONG + ")).";
	private static final String C_DOUBLE = "(ph|th|kh|bh|dh|gh|jh|ch)";
	private static final String C_MARK = "#";
	
	//matching vowels
	private static final String VL = "(ā|ī|ū|o|e|ai|au)";
	private static final String VK = "[aiur̥l̥]";
	

	/**
	 * Parses an ISO-15919-transliterated Sanskrit string
	 * into a metrical notation with long/short syllable markers.
	 * @param iso The ISO-15919 string
	 * @return The metre data
	 */
	public static String parse(String iso) {
		return
			// clean string from unwanted chars and diacritics
			cleanString(iso)
			// mark long vowels as LONG
			.replaceAll(VL, S_LONG)
			// mark consonants with double char notation
			.replaceAll(C_DOUBLE, C_MARK) 
			// mark remaining consonants
			.replaceAll(C, C_MARK) 
			// mark whitespaces
			.replaceAll(SPC, SPC_MARK) 
			// mark short vowels at line end as SHORT
			.replaceAll(VK + "$", S_SHORT) 
			// mark short vowels in last syllable of line as LONG
			.replaceAll(VK + C_MARK + "+$", S_LONG) 
			// mark short vowels followed by two consonants as LONG
			.replaceAll(VK + "(?=" + SPC_MARK_OPT + C_MARK + SPC_MARK_OPT + C_MARK + ")", S_LONG) 
			// mark short vowels followed by one consonant as SHORT
			.replaceAll(VK + "(?=" + SPC_MARK_OPT + C_MARK + ")(?!=" + SPC_MARK_OPT + C_MARK + ")", S_SHORT) 
			// remove all but metrical and and whitespace marks
			.replaceAll("[^" + S_LONG + S_SHORT + SPC_MARK + "]", "") 
			// replace whitespace marks by actual whitespaces
			.replaceAll(SPC_MARK, " "); 
	}
	
	/**
	 * Parses an ISO-15919-transliterated Sanskrit string
	 * into a metrical notation with custom long/short syllable markers.
	 * @param iso The ISO-15919 string
	 * @param longMark Custom mark for long syllables
	 * @param shortMark Custom mark for short syllables
	 * @return The metre data
	 */
	public static String parse(String iso, String longMark, String shortMark) {
		return parse(iso)
			.replaceAll(S_LONG, longMark)
			.replaceAll(S_SHORT, shortMark);
	}
	
	/**
	 * Parses an ISO-15919-transliterated Sanskrit string
	 * into a metrical notation with long/short syllable markers.
	 * Multiline strings will be parsed line by line
	 * and returned in an array of lines.
	 * @param iso The ISO-15919 string
	 * @return The metre data
	 */
	public static String[] parseMultiline(String iso) {
		String[] lines = iso.split("\n");
		for (int i = 0; i < lines.length; i++)
			lines[i] = parse(lines[i]);
		return lines;
	}
	
	/**
	 * Parses an ISO-15919-transliterated Sanskrit string
	 * into a metrical notation with custom long/short syllable markers.
	 * Multiline strings will be parsed line by line
	 * and returned in an array of lines.
	 * @param iso The ISO-15919 string
	 * @param longMark Custom mark for long syllables
	 * @param shortMark Custom mark for short syllables
	 * @return The metre data
	 */
	public static String[] parseMultiline(String iso, String longMark, String shortMark) {
		String[] lines = iso.split("\n");
		for (int i = 0; i < lines.length; i++)
			lines[i] = parse(lines[i], longMark, shortMark);
		return lines;
	}
	
	/*
	 * Cleans a string from accents (´ and `) and
	 * other symbols like -, =, /, \, _
	 */
	private static String cleanString(String in) {
		return Normalizer.normalize(
			Normalizer.normalize(in, Form.NFD)
				.replaceAll("[\u0301\u0300\u0027\\-=\\_/\\\\]", ""),
			Form.NFC
		);
	}

}
