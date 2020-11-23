package de.unikoeln.vedaweb.analysis.meter;

import java.text.Normalizer;
import java.text.Normalizer.Form;


/**
 * 
 * This utility class performs metrical analysis operations on
 * ISO-15919-transliterated Sanskrit strings.
 * 
 * @author bkis 
 *
 */
public class MetricalAnalysis {
	
	//default long/short marks
	public static final String LONG = "—";
	public static final String SHORT = "◡";
	public static final String PAUSE = "·";
	
	//letter-based long/short marks
	public static final String LONG_LETTER = "L";
	public static final String SHORT_LETTER = "S";
	public static final String PAUSE_LETTER = "P";
	
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
			+ "|" + SHORT + "|" + LONG + "|" + PAUSE + ")).";
	private static final String C_DOUBLE = "(ph|th|kh|bh|dh|gh|jh)";
	private static final String C_MARK = "#";
	
	//matching metrical pause
	private static final String P = "\u0300"; // space with gravis:  ̀


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
			
			// mark metrical pauses (space with gravis in VN&H) as PAUSE
			.replaceAll(P, PAUSE)
			
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
			.replaceAll(VS + "(?=" + SPC_MARK + 
					"[^" + C_MARK + PAUSE + "]" + ")", SHORT)
			
			// mark short vowels in last syllable of line as LONG
			.replaceAll(VS + C_MARK + "+$", LONG) 
			
			// mark short vowels followed by two consonants as LONG
			.replaceAll(VS + "(?=" + SPC_OPT_MARK + C_MARK + SPC_OPT_MARK 
					+ C_MARK + ")", LONG) 
			
			// mark short vowels followed by one consonant as SHORT
			.replaceAll(VS + "(?=" + SPC_OPT_MARK + C_MARK 
					+ ")(?!=" + SPC_OPT_MARK + C_MARK + PAUSE + ")", SHORT) 
			
			// remove all but metrical and and whitespace marks
			.replaceAll("[^" + LONG + SHORT + PAUSE + SPC_MARK + "]", "") 
			
			// replace whitespace marks by actual whitespaces
			.replaceAll(SPC_MARK + "+", " ")
			; 
	}
	
	
	/**
	 * Parses an ISO-15919-transliterated Sanskrit string
	 * into a metrical notation with custom long/short syllable markers.
	 * If a syllable marker string has a length longer than 1, it will
	 * be trimmed to the first character.
	 * 
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
	 * 
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
	 * 
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
	
	/**
	 * Annotates the words in an ISO-15919-transliterated Sanskrit string
	 * with their respective metrical positions in-line. The tokenization
	 * of the string is done by simply splitting at whitespaces, specifically
	 * using the regular expression <code>\\s+</code>
	 * <br><br>
	 * Example input: <code>agním īḷe puróhitaṁ</code><br>
	 * Example output: <code>1_agním 3_īḷe 5_puróhitaṁ</code>
	 * 
	 * @param iso The input ISO-15919-transliterated Sanskrit string
	 * @return The annotated input string
	 */
	public static String annotate(String iso) {
		String[] isoSplit = iso.split(SPC);
		String[] metricalDataSplit = parse(iso).split(SPC);
		int[] positions = new int[metricalDataSplit.length];
		
		//compute positions
		for (int i = 0; i < positions.length; i++) {
			if (i == 0) {
				positions[i] = 1;
			} else {
				positions[i] = positions[i-1] + metricalDataSplit[i-1].length();
			}
			isoSplit[i] = positions[i] + "_" + isoSplit[i];
		}
		
		return String.join(" ", isoSplit);
	}
	
	/**
	 * Annotates the words in a multiline ISO-15919-transliterated Sanskrit string
	 * with their respective metrical positions in-line, per line. The tokenization
	 * of the string is done by simply splitting at whitespaces, specifically
	 * using the regular expression <code>\\s+</code>
	 * <br><br>
	 * Example input: <code>agním īḷe puróhitaṁ</code><br>
	 * Example output: <code>1_agním 3_īḷe 5_puróhitaṁ</code>
	 * 
	 * @param iso The input multiline ISO-15919-transliterated Sanskrit string
	 * @return A string array containing the annotated lines
	 */
	public static String[] annotateMultiline(String iso) {
		String[] lines = iso.split("\n");
		return annotateMultiline(lines);
	}
	
	/**
	 * Annotates the words in a multiline ISO-15919-transliterated Sanskrit string
	 * with their respective metrical positions in-line, per line. The tokenization
	 * of the string is done by simply splitting at whitespaces, specifically
	 * using the regular expression <code>\\s+</code>
	 * <br><br>
	 * Example input: <code>agním īḷe puróhitaṁ</code><br>
	 * Example output: <code>1_agním 3_īḷe 5_puróhitaṁ</code>
	 * 
	 * @param iso The input multiline ISO-15919-transliterated Sanskrit string
	 * @return A string array containing the annotated lines
	 */
	public static String[] annotateMultiline(String[] iso) {
		for (int i = 0; i < iso.length; i++)
			iso[i] = annotate(iso[i]);
		return iso;
	}
	
	
	/*
	 * Cleans a string from acute accents (´) and
	 * other symbols like -, =, /, \, _
	 */
	private static String cleanString(String in) {
		return Normalizer.normalize(
			Normalizer.normalize(in, Form.NFD)
				.replaceAll("[\u0301\u0027\\-+=_/\\\\]", ""),
			Form.NFC
		);
	}
	
	
//	public static void main(String[] args) {
//		String a = parse("yé asyā ̀ ācáraṇeṣu dadhriré");
//		String b = parse("úṣo yé te ̀ prá yā́meṣu yuñjáte");
//		String c = parse("kadā́ vaso ̀ stotráṁ háryate ā́");
//		System.out.println("01.048.03c: " + a + " (" + 
//				a.replaceAll("\\s", "").length() + ")");
//		System.out.println("01.048.04a: " + b + " (" + 
//				b.replaceAll("\\s", "").length() + ")");
//		System.out.println("10.105.01a: " + c + " (" + 
//				c.replaceAll("\\s", "").length() + ")");
//	}
	
	
}
