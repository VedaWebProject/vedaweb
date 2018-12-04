package de.unikoeln.vedaweb.util;

import java.io.File;
import java.util.ArrayList;
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

public class XmlDataImport {
	
	
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
			String hymnAddressee = compiler.evaluate("*:div[@type='dedication']/*:div[@type='addressee']/*:p[@*:lang='en']/text()[1]", hymn)
					.itemAt(0).getStringValue();
			String hymnGroup = compiler.evaluate("*:div[@type='dedication']/*:div[@type='group']/*:p[@*:lang='en']/text()[1]", hymn)
					.itemAt(0).getStringValue();
			int hymnAbs = Integer.parseInt(compiler.evaluate("@*:ana", hymn)
					.itemAt(0).getStringValue());
		
			//iterate: verses
			XdmValue verses = compiler.evaluate("*:div[@type='verse']", hymn);
			for(XdmItem verse : verses){
				String[] verseLocationData = compiler.evaluate("@*:n", verse).itemAt(0).getStringValue().split("\\.");
				
				//verse obj data
				Verse verseObj = new Verse();
				verseObj.setBook(Integer.parseInt(verseLocationData[0]));
				verseObj.setHymn(Integer.parseInt(verseLocationData[1]));
				verseObj.setVerse(Integer.parseInt(verseLocationData[2]));
				verseObj.setHymnAbs(hymnAbs);
				verseObj.setId(verseLocationData[0] + verseLocationData[1] + verseLocationData[2]);
				verseObj.setHymnAddressee(hymnAddressee);
				verseObj.setHymnGroup(hymnGroup);
				verseObj.setStrata(compiler.evaluate("*:lg[@*:source='gunkel_ryan']/*:lg/*:fs/*:f[@*:name='strata']/text()", verse).itemAt(0).getStringValue());
				
				//zurich morph glossing and pada labels (by gunkel/ryan)
				//iterate: padas
				XdmValue padaForms = compiler.evaluate("*:lg[@*:source='zurich']/*:l[@*:n]", verse);
				
				//generate and add pada objects
				verseObj.setPadas(generatePadaObjects(verse, padaForms, compiler));
				
				
				//// verse versions (text versions & translations) ////
				
				XdmValue temp;
				XdmItem versionNode;
				VerseVersion version;
				String[] versionForm;
				
				// Zurich ISO / zurich
				temp = compiler.evaluate("*:lg[@*:source='zurich']", verse);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l[@*:n]", versionNode));
					version = new VerseVersion(
						"Lubotsky (Zurich)",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"version",
						true
					);
					verseObj.addVersion(version);
				}
				
				
				// Samitha / gunkel_ryan
				temp = compiler.evaluate("*:lg[@*:source='gunkel_ryan']", verse);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l[@*:ana='samhita']", versionNode));
					version = new VerseVersion(
						"Gunkel, Ryan",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"version",
						true
					);
					verseObj.addVersion(version);
				}
				
				
				// SASA PATHA / lubotsky
				temp = compiler.evaluate("*:lg[@*:source='gunkel_ryan']", verse);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l[@*:ana='sasa_patha']", versionNode));
					version = new VerseVersion(
						"Lubotsky",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"version",
						true
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
						"version",
						true
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
						"version",
						false
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
						"version",
						false
					);
					verseObj.addVersion(version);
				}
				
				// Devanagari / detlef eichler
				temp = compiler.evaluate("*:lg[@*:source='detlef']", verse);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l", versionNode));
					version = new VerseVersion(
						"Devanagari",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"version",
						false
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
						"translation",
						false
					);
					verseObj.addVersion(version);
				}
				
				// Translation (de) / grassmann
				temp = compiler.evaluate("*:l[@*:source='grassmann']", verse);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = new String[]{versionNode.getStringValue()};
					version = new VerseVersion(
						"Graßmann",
						"de",
						versionForm,
						"translation",
						false
					);
					verseObj.addVersion(version);
				}
				
				// Translation (de) / otto
				temp = compiler.evaluate("*:l[@*:source='otto']", verse);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = new String[]{versionNode.getStringValue()};
					version = new VerseVersion(
						"Otto",
						"de",
						versionForm,
						"translation",
						false
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
						"translation",
						false
					);
					verseObj.addVersion(version);
				}
				
				// Translation (de) / mac donell
				temp = compiler.evaluate("*:l[@*:source='macdonell']", verse);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = new String[]{versionNode.getStringValue()};
					version = new VerseVersion(
						"MacDonell",
						"en",
						versionForm,
						"translation",
						false
					);
					verseObj.addVersion(version);
				}
				
				// Translation (fr) / renou
				temp = compiler.evaluate("*:l[@*:source='renou']", verse);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = new String[]{versionNode.getStringValue()};
					version = new VerseVersion(
						"Renou",
						"fr",
						versionForm,
						"translation",
						false
					);
					verseObj.addVersion(version);
				}
				
				//add verse object to verses list
				versesList.add(verseObj);
			}
		}
	}
	
	
	private static List<Pada> generatePadaObjects(
			XdmItem verse,
			XdmValue padaForms,
			XPathCompiler compiler)
					throws IndexOutOfBoundsException, SaxonApiUncheckedException, SaxonApiException{
		
		List<Pada> padas = new ArrayList<Pada>();
		int padaIndex = 0;
		int tokenIndex = 0;
		int tokensTotal = compiler.evaluate("*:lg[@*:source='zurich']/*:l[not(@*:n)]/*:fs", verse).size();
		
		for (XdmItem padaForm : padaForms){
			Pada padaObj = new Pada(); //new pada object
			String padaId = compiler.evaluate("@*:n", padaForm).itemAt(0).getStringValue();
			String tokensXmlId = compiler.evaluate("@*:id", padaForm).itemAt(0).getStringValue().replaceFirst("_zur$", "_tokens_zur");
			XdmValue padaTokens = compiler.evaluate("*:lg[@*:source='zurich']/*:l[@*:id='" + tokensXmlId + "']/*:fs", verse);
			
			//index, id
			padaObj.setIndex(padaIndex++); //pada index
			padaObj.setId(padaId.charAt(padaId.length() - 1) + ""); //pada id (in verse context, single letter)
			
			//pada label (by gunkel/ryan)
			String labelXmlId = compiler.evaluate("@*:id", padaTokens.itemAt(0))
					.itemAt(0).getStringValue().replaceFirst("_\\d\\d_zur$", "_gunkel_ryan");
			XdmValue labelNode = compiler.evaluate("*:lg[@*:source='gunkel_ryan']/*:lg[@*:id='" + labelXmlId + "']/*:fs/*:f[@*:name='label']/text()", verse);
			if (labelNode.size() > 0) padaObj.setLabel(labelNode.itemAt(0).getStringValue());
			
			//tokens
			for (XdmItem token : padaTokens){
				Token tokenObj = new Token();
				XdmValue graLemmaNode = compiler.evaluate("*:f[@*:name='gra_lemma']/*:string", token);
				XdmValue graGrammNode = compiler.evaluate("*:f[@*:name='gra_gramm']/*:symbol/@*:value", token);
				XdmValue formNode = compiler.evaluate("*:f[@*:name='surface']/*:string", token).itemAt(0);
				XdmValue tokenAttributes = compiler.evaluate("*:f[@*:name='morphosyntax']/*:fs/*:f", token);
				if (graLemmaNode.size() > 0) {
					tokenObj.setLemma(((XdmNode)graLemmaNode.itemAt(0)).getStringValue());
					tokenObj.setLemmaRefs(extractLemmaRefs((XdmNode)graLemmaNode));
				}
				tokenObj.setForm(((XdmNode)formNode).getStringValue().trim());
				//iterate token attributes
				
				for (XdmItem tokenAttribute : tokenAttributes){
					try {
						String attName = compiler.evaluate("@*:name", tokenAttribute).itemAt(0).getStringValue();
						XdmValue attValues = compiler.evaluate(".//*:symbol/@*:value", tokenAttribute);
						for (XdmItem attValue : attValues)
							tokenObj.addProp(attName, attValue.getStringValue());
					} catch (Exception e) {
						continue;
					}
				}
				
				//lemma-type
				if (graGrammNode.size() > 0)
					tokenObj.addProp("lemma type", ((XdmNode)graGrammNode.itemAt(0)).getStringValue());
				
				//position
				tokenObj.addProp("position",
						tokenIndex == 0 ? "verse initial"
							: tokenIndex == tokensTotal - 1 ? "verse final" 
									: "other");
				
				//index
				tokenObj.setIndex(tokenIndex++);
				
				//add to tokens
				padaObj.addGrammarData(tokenObj);
			}
			padas.add(padaObj);
		}
		return padas;
	}
	
	
	private static String[] extractLemmaRefs(XdmNode token) {
		//sample for lemmaRef attribute value: "#lemma_id_1695 #lemma_iq_1681"
		return token.getAttributeValue(new QName("source"))
				.replaceAll("#", "")
				.split("\\s+");
	}
	
	
	private static String[] concatTextContents(XdmValue nodes) {
		String[] lines = new String[nodes.size()];
		
		for (int i = 0; i < lines.length; i++) {
			lines[i] = nodes.itemAt(i).getStringValue();
		}
		
		return lines;
	}
	

}
