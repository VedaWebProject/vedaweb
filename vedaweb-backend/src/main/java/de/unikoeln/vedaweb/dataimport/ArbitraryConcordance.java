package de.unikoeln.vedaweb.dataimport;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * Helper class to hold arbitrary concordances
 * 
 * @author bkis
 * 
 */
public class ArbitraryConcordance {
	
	public static final String PLACEHOLDER = "${{PLACEHOLDER}}";
	private static final String PLACEHOLDER_QUOTED = Pattern.quote(PLACEHOLDER);
	
	private String referenceTemplate;
	private String keyDelimiter;
	private String referenceDelimiter;
	private HashMap<String, String[]> mappings;
	private String description;
	
	
	/**
	 * Creates an instance using the given reference template.
	 * @param referenceTemplate
	 */
	public ArbitraryConcordance(String referenceTemplate) {
		super();
		this.setReferenceTemplate(referenceTemplate);
		this.mappings = new HashMap<String, String[]>();
	}
	
	/**
	 * Creates an instance without a reference template.
	 */
	public ArbitraryConcordance() {
		this(null);
	}
	
	/**
	 * Adds a single concordance mapping.
	 * @param key
	 * @param reference
	 */
	public void addMapping(String key, String reference) {
		String[] ref = referenceDelimiter != null
			? reference.split(referenceDelimiter)
			: new String[]{reference};
		mappings.put(key, ref);
	}
	
	/*
	 * Apply reference template (if any)
	 */
	private String[] applyTemplate(String[] refs) {
		if (referenceTemplate != null) {
			refs = refs.clone();
			for (int i = 0; i < refs.length; i++) {
				refs[i] = referenceTemplate.replaceAll(PLACEHOLDER_QUOTED, refs[i]);
			}
		}
		return refs;
	}
	
	/**
	 * Adds a prepared Map<String, String> with concordance mappings following
	 * the algorithm of the add() method.
	 * @param mappings
	 */
	public void addMappings(Map<String, String[]> mappings) {
		this.mappings.putAll(mappings);
	}
	
	/**
	 * Returns the concordance mapping for the given key (if any, null otherwise).
	 * If there is a key delimiter set and the given key contains it, all possible
	 * sub-keys will be tried until a match is found (if any, null otherwise).
	 * @param key
	 * @return
	 */
	public String[] get(String key) {
		if (keyDelimiter == null && !mappings.containsKey(key)) {
			return null;
		}
		while (keyDelimiter != null && !mappings.containsKey(key)) {
			if (key.contains(keyDelimiter)) {
				key = key.substring(0, key.lastIndexOf(keyDelimiter));
			} else {
				return null;
			}
		}
		return applyTemplate(mappings.get(key));
	}
	
	/**
	 * Returns the set reference template (if any, null otherwise)
	 * @return
	 */
	public String getReferenceTemplate() {
		return referenceTemplate;
	}

	private void setReferenceTemplate(String referenceTemplate) {
		if (referenceTemplate == null) return;
		if (!referenceTemplate.contains(PLACEHOLDER)) {
			throw new IllegalArgumentException(
					"The given URL template doesn't contain the URL placeholder " 
					+ this.getClass().getCanonicalName() + ".PLACEHOLDER "
							+ "(which is '" + PLACEHOLDER + "').");
		}
		this.referenceTemplate = referenceTemplate;
	}
	
	/**
	 * Returns the set key delimiter (if any, null otherwise).
	 * @return
	 */
	public String getKeyDelimiter() {
		return keyDelimiter;
	}
	
	
	/**
	 * Sets the key delimiter to use. This can be used if the key is formed
	 * from parts of a hierarchical structure, e.g. "12-54-3-8", where a mapping
	 * request with a key delimiter "-" would look for "12-54-3-8" first and
	 * then for "12-54-3", "12-54" and "12" in this order.
	 * @param keyDelimiter
	 */
	public void setKeyDelimiter(String keyDelimiter) {
		this.keyDelimiter = keyDelimiter;
	}
	
	
	/**
	 * Returns the set reference delimiter (if any, null otherwise).
	 * @return
	 */
	public String getReferenceDelimiter() {
		return referenceDelimiter;
	}
	
	
	/**
	 * Sets the reference delimiter to use. This can be used if the reference
	 * might be made of multiple separated values.
	 * @param keyDelimiter
	 */
	public void setReferenceDelimiter(String referenceDelimiter) {
		if (mappings.size() > 0) {
			throw new IllegalStateException("A reference delimiter must be set "
					+ "before any mappings are added!");
		}
		this.referenceDelimiter = referenceDelimiter;
	}
	
	
	public String getDescription() {
		return description;
	}

	
	public void setDescription(String description) {
		this.description = description;
	}


	/**
	 * Clears all saved mappings
	 */
	public void clearMappings() {
		mappings.clear();
	}
	
	/**
	 * A naive but robust routine that imports/adds mapping data from 
	 * a CSV structure. Only the first two columns of the CSV structure 
	 * will be used. Any invalid parts of the data (single lines missing 
	 * cells etc.) will be ignored selectively to process and 
	 * import as much valid data as possible. In general this routine tries
	 * to remain silent if anything is wrong with the given data and just
	 * processes the valid parts, so make sure to feed 
	 * it with healthy arguments.
	 * @param csvData The CSV data in plain text form
	 * @param hasHeader If present, first line of CSV data will be ignored
	 * @param delimiter Delimiter char of CSV structure
	 * @param quote Quote char of CSV structure
	 */
	public void addFromCsv (
			final String csvData, 
			final boolean hasHeader,
			final String delimiter, 
			final String quote) {
		
		//check for presence of csv data
		if (csvData == null) return;
		
		String[] lines = csvData.split("\n"); //split into lines
		if (lines.length < (hasHeader ? 2 : 1)) return; //abort if no lines
		
		//process lines
		for (int l = (hasHeader ? 1 : 0); l < lines.length; l++) {
			String[] cells = lines[l].split(delimiter); //split into values/cells
			if (cells.length < 2) continue;
			String key = cells[0].replaceAll(Pattern.quote(quote), "").trim();
			String ref = cells[1].replaceAll(Pattern.quote(quote), "").trim();
			if (key.length() + ref.length() < 2) continue;
			addMapping(key, ref);
		}
	}
	
	
	public void addFromCsv (Csv csv) {
		
		//check for presence of csv data
		if (csv.csvData == null) return;
		
		String[] lines = csv.csvData.split("\n"); //split into lines
		if (lines.length < (csv.hasHeader ? 2 : 1)) return; //abort if no lines
		
		//process lines
		for (int l = (csv.hasHeader ? 1 : 0); l < lines.length; l++) {
			String[] cells = lines[l].split(csv.delimiter); //split into values/cells
			if (cells.length < 2) continue;
			String key = cells[0].replaceAll(Pattern.quote(csv.quote), "").trim();
			String ref = cells[1].replaceAll(Pattern.quote(csv.quote), "").trim();
			if (key.length() + ref.length() < 2) continue;
			addMapping(key, ref);
		}
	}
	
	
	public int mappingsCount() {
		return mappings.size();
	}
	
	
	public static class Csv {
		final String csvData; 
		final boolean hasHeader;
		final String delimiter; 
		final String quote;
		
		public Csv(
				final String csvData, 
				final boolean hasHeader,
				final String delimiter, 
				final String quote) {
			this.csvData = csvData;
			this.hasHeader = hasHeader;
			this.delimiter = delimiter;
			this.quote = quote;
		}
	}

}
