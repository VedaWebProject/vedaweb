package de.unikoeln.vedaweb.export;

import de.unikoeln.vedaweb.search.SearchHit;
import de.unikoeln.vedaweb.search.SearchHits;

public class CsvExport {
	
	private static final String CSV_DELIMITER = "\";\"";
	
	private static final String CSV_HEADER_SEARCH_HITS =
			"\"book" + CSV_DELIMITER + "hymn" + CSV_DELIMITER + "stanza"
			 + CSV_DELIMITER + "hymnAddressee"
			 + CSV_DELIMITER + "hymnGroup" + CSV_DELIMITER + "strata"
			 + CSV_DELIMITER + "contextKey" + CSV_DELIMITER + "contextValue\"";
	
	private static final String PATTERN_TAGS = "\\<[^\\>]+\\>";
	
	
	
	public static String searchHitsAsCsv(SearchHits searchHits) {
		StringBuilder csv = new StringBuilder();
		csv.append(CSV_HEADER_SEARCH_HITS + "\n");

		for (SearchHit hit : searchHits.getHits()) {
			String[] id = hit.getDocId().split("\\.");
			String common = "\"" + id[0] + CSV_DELIMITER + id[1] + CSV_DELIMITER + id[2]
					+ CSV_DELIMITER + hit.getHymnAddressee() + CSV_DELIMITER
					+ hit.getHymnGroup() + CSV_DELIMITER + hit.getStanzaStrata()
					+ CSV_DELIMITER;
			for (String contextKey : hit.getHighlight().keySet()) {
				csv.append(common + contextKey + CSV_DELIMITER
						+ hit.getHighlight().get(contextKey).replaceAll(PATTERN_TAGS, "") + "\"\n");
			}
		}
		
		return csv.toString();
	}

}
