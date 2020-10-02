package de.unikoeln.vedaweb.export;

import de.unikoeln.vedaweb.document.Stanza;
import de.unikoeln.vedaweb.document.StanzaVersion;
import de.unikoeln.vedaweb.export.ExportLayers.ExportLayer;
import de.unikoeln.vedaweb.util.LingConventions;

/**
 * Utility class for the stanza plain text export
 * 
 * @author bkis
 *
 */
public class StanzaTxtExport {
	
	private static final String NEXT_BLOCK_DELIM = "\n\n\n";
	private static final String HEADING_CONTENT_DELIM = "\n\n";
	
	
	public static String stanzaTxt(Stanza stanza, ExportLayers layers) {
		StringBuilder sb = new StringBuilder();
		sb.append(LingConventions.getSourceNotation(stanza)); //heading (stanza location)
		sb.append(NEXT_BLOCK_DELIM);

		for (ExportLayer layer : layers.layers) {
			// VERSIONS / TRANSLATIONS
			if (layer.id.matches("version_.+") || layer.id.matches("translation_.+")) {
				StanzaVersion v = stanza.getVersions()
						.stream().filter(ver -> ver.getId().equals(layer.id))
						.findFirst().orElse(null);
				if (v == null) continue;
				sb.append(layer.label);
				sb.append(HEADING_CONTENT_DELIM);
				for (String line : v.getForm())
					sb.append(line + "\n");
				sb.deleteCharAt(sb.length()-1);
			}
			// GLOSSINGS
			else if (layer.id.startsWith("glossing")) {
				sb.append(layer.label);
				sb.append(HEADING_CONTENT_DELIM);
				sb.append(GlossingsTxtExport.glossingsTxtNoMeta(stanza));
			}
			// METRICAL DATA
//			else if (layer.id.startsWith("metricaldata")) {
//				sb.append(layer.label);
//				sb.append(HEADING_CONTENT_DELIM);
//				for (String line : stanza.getMetricalData())
//					sb.append(
//							line.replaceAll(MetricalParser.S_SHORT_LETTER, MetricalParser.S_SHORT)
//								.replaceAll(MetricalParser.S_LONG_LETTER, MetricalParser.S_LONG)
//								+ "\n");
//				sb.deleteCharAt(sb.length()-1);
//			}
			else {
				continue;
			}
			sb.append(NEXT_BLOCK_DELIM);
		}
		
		sb.append(NEXT_BLOCK_DELIM);
		return sb.toString();
	}
	
}
