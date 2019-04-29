package de.unikoeln.vedaweb.export;

import de.unikoeln.vedaweb.search.SearchHit;
import de.unikoeln.vedaweb.search.SearchHits;

public class CsvExport {
	
	private static final String DLMT = ";";
	
	private static final String CSV_HEADER_SEARCH_HITS =
			q("book") + DLMT + q("hymn") + DLMT + q("stanza") + DLMT +
			q("hymnAddressee") + DLMT + q("hymnGroup") + DLMT +
			q("strata") + DLMT + q("contextKey") + DLMT + q("contextValue");
	
	private static final String PATTERN_TAGS = "\\<[^\\>]+\\>";
	
	
	
	public static String searchHitsAsCsv(SearchHits searchHits) {
		StringBuilder csv = new StringBuilder();
		csv.append(CSV_HEADER_SEARCH_HITS + "\n");

		for (SearchHit hit : searchHits.getHits()) {
			String[] id = hit.getDocId().split("\\.");
			String common = q(id[0]) + DLMT + q(id[1]) + DLMT + q(id[2])
					+ DLMT + q(hit.getHymnAddressee()) + DLMT
					+ q(hit.getHymnGroup()) + DLMT + q(hit.getStanzaStrata());
			for (String contextKey : hit.getHighlight().keySet()) {
				csv.append(common + DLMT + q(contextKey) + DLMT
						+ q(hit.getHighlight().get(contextKey).replaceAll(PATTERN_TAGS, "")));
			}
			csv.append("\n");
		}
		
		return csv.toString();
	}
	
	/*
	 * Quote string
	 */
	private static String q(String s) {
		return "\"" + s.replaceAll("\\\"", "\\\\\"") + "\"";
	}

}
