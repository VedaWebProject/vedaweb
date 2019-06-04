package de.unikoeln.vedaweb.export;

import de.unikoeln.vedaweb.document.Pada;
import de.unikoeln.vedaweb.document.Stanza;
import de.unikoeln.vedaweb.document.Token;
import de.unikoeln.vedaweb.util.LingConventions;

public class GlossingsHtmlExport {

	private static final String HTML_DOC_TEMPLATE =
			"<!DOCTYPE html>\n" + 
			"<html>\n" + 
			"<head>\n" + 
			"	<meta charset=\"utf-8\">" +
			"	<title>###TITLE###</title>\n" + 
			"	<style>tr.forms {font-weight:bold;} table tr td {padding: 5px 10px;}</style>\n" +
			"</head>\n" + 
			"<body>\n" + 
			"	<h1>###HEADING###</h1>\n" +
			"	<table>\n" + 
			"		###TBODY###\n" + 
			"	</table>\n" + 
			"</body>\n" + 
			"</html>";
			
	
	public static String glossingsHtml(Stanza stanza) {
		StringBuilder sb = new StringBuilder();
		char padaIndex = 'a';
		
		for (Pada p : stanza.getPadas()) {
			sb.append("<tr class=\"forms\">");
			//pada index
			sb.append("<td>" + padaIndex++ + "</td>");
			//forms line
			for (Token t : p.getGrammarData()) {
				sb.append("<td>" + t.getForm() + "</td>");
			}
			sb.append("</tr><tr><td></td>");
			//glossing line
			for (Token t : p.getGrammarData()) {
				sb.append("<td>");
				sb.append(t.getLemma().replaceFirst("\\s+?\\d$", ""));
				for (String prop : LingConventions.GLOSSINGS_ORDER) {
					if (t.getProp(prop) != null) {
						sb.append("." + t.getProp(prop));
					}
				}
				sb.append("</td>");
			}
			sb.append("</tr>");
		}
		
		String title = LingConventions.getSourceNotation(stanza);
		
		return HTML_DOC_TEMPLATE
			.replaceFirst("###TITLE###", title)
			.replaceFirst("###HEADING###", title)
			.replaceFirst("###TBODY###", sb.toString());
	}

	
}
