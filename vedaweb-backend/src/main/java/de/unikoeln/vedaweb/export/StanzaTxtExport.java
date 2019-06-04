package de.unikoeln.vedaweb.export;

import java.util.List;
import java.util.Map;
import de.unikoeln.vedaweb.document.Stanza;
import de.unikoeln.vedaweb.document.StanzaVersion;
import de.unikoeln.vedaweb.util.LingConventions;
import de.unikoeln.vedaweb.util.MetricalParser;

public class StanzaTxtExport {
	
	private static final String NEXT_BLOCK_DELIM = "\n\n\n";
	private static final String HEADING_CONTENT_DELIM = "\n\n";
	
	
	public static String stanzaTxt(Stanza stanza, List<Map<String, String>> layers) {
		StringBuilder sb = new StringBuilder();
		sb.append(LingConventions.getSourceNotation(stanza)); //heading (stanza location)
		sb.append(NEXT_BLOCK_DELIM);

		for (Map<String, String> layer : layers) {
			// VERSIONS / TRANSLATIONS
			if (layer.get("id").matches("version_.+") || layer.get("id").matches("translation_.+")) {
				StanzaVersion v = stanza.getVersions()
						.stream().filter(ver -> ver.getId().equals(layer.get("id")))
						.findFirst().orElse(null);
				if (v == null) continue;
				sb.append(layer.get("label"));
				sb.append(HEADING_CONTENT_DELIM);
				for (String line : v.getForm())
					sb.append(line + "\n");
				sb.deleteCharAt(sb.length()-1);
			}
			// GLOSSINGS
			else if (layer.get("id").startsWith("glossing")) {
				sb.append(layer.get("label"));
				sb.append(HEADING_CONTENT_DELIM);
				sb.append(GlossingsTxtExport.glossingsTxtNoMeta(stanza));
			}
			// METRICAL DATA
			else if (layer.get("id").startsWith("metricaldata")) {
				sb.append(layer.get("label"));
				sb.append(HEADING_CONTENT_DELIM);
				for (String line : stanza.getMetricalData())
					sb.append(
							line.replaceAll(MetricalParser.S_SHORT_LETTER, MetricalParser.S_SHORT)
								.replaceAll(MetricalParser.S_LONG_LETTER, MetricalParser.S_LONG)
								+ "\n");
				sb.deleteCharAt(sb.length()-1);
			}
			else {
				continue;
			}
			sb.append(NEXT_BLOCK_DELIM);
		}
		
		sb.append(NEXT_BLOCK_DELIM);
		return sb.toString();
	}
	
}
