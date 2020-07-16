package de.unikoeln.vedaweb.analysis.meter;

import java.text.Normalizer;
import java.text.Normalizer.Form;


/**
 * Parses an ISO-15919-transliterated Sanskrit string
 * into a metrical notation with long/short syllable markers.
 * @author bkis 
 *
 */
public class MetricalAnalysis {
	
	//default long/short marks
	public static final String LONG = "—";
	public static final String SHORT = "◡";
	
	//letter-based long/short marks
	public static final String LONG_LETTER = "L";
	public static final String SHORT_LETTER = "S";
	
	//whitespace supplements
	private static final String SPC = "\\s+";
	private static final String SPC_MARK = "_";
	private static final String SPC_OPT_MARK = SPC_MARK + "?";
	
	//matching vowels
	private static final String VL = "(ā|ī|ū|o|e|ai|au)";
	private static final String VS = "(a|i|u|r̥|l̥)";

	//meta chars
	private static final String METAS = "[ ̥]";

	//matching and marking consonants
	private static final String C_SINGLE = "(?!(a|i|u|r̥|l̥|\\s|" + METAS 
			+ "|" + SHORT + "|" + LONG + ")).";
	private static final String C_DOUBLE = "(ph|th|kh|bh|dh|gh|jh)";
	private static final String C_MARK = "#";


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
			.replaceAll(VL, LONG)
			
			// mark consonants with double char notation
			.replaceAll(C_DOUBLE, C_MARK) 
			
			// mark remaining consonants
			.replaceAll(C_SINGLE, C_MARK) 
			
			// mark whitespaces
			.replaceAll(SPC, SPC_MARK) 
			
			// mark short vowels followed by any another vowel as SHORT
			.replaceAll(VS + "(?=" + VS + "|" + VL + ")", SHORT) 
			
			// mark short vowels at line end as SHORT
			.replaceAll(VS + "$", SHORT) 
			
			// mark short vowels at word end followed by vowel as SHORT
			.replaceAll(VS + "(?=" + SPC_MARK + "[^" + C_MARK + "]" + ")", SHORT)
			
			// mark short vowels in last syllable of line as LONG
			.replaceAll(VS + C_MARK + "+$", LONG) 
			
			// mark short vowels followed by two consonants as LONG
			.replaceAll(VS + "(?=" + SPC_OPT_MARK + C_MARK + SPC_OPT_MARK 
					+ C_MARK + ")", LONG) 
			
			// mark short vowels followed by one consonant as SHORT
			.replaceAll(VS + "(?=" + SPC_OPT_MARK + C_MARK 
					+ ")(?!=" + SPC_OPT_MARK + C_MARK + ")", SHORT) 
			
			// remove all but metrical and and whitespace marks
			.replaceAll("[^" + LONG + SHORT + SPC_MARK + "]", "") 
			
			// replace whitespace marks by actual whitespaces
			.replaceAll(SPC_MARK + "+", " ")
			; 
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
			.replaceAll(LONG, longMark.charAt(0) + "")
			.replaceAll(SHORT, shortMark.charAt(0) + "");
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
	public static String[] parseMultiline(
			String iso,
			String longMark,
			String shortMark) {
		
		String[] lines = iso.split("\n");
		for (int i = 0; i < lines.length; i++)
			lines[i] = parse(lines[i], longMark, shortMark);
		return lines;
	}
	
	
	public static Result analyze(String iso) {
		return new Result(iso, LONG, SHORT);
	}
	
	
	public static Result analyze(
			String iso,
			String longMark,
			String shortMark) {
		
		return new Result(iso, longMark, shortMark);
	}
	
	
	public static Result[] analyzeMultiline(String iso) {
		String[] lines = iso.split("\n");
		Result[] results = new Result[lines.length];
		for (int i = 0; i < lines.length; i++)
			results[i] = analyze(lines[i]);
		return results;
	}
	
	
	public static Result[] analyzeMultiline(
			String iso,
			String longMark,
			String shortMark) {
		
		String[] lines = iso.split("\n");
		Result[] results = new Result[lines.length];
		for (int i = 0; i < lines.length; i++)
			results[i] = analyze(lines[i], longMark, shortMark);
		return results;
	}
	
	/*
	 * Cleans a string from accents (´ and `) and
	 * other symbols like -, =, /, \, _
	 */
	private static String cleanString(String in) {
		return Normalizer.normalize(
			Normalizer.normalize(in, Form.NFD)
				.replaceAll("[\u0301\u0300\u0027\\-+=_/\\\\]", ""),
			Form.NFC
		);
	}
	
	
	public static class Result {
		
		private String iso;
		private String[] isoSplit;
		private String metricalData;
		private String[] metricalDataSplit;
		private int[] positions;
		
		private Result(
				final String iso,
				final String longMark,
				final String shortMark) {
			this.iso = iso;
			this.isoSplit = this.iso.split(SPC);
			this.metricalData = parse(iso, longMark, shortMark);
			this.metricalDataSplit = this.metricalData.split(SPC);
			
			//compute positions
			this.positions = new int[metricalDataSplit.length];
			for (int i = 0; i < positions.length; i++) {
				if (i == 0) {
					positions[i] = 1;
					continue;
				}
				positions[i] = positions[i-1] + metricalDataSplit[i-1].length();
			}
		}
		
		public String getInputIso() {
			return iso;
		}
		
		public String[] getInputIsoSplit() {
			return isoSplit;
		}
		
		public String getMetricalData() {
			return metricalData;
		}
		
		public String[] getMetricalDataSplit() {
			return metricalDataSplit;
		}
		
		public int[] getMetricalPositions() {
			return positions;
		}
		
		public int getMetricalPosition(int termIndex) {
			if (termIndex < 0 || termIndex >= metricalDataSplit.length) {
				return -1;
			} else {
				return positions[termIndex];
			}
		}
		
		public int getMetricalPosition(String isoTerm) {
			int pos = -1;
			for (int i = 0; i < isoSplit.length; i++) {
				if (isoSplit[i].equals(isoTerm)) {
					pos = i;
					break;
				}
			}
			if (pos < 0) {
				return -1;
			} else {
				return positions[pos];
			}
		}
		
	}


}
