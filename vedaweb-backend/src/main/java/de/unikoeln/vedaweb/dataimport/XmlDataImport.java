package de.unikoeln.vedaweb.dataimport;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import de.unikoeln.vedaweb.analysis.meter.MetricalAnalysis;
import de.unikoeln.vedaweb.document.Pada;
import de.unikoeln.vedaweb.document.Stanza;
import de.unikoeln.vedaweb.document.StanzaVersion;
import de.unikoeln.vedaweb.document.StanzaXml;
import de.unikoeln.vedaweb.document.StanzaXmlRepository;
import de.unikoeln.vedaweb.document.Token;
import net.sf.saxon.s9api.Processor;
import net.sf.saxon.s9api.QName;
import net.sf.saxon.s9api.SaxonApiException;
import net.sf.saxon.s9api.SaxonApiUncheckedException;
import net.sf.saxon.s9api.XPathCompiler;
import net.sf.saxon.s9api.XdmItem;
import net.sf.saxon.s9api.XdmNode;
import net.sf.saxon.s9api.XdmValue;

/**
 * Parsing very big and complex XML structures is an ugly process. This is why
 * it gets banned to it's own exile class.
 * 
 * @author bkis
 *
 */
public class XmlDataImport {
	
	public static void collectStanzasFromXML(
			File xmlFile,
			List<Stanza> stanzasList) throws SaxonApiException {

		System.gc(); //kindly ask to collect some garbage
		
		//xml parsing prep
		Processor processor = new Processor(false);
		XdmNode xmlDoc = processor.newDocumentBuilder().build(xmlFile);
		XPathCompiler compiler = processor.newXPathCompiler();
		//compiler.declareNamespace("xml", "http://www.tei-c.org/ns/1.0");
		
		//iterate: hymns
		XdmValue hymns = compiler.evaluate(".//*:div[@type='hymn']", xmlDoc);
		for(XdmItem hymn : hymns){
			//System.out.println("HYMN: " + compiler.evaluate("@n", hymn).itemAt(0).getStringValue());
			//collect hymn data
			String hymnAddressee = compiler.evaluate("*:div[@type='dedication']/*:div[@type='addressee']/*:p[@*:lang='eng']/text()[1]", hymn)
					.itemAt(0).getStringValue();
			String hymnGroup = compiler.evaluate("*:div[@type='dedication']/*:div[@type='group']/*:p[@*:lang='eng']/text()[1]", hymn)
					.itemAt(0).getStringValue();
			int hymnAbs = Integer.parseInt(compiler.evaluate("@*:ana", hymn)
					.itemAt(0).getStringValue());

			// iterate: stanzas
			XdmValue stanzas = compiler.evaluate("*:div[@type='stanza']", hymn);
			
			for(XdmItem stanza : stanzas){
				
				String[] stanzaLocationData = compiler.evaluate("@*:id", stanza)
						.itemAt(0)
						.getStringValue()
						.replaceAll("\\D", " ")
						.trim()
						.split("\\s+");
				
				// stanza obj data
				Stanza stanzaObj = new Stanza();
				stanzaObj.setBook(Integer.parseInt(stanzaLocationData[0]));
				stanzaObj.setHymn(Integer.parseInt(stanzaLocationData[1]));
				stanzaObj.setStanza(Integer.parseInt(stanzaLocationData[2]));
				stanzaObj.setHymnAbs(hymnAbs);
				stanzaObj.setId(stanzaLocationData[0] + stanzaLocationData[1] + stanzaLocationData[2]);
				stanzaObj.setHymnAddressee(hymnAddressee);
				stanzaObj.setHymnGroup(hymnGroup);
				stanzaObj.setStrata(compiler.evaluate("*:lg[@*:type='strata']/*:l/*:fs/*:f[@*:name='strata']/text()", stanza).itemAt(0).getStringValue());
				
				// Late additions from Gunkel
				XdmValue additions = compiler.evaluate("*:fs[@*:type='stanza_properties']/*:f", stanza);
				for(XdmItem addition : additions) {
					String a = ((XdmNode)addition)
							.getAttributeValue(new QName("name"));
					String code = compiler.evaluate("*:symbol/@*:value", addition)
							.itemAt(0).getStringValue();
					stanzaObj.addLateAddition(
							a.substring(0, 1).toUpperCase() 
							+ a.substring(1).toLowerCase()
							+ " (" + code + ")"
					);
				}
				
				// zurich morph glossing and pada labels (by gunkel/ryan)
				// iterate: padas
				XdmValue padaTokensNodes = compiler.evaluate("*:lg[@*:source='zurich']/*:l[ends-with(@*:id, '_tokens')]", stanza);
				
				// generate and add pada objects
				stanzaObj.setPadas(generatePadaObjects(stanza, padaTokensNodes, compiler));
				
				
				//// stanza versions (text versions & translations) ////
				
				XdmValue temp;
				XdmItem versionNode;
				StanzaVersion version;
				String[] versionForm = null;
				
				// Zurich ISO / zurich
				temp = compiler.evaluate("*:lg[@*:source='zurich']", stanza);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l[not(ends-with(@*:id, '_tokens'))]", versionNode));
					version = new StanzaVersion(
						"Lubotsky (Zurich)",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"version",
						true
					);
					version.setMetricalData(MetricalAnalysis.parseMultiline(
						String.join("\n", versionForm),
						MetricalAnalysis.LONG_LETTER,
						MetricalAnalysis.SHORT_LETTER));
					stanzaObj.addVersion(version);
				}
				
				
				// Samitha / gunkel_ryan
//				temp = compiler.evaluate("*:lg[@*:source='gunkel_ryan']", stanza);
//				if (temp.size() > 0) {
//					versionNode = temp.itemAt(0);
//					versionForm = concatTextContents(compiler.evaluate(".//*:l[@*:ana='samhita']", versionNode));
//					version = new StanzaVersion(
//						"Gunkel & Ryan",
//						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
//						versionForm,
//						"version",
//						true
//					);
//					version.setMetricalData(MetricalAnalysis.parseMultiline(
//							String.join("\n", versionForm),
//							MetricalAnalysis.LONG_LETTER,
//							MetricalAnalysis.SHORT_LETTER));
//					stanzaObj.addVersion(version);
//				}
				
				
				// Lubotsky / SASA PATHA
				temp = compiler.evaluate("*:lg[@*:source='lubotsky']", stanza);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l", versionNode));
					version = new StanzaVersion(
						"Lubotsky",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"version",
						true
					);
					version.setMetricalData(MetricalAnalysis.parseMultiline(
							String.join("\n", versionForm),
							MetricalAnalysis.LONG_LETTER,
							MetricalAnalysis.SHORT_LETTER));
					stanzaObj.addVersion(version);
				}
				
				
				// Van Nooten & Holland / vnh
				temp = compiler.evaluate("*:lg[@*:source='vnh']", stanza);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l", versionNode));
					version = new StanzaVersion(
						"Van Nooten & Holland",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"version",
						true
					);
					version.setMetricalData(MetricalAnalysis.parseMultiline(
							String.join("\n", versionForm),
							MetricalAnalysis.LONG_LETTER,
							MetricalAnalysis.SHORT_LETTER));
					stanzaObj.addVersion(version);
				}
				
				
				// Aufrecht / aufrecht
				temp = compiler.evaluate("*:lg[@*:source='aufrecht']", stanza);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l", versionNode));
					version = new StanzaVersion(
						"Aufrecht",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"version",
						false
					);
					version.setMetricalData(MetricalAnalysis.parseMultiline(
							String.join("\n", versionForm),
							MetricalAnalysis.LONG_LETTER,
							MetricalAnalysis.SHORT_LETTER));
					stanzaObj.addVersion(version);
				}
				
				// Padapatha / padapatha
				temp = compiler.evaluate("*:lg[@*:source='padapatha']", stanza);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = new String[]{versionNode.getStringValue().replaceAll("\\s+", " ").trim()};
					version = new StanzaVersion(
						"Padapatha",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"version",
						false
					);
					version.setMetricalData(MetricalAnalysis.parseMultiline(
							String.join("\n", versionForm),
							MetricalAnalysis.LONG_LETTER,
							MetricalAnalysis.SHORT_LETTER));
					stanzaObj.addVersion(version);
				}
				
				// Devanagari / detlef eichler
				temp = compiler.evaluate("*:lg[@*:source='eichler']", stanza);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l", versionNode));
					version = new StanzaVersion(
						"Eichler",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"version",
						false
					);
					stanzaObj.addVersion(version);
				}
				
				// Devanagari / provided by Mārcis Gasūns
//				temp = compiler.evaluate("*:lg[@*:source='gasuns']", stanza);
//				if (temp.size() > 0) {
//					versionNode = temp.itemAt(0);
//					versionForm = concatTextContents(compiler.evaluate(".//*:l", versionNode));
//					version = new StanzaVersion(
//						"Gasuns",
//						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
//						versionForm,
//						"version",
//						false
//					);
//					stanzaObj.addVersion(version);
//				}
				
				// Translation (de) / geldner
				temp = compiler.evaluate("*:lg[@*:source='geldner']", stanza);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l", versionNode));
					version = new StanzaVersion(
						"Geldner",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"translation",
						false
					);
					stanzaObj.addVersion(version);
				}
				
				// Translation (de) / grassmann
				temp = compiler.evaluate("*:lg[@*:source='grassmann']", stanza);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l", versionNode));
					version = new StanzaVersion(
						"Graßmann",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"translation",
						false
					);
					stanzaObj.addVersion(version);
				}
				
				// Translation (de) / otto
				temp = compiler.evaluate("*:lg[@*:source='otto']", stanza);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l", versionNode));
					version = new StanzaVersion(
						"Otto",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"translation",
						false
					);
					stanzaObj.addVersion(version);
				}
					
				// Translation (en) / griffith
				temp = compiler.evaluate("*:lg[@*:source='griffith']", stanza);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l", versionNode));
					version = new StanzaVersion(
						"Griffith",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"translation",
						false
					);
					stanzaObj.addVersion(version);
				}
				
				// Translation (en) / mac donell
				temp = compiler.evaluate("*:lg[@*:source='macdonell']", stanza);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l", versionNode));
					version = new StanzaVersion(
						"MacDonell",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"translation",
						false
					);
					stanzaObj.addVersion(version);
				}
				
				// Translation (en) / mueller
				temp = compiler.evaluate("*:lg[@*:source='mueller']", stanza);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l", versionNode));
					version = new StanzaVersion(
						"Müller",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"translation",
						false
					);
					stanzaObj.addVersion(version);
				}
				
				// Translation (en) / oldenberg
				temp = compiler.evaluate("*:lg[@*:source='oldenberg']", stanza);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l", versionNode));
					version = new StanzaVersion(
						"Oldenberg",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"translation",
						false
					);
					stanzaObj.addVersion(version);
				}
				
				// Translation (fr) / renou
				temp = compiler.evaluate("*:lg[@*:source='renou']", stanza);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l", versionNode));
					version = new StanzaVersion(
						"Renou",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"translation",
						false
					);
					stanzaObj.addVersion(version);
				}
				
				// Translation (ru) / Elizarenkova
				temp = compiler.evaluate("*:lg[@*:source='elizarenkova']", stanza);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l", versionNode));
					version = new StanzaVersion(
						"Elizarenkova",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"translation",
						true
					);
					stanzaObj.addVersion(version);
				}
				
//				// DEV TEMP RU
//				stanzaObj.addVersion(generateStanzaVersionObject(
//						"Elizarenkova",
//						"translation",
//						true,
//						"*:lg[@*:source='elizarenkova']",
//						"@*:lang",
//						".//*:l",
//						compiler,
//						stanza));
				
				//// Stanza Type (via metrical data on vn&h) ////
				for (StanzaVersion v : stanzaObj.getVersions()) {
					if (v.getSource().contains("ooten")) {
						String syllables = "";
						for (String line : v.getMetricalData()) {
							syllables += line.replaceAll("\\s", "").length() + " ";
						}
						switch (syllables.trim()) {
						case "11 11 11 11": stanzaObj.setStanzaType("Triṣṭubh"); break;
						case "8 8 8": stanzaObj.setStanzaType("Gāyatrī"); break;
						case "12 12 12 12": stanzaObj.setStanzaType("Jagatī"); break;
						case "8 8 8 8": stanzaObj.setStanzaType("Aṇuṣṭubh"); break;
						default: break;
						}
						break;
					}
				}

				//add stanza object to stanzas list
				stanzasList.add(stanzaObj);
			}
		}
	}
	
	
//	private static StanzaVersion generateStanzaVersionObject(
//			String title,
//			String versionType,
//			boolean applyKeys,
//			String xPathToVersionNode,
//			String xPathToLanguageNode,
//			String xPathToFormNode,
//			XPathCompiler compiler,
//			XdmItem stanzaNode) throws SaxonApiException {
//		
//		XdmValue temp = compiler.evaluate(xPathToVersionNode, stanzaNode);
//		if (temp == null || temp.size() > 0) return null;
//		XdmItem versionNode = temp.itemAt(0);
//		String[] versionForm = concatTextContents(
//				compiler.evaluate(xPathToFormNode, versionNode));
//		StanzaVersion version = new StanzaVersion(
//			title,
//			compiler.evaluate(xPathToLanguageNode, versionNode).itemAt(0).getStringValue(),
//			versionForm,
//			versionType,
//			applyKeys
//		);
//		return version;
//	}
	
	
	private static List<Pada> generatePadaObjects(
			XdmItem stanza,
			XdmValue padaTokensNodes,
			XPathCompiler compiler)
					throws IndexOutOfBoundsException, SaxonApiUncheckedException, SaxonApiException{
		
		List<Pada> padas = new ArrayList<Pada>();
		int padaIndex = 0;
		
		for (XdmItem padaTokensNode : padaTokensNodes){
			Pada padaObj = new Pada(); //new pada object
			String tokensNodeId = compiler.evaluate("@*:id", padaTokensNode).itemAt(0).getStringValue();
			XdmValue padaTokens = compiler.evaluate("*:fs", padaTokensNode);
			int tokensTotal = padaTokens.size();
			
			//index, id
			padaObj.setIndex(padaIndex++); //pada index
			padaObj.setId(tokensNodeId.replaceFirst("^.*?(\\w)_tokens$", "$1")); //pada id (in stanza context, single letter)
//			padaObj.setId(padaFormId.charAt(padaFormId.length() - 1) + ""); //pada id (in stanza context, single letter)
			
			//pada label (by gunkel/ryan)
			XdmValue labelNode = compiler.evaluate("*:lg[@*:type='strata']/*:l/*:fs/*:f[@*:name='label']/text()", stanza);
			if (labelNode.size() > 0) padaObj.setLabel(labelNode.itemAt(0).getStringValue());
			
			//tokens
			for (XdmItem token : padaTokens){
				Token tokenObj = new Token();
				// e.g. get "02" from "xml:id='b02_h001_01_zur_a_02'"
				int tokenIndex = Integer.parseInt(
						compiler.evaluate("@*:id", token).itemAt(0)
						.getStringValue().replaceFirst("^.*?_(\\d+)$", "$1"));
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
				if (tokenIndex == 0)
					tokenObj.addProp("position", "verse initial");
				if (tokenIndex == tokensTotal - 1)
					tokenObj.addProp("position", "verse final");
				if (tokenIndex > 0 && tokenIndex < tokensTotal - 1)
					tokenObj.addProp("position", "intermediate");

				//index
				tokenObj.setIndex(tokenIndex);
				
				//add to tokens
				padaObj.addGrammarData(tokenObj);
			}
			padaObj.sortGrammarData();
			padas.add(padaObj);
		}
		return padas;
	}
	
	
	private static String[] extractLemmaRefs(XdmNode token) {
		//sample for lemmaRef attribute value: "#lemma_id_1695 #lemma_iq_1681"
		String refs = 
				token.getAttributeValue(new QName("match")) + " "
				+ token.getAttributeValue(new QName("correction"));
				
		return refs
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
	
	
	public static void readRawStanzaXml(
			File xmlFile,
			StanzaXmlRepository stanzaXmlRepo,
			boolean dryRun) throws SaxonApiException {
		
		System.gc(); //kindly ask to collect some garbage
		
		//xml parsing prep
		Processor processor = new Processor(false);
		XdmNode xmlDoc = processor.newDocumentBuilder().build(xmlFile);
		XPathCompiler compiler = processor.newXPathCompiler();
		
		//iterate: stanzas
		XdmValue stanzas = compiler.evaluate(".//*:div[@type='stanza']", xmlDoc);
		for(XdmItem stanza : stanzas){
			String[] stanzaLocationData = compiler.evaluate("@*:id", stanza)
					.itemAt(0)
					.getStringValue()
					.replaceAll("\\D", " ")
					.trim()
					.split("\\s+");
			if (!dryRun) {
				stanzaXmlRepo.insert(new StanzaXml(
					stanzaLocationData[0] + stanzaLocationData[1] + stanzaLocationData[2],
					stanza.toString()
				));
			}
		}
	}

}
