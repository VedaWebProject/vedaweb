package de.unikoeln.vedaweb.xmlimport;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import javax.xml.transform.stream.StreamSource;

import de.unikoeln.vedaweb.document.Pada;
import de.unikoeln.vedaweb.document.Stanza;
import de.unikoeln.vedaweb.document.StanzaVersion;
import de.unikoeln.vedaweb.document.Token;
import net.sf.saxon.s9api.Processor;
import net.sf.saxon.s9api.QName;
import net.sf.saxon.s9api.SaxonApiException;
import net.sf.saxon.s9api.SaxonApiUncheckedException;
import net.sf.saxon.s9api.XPathCompiler;
import net.sf.saxon.s9api.XdmItem;
import net.sf.saxon.s9api.XdmNode;
import net.sf.saxon.s9api.XdmValue;

public class XmlDataImport {
	
	
	public static void collectStanzasFromXML(File xmlFile, List<Stanza> stanzasList) throws SaxonApiException{
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
		
			//iterate: stanzas
			XdmValue stanzas = compiler.evaluate("*:div[@type='verse']", hymn);
			for(XdmItem stanza : stanzas){
				String[] stanzaLocationData = compiler.evaluate("@*:n", stanza).itemAt(0).getStringValue().split("\\.");
				
				//stanza obj data
				Stanza stanzaObj = new Stanza();
				stanzaObj.setBook(Integer.parseInt(stanzaLocationData[0]));
				stanzaObj.setHymn(Integer.parseInt(stanzaLocationData[1]));
				stanzaObj.setStanza(Integer.parseInt(stanzaLocationData[2]));
				stanzaObj.setHymnAbs(hymnAbs);
				stanzaObj.setId(stanzaLocationData[0] + stanzaLocationData[1] + stanzaLocationData[2]);
				stanzaObj.setHymnAddressee(hymnAddressee);
				stanzaObj.setHymnGroup(hymnGroup);
				stanzaObj.setStrata(compiler.evaluate("*:lg[@*:source='gunkel_ryan']/*:lg/*:fs/*:f[@*:name='strata']/text()", stanza).itemAt(0).getStringValue());
				
				//zurich morph glossing and pada labels (by gunkel/ryan)
				//iterate: padas
				XdmValue padaForms = compiler.evaluate("*:lg[@*:source='zurich']/*:l[@*:n]", stanza);
				
				//generate and add pada objects
				stanzaObj.setPadas(generatePadaObjects(stanza, padaForms, compiler));
				
				
				//// stanza versions (text versions & translations) ////
				
				XdmValue temp;
				XdmItem versionNode;
				StanzaVersion version;
				String[] versionForm;
				
				// Zurich ISO / zurich
				temp = compiler.evaluate("*:lg[@*:source='zurich']", stanza);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l[@*:n]", versionNode));
					version = new StanzaVersion(
						"Lubotsky (Zurich)",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"version",
						true
					);
					stanzaObj.addVersion(version);
				}
				
				
				// Samitha / gunkel_ryan
				temp = compiler.evaluate("*:lg[@*:source='gunkel_ryan']", stanza);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l[@*:ana='samhita']", versionNode));
					version = new StanzaVersion(
						"Gunkel & Ryan",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"version",
						true
					);
					stanzaObj.addVersion(version);
				}
				
				
				// SASA PATHA / lubotsky
				temp = compiler.evaluate("*:lg[@*:source='gunkel_ryan']", stanza);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l[@*:ana='sasa_patha']", versionNode));
					version = new StanzaVersion(
						"Lubotsky",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"version",
						true
					);
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
					stanzaObj.addVersion(version);
				}
				
				// Padapatha / padapatha
				temp = compiler.evaluate("*:l[@*:source='padapatha']", stanza);
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
					stanzaObj.addVersion(version);
				}
				
				// Devanagari / detlef eichler
				temp = compiler.evaluate("*:lg[@*:source='detlef']", stanza);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = concatTextContents(compiler.evaluate(".//*:l", versionNode));
					version = new StanzaVersion(
						"Devanagari",
						compiler.evaluate("@*:lang", versionNode).itemAt(0).getStringValue(),
						versionForm,
						"version",
						false
					);
					stanzaObj.addVersion(version);
				}
				
				// Translation (de) / geldner
				temp = compiler.evaluate("*:l[@*:source='geldner']", stanza);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = new String[]{versionNode.getStringValue()};
					version = new StanzaVersion(
						"Geldner",
						"de",
						versionForm,
						"translation",
						false
					);
					stanzaObj.addVersion(version);
				}
				
				// Translation (de) / grassmann
				temp = compiler.evaluate("*:l[@*:source='grassmann']", stanza);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = new String[]{versionNode.getStringValue()};
					version = new StanzaVersion(
						"Graßmann",
						"de",
						versionForm,
						"translation",
						false
					);
					stanzaObj.addVersion(version);
				}
				
				// Translation (de) / otto
				temp = compiler.evaluate("*:l[@*:source='otto']", stanza);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = new String[]{versionNode.getStringValue()};
					version = new StanzaVersion(
						"Otto",
						"de",
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
						"en",
						versionForm,
						"translation",
						false
					);
					stanzaObj.addVersion(version);
				}
				
				// Translation (de) / mac donell
				temp = compiler.evaluate("*:l[@*:source='macdonell']", stanza);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = new String[]{versionNode.getStringValue()};
					version = new StanzaVersion(
						"MacDonell",
						"en",
						versionForm,
						"translation",
						false
					);
					stanzaObj.addVersion(version);
				}
				
				// Translation (fr) / renou
				temp = compiler.evaluate("*:l[@*:source='renou']", stanza);
				if (temp.size() > 0) {
					versionNode = temp.itemAt(0);
					versionForm = new String[]{versionNode.getStringValue()};
					version = new StanzaVersion(
						"Renou",
						"fr",
						versionForm,
						"translation",
						false
					);
					stanzaObj.addVersion(version);
				}
				
				//add stanza object to stanzas list
				stanzasList.add(stanzaObj);
			}
		}
	}
	
	
	private static List<Pada> generatePadaObjects(
			XdmItem stanza,
			XdmValue padaForms,
			XPathCompiler compiler)
					throws IndexOutOfBoundsException, SaxonApiUncheckedException, SaxonApiException{
		
		List<Pada> padas = new ArrayList<Pada>();
		int padaIndex = 0;
		
		for (XdmItem padaForm : padaForms){
			Pada padaObj = new Pada(); //new pada object
			String padaId = compiler.evaluate("@*:n", padaForm).itemAt(0).getStringValue();
			String tokensXmlId = compiler.evaluate("@*:id", padaForm).itemAt(0).getStringValue().replaceFirst("_zur$", "_tokens_zur");
			XdmValue padaTokens = compiler.evaluate("*:lg[@*:source='zurich']/*:l[@*:id='" + tokensXmlId + "']/*:fs", stanza);
			int tokensTotal = padaTokens.size();
			int tokenIndex = 0;
			
			//index, id
			padaObj.setIndex(padaIndex++); //pada index
			padaObj.setId(padaId.charAt(padaId.length() - 1) + ""); //pada id (in stanza context, single letter)
			
			//pada label (by gunkel/ryan)
			String labelXmlId = compiler.evaluate("@*:id", padaTokens.itemAt(0))
					.itemAt(0).getStringValue().replaceFirst("_\\d\\d_zur$", "_gunkel_ryan");
			XdmValue labelNode = compiler.evaluate("*:lg[@*:source='gunkel_ryan']/*:lg[@*:id='" + labelXmlId + "']/*:fs/*:f[@*:name='label']/text()", stanza);
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
				if (tokenIndex == 0)
					tokenObj.addProp("position", "verse initial");
				if (tokenIndex == tokensTotal - 1)
					tokenObj.addProp("position", "verse final");
				if (tokenIndex > 0 && tokenIndex < tokensTotal - 1)
					tokenObj.addProp("position", "intermediate");

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
