package de.unikoeln.vedaweb.util;

import java.io.File;
import java.util.List;

import javax.xml.transform.stream.StreamSource;

import de.unikoeln.vedaweb.data.Pada;
import de.unikoeln.vedaweb.data.Token;
import de.unikoeln.vedaweb.data.Verse;
import de.unikoeln.vedaweb.data.VerseVersion;
import net.sf.saxon.s9api.Processor;
import net.sf.saxon.s9api.QName;
import net.sf.saxon.s9api.SaxonApiException;
import net.sf.saxon.s9api.SaxonApiUncheckedException;
import net.sf.saxon.s9api.XPathCompiler;
import net.sf.saxon.s9api.XdmItem;
import net.sf.saxon.s9api.XdmNode;
import net.sf.saxon.s9api.XdmValue;

public class XmlDataImportUtils {
	
	
	public static void collectVersesFromXML(File xmlFile, List<Verse> versesList) throws SaxonApiException{
		//xml parsing prep
		Processor processor = new Processor(false);
		XdmNode xmlDoc = processor.newDocumentBuilder().build(new StreamSource(xmlFile));
		XPathCompiler compiler = processor.newXPathCompiler();
		//compiler.declareNamespace("xml", "http://www.tei-c.org/ns/1.0");
		
		//iterate: hymns
		XdmValue hymns = compiler.evaluate(".//*:div[@type='hymn']", xmlDoc);
		for(XdmItem hymn : hymns){
			//collect hymn data
			String hymnAddressee = compiler.evaluate("*:div[@type='dedication']/*:div[@type='addressee']/*:p/text()[1]", hymn)
					.itemAt(0).getStringValue();
			String hymnGroup = compiler.evaluate("*:div[@type='dedication']/*:div[@type='group']/*:p/text()[1]", hymn)
					.itemAt(0).getStringValue();
		
			//iterate: verses
			XdmValue verses = compiler.evaluate("*:div[@type='verse']", hymn);
			for(XdmItem verse : verses){
				String[] verseLocationData = compiler.evaluate("@*:n", verse).itemAt(0).getStringValue().split("\\.");
				
				//verse obj data
				Verse verseObj = new Verse();
				verseObj.setBook(Integer.parseInt(verseLocationData[0]));
				verseObj.setHymn(Integer.parseInt(verseLocationData[1]));
				verseObj.setVerse(Integer.parseInt(verseLocationData[2]));
				verseObj.setId(verseLocationData[0] + verseLocationData[1] + verseLocationData[2]);
				verseObj.setHymnAddressee(hymnAddressee);
				verseObj.setHymnGroup(hymnGroup);
				verseObj.setStrata(compiler.evaluate("*:lg[@*:source='gunkel_ryan']/*:lg/*:fs/*:f[@*:name='strata']/text()", verse).itemAt(0).getStringValue());
				
				//iterate: padas
				int padaIndex = 0;
				XdmValue padaForms = compiler.evaluate("*:lg[@*:source='zurich']/*:l[@*:n]", verse);
				
				for (XdmItem padaForm : padaForms){
					String padaId = compiler.evaluate("@*:n", padaForm).itemAt(0).getStringValue();
					String padaXmlId = compiler.evaluate("@*:id", padaForm).itemAt(0).getStringValue().replaceFirst("_zur$", "_tokens_zur");
					XdmValue padaTokens = compiler.evaluate("*:lg[@*:source='zurich']/*:l[@*:id='" + padaXmlId + "']/*:w", verse);
					verseObj.addPada(generatePadaObject(
						verse,
						padaIndex,
						padaId,
						padaForm.getStringValue(),
						padaTokens,
						compiler
					));
					padaIndex++;
				}
				
				//set token indices
				int tokenIndex = 0;
				for (Pada p : verseObj.getPadas()){
					for (Token t : p.getTokens()){
						t.setIndex(tokenIndex++);
					}
				}
				
				
				//// verse versions (translations etc.) ////
				XdmValue temp;
				XdmItem versionNode;
				VerseVersion version;
				String[] versionForm;
				
				// SAMITHA / gunkel_ryan
				temp = compiler.evaluate("*:l[@*:source='grassmann']", verse);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l[@*:ana='samitha']", versionNode));
					version = new VerseVersion(
						"Samitha (Gunkel, Ryan)",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"version"
					);
					verseObj.addVersion(version);
				}
				
				
				// SASA PATHA / gunkel_ryan
				temp = compiler.evaluate("*:lg[@*:source='gunkel_ryan']", verse);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l[@*:ana='sasa_patha']", versionNode));
					version = new VerseVersion(
						"Sasa Patha (Gunkel, Ryan)",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"version"
					);
					verseObj.addVersion(version);
				}
				
				// Van Nooten, Holland / vnh
				temp = compiler.evaluate("*:lg[@*:source='vnh']", verse);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l", versionNode));
					version = new VerseVersion(
						"Van Nooten, Holland",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"version"
					);
					verseObj.addVersion(version);
				}
				
				// Aufrecht / aufrecht
				temp = compiler.evaluate("*:lg[@*:source='aufrecht']", verse);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l", versionNode));
					version = new VerseVersion(
						"Aufrecht",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"version"
					);
					verseObj.addVersion(version);
				}
				
				// Padapatha / padapatha
				temp = compiler.evaluate("*:l[@*:source='padapatha']", verse);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = new String[]{versionNode.getStringValue().replaceAll("\\s+", " ").trim()};
					version = new VerseVersion(
						"Padapatha",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"version"
					);
					verseObj.addVersion(version);
				}
				
				// Devanagari / detlef
				temp = compiler.evaluate("*:lg[@*:source='detlef']", verse);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l", versionNode));
					version = new VerseVersion(
						"Detlef",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"version"
					);
					verseObj.addVersion(version);
				}
				
				// Translation (de) / geldner
				temp = compiler.evaluate("*:l[@*:source='geldner']", verse);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = new String[]{versionNode.getStringValue()};
					version = new VerseVersion(
						"Geldner",
						"de",
						versionForm,
						"translation"
					);
					verseObj.addVersion(version);
				}
				
				// Translation (de) / grassmann
				temp = compiler.evaluate("*:l[@*:source='grassmann']", verse);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = new String[]{versionNode.getStringValue()};
					version = new VerseVersion(
						"Grassmann",
						"de",
						versionForm,
						"translation"
					);
					verseObj.addVersion(version);
				}
					
				// Translation (en) / griffith
				temp = compiler.evaluate("*:lg[@*:source='griffith']", verse);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l", versionNode));
					version = new VerseVersion(
						"Griffith",
						"en",
						versionForm,
						"translation"
					);
					verseObj.addVersion(version);
				}
				
				versesList.add(verseObj);
			}
		}
	}
	
	
	private static Pada generatePadaObject(
			XdmItem verse,
			int padaIndex,
			String padaId,
			String padaForm,
			XdmValue padaTokens,
			XPathCompiler compiler)
					throws IndexOutOfBoundsException, SaxonApiUncheckedException, SaxonApiException{
		
		Pada pada = new Pada();
		pada.setForm(padaForm);
		pada.setIndex(padaIndex);
		pada.setLine(padaId.charAt(padaId.length() - 1));
		
		//label (by gunkel/ryan)
		String padaXmlId = compiler.evaluate("@*:id", padaTokens.itemAt(0))
				.itemAt(0).getStringValue().replaceFirst("_\\d\\d_zur$", "_gunkel_ryan");
		XdmValue strataNode = compiler.evaluate("*:lg[@*:source='gunkel_ryan']/*:lg[@*:id='" + padaXmlId + "']/*:fs/*:f[@*:name='label']/text()", verse);
		if (strataNode.size() > 0)
			pada.setLabel(strataNode.itemAt(0).getStringValue());
		
		for (XdmItem token : padaTokens){
			Token tokenObj = new Token();
			tokenObj.setLemma(((XdmNode)token).getAttributeValue(new QName("lemma")).trim());
			tokenObj.setLemmaRef(extractLemmaRefs((XdmNode)token));
			tokenObj.setForm(compiler.evaluate("text()", token).itemAt(0).getStringValue().trim());
			//iterate token attributes
			XdmValue tokenAttributes = compiler.evaluate(".//*:f/*:symbol", token);
			for (XdmItem tokenAttribute : tokenAttributes){
				String attName = compiler.evaluate("../@name", tokenAttribute).itemAt(0).getStringValue();
				String attValue = compiler.evaluate("@*:value", tokenAttribute).itemAt(0).getStringValue();
				tokenObj.addGrammarAttribute(attName, attValue);
			}
			pada.addToken(tokenObj);
		}
		
		return pada;
	}
	
	
	private static String[] extractLemmaRefs(XdmNode token) {
		//sample for lemmaRef attribute value: ['lemma_id_1695', 'lemma_iq_1681']
		return token.getAttributeValue(new QName("lemmaRef"))
				.replaceAll("[\\[\\]\\'\\s]", "")
				.split("\\,");
	}
	
	
	private static String[] concatTextContents(XdmValue nodes) {
		String[] lines = new String[nodes.size()];
		
		for (int i = 0; i < lines.length; i++) {
			lines[i] = nodes.itemAt(i).getStringValue();
		}
		
		return lines;
	}
	

}
