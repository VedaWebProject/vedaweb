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
	private HashMap<String, String> mappings;
	private boolean preProcess;
	
	/**
	 * Creates an instance using the given reference template with
	 * pre-processing set as defined. If pre-processing is enabled, added mappings
	 * will be pre-processed in place, which results in slower processing now 
	 * and higher memory use for the concordance but saves some processing 
	 * time when requesting a mapping.
	 * @param referenceTemplate
	 * @param preProcess
	 */
	public ArbitraryConcordance(String referenceTemplate, boolean preProcess) {
		super();
		this.setReferenceTemplate(referenceTemplate);
		this.mappings = new HashMap<String, String>();
		this.preProcess = preProcess && this.referenceTemplate != null;
	}
	
	/**
	 * Creates an instance using the given reference template with
	 * pre-processing turned on by default. This means that added mappings
	 * will be pre-processed in place, which results in slower processing now 
	 * and higher memory use for the concordance but saves some processing 
	 * time when requesting a mapping.
	 * @param referenceTemplate
	 */
	public ArbitraryConcordance(String referenceTemplate) {
		this(referenceTemplate, true);
	}
	
	/**
	 * Creates an instance without a reference template
	 * (and, implicitly, pre-processing turned off).
	 */
	public ArbitraryConcordance() {
		this(null);
	}
	
	/**
	 * Adds a single concordance mapping. If there is a reference template set
	 * and pre-processing is enabled, the reference will be pre-processed during
	 * this method call, which results slower processing now and higher memory 
	 * use for the concordance but saves some processing time when requesting 
	 * a mapping.
	 * @param key
	 * @param reference
	 */
	public void addMapping(String key, String reference) {
		mappings.put(
			key,
			preProcess
				? applyTemplate(reference)
				: reference
		);
	}
	
	/*
	 * Apply reference template (if any)
	 */
	private String applyTemplate(String reference) {
		return referenceTemplate != null 
				? referenceTemplate.replaceAll(PLACEHOLDER_QUOTED, reference) 
				: reference;
	}
	
	/**
	 * Adds a prepared Map<String, String> with concordance mappings following
	 * the algorithm of the add() method.
	 * @param mappings
	 */
	public void addMappings(Map<String, String> mappings) {
		if (!preProcess) {
			this.mappings.putAll(mappings);
		} else {
			for (String key : mappings.keySet()) {
				addMapping(key, mappings.get(key));
			}
		}
	}
	
	/**
	 * Returns the concordance mapping for the given key (if any, null otherwise).
	 * If there is a key delimiter set and the given key contains it, all possible
	 * sub-keys will be tried until a match is found (if any, null otherwise).
	 * @param key
	 * @return
	 */
	public String get(String key) {
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
		return preProcess || referenceTemplate == null
			? mappings.get(key)
			: applyTemplate(mappings.get(key));
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

}
