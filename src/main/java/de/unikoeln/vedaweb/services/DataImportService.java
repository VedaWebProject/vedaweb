package de.unikoeln.vedaweb.services;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.xml.transform.stream.StreamSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.unikoeln.vedaweb.data.Pada;
import de.unikoeln.vedaweb.data.Token;
import de.unikoeln.vedaweb.data.Translation;
import de.unikoeln.vedaweb.data.Verse;
import de.unikoeln.vedaweb.data.VerseRepository;
import net.sf.saxon.s9api.Processor;
import net.sf.saxon.s9api.QName;
import net.sf.saxon.s9api.SaxonApiException;
import net.sf.saxon.s9api.SaxonApiUncheckedException;
import net.sf.saxon.s9api.XPathCompiler;
import net.sf.saxon.s9api.XdmItem;
import net.sf.saxon.s9api.XdmNode;
import net.sf.saxon.s9api.XdmValue;

@Service
public class DataImportService {
	
	public static final String DEV_LOCAL_XML = "/home/mumpitz/Documents/VedaWeb/rv_tei.xml";
	
	private static final String PATTERN_XML_ID_PADA = "book_\\d{2}_hymn_\\d{2}_\\d{3}_\\d{2}_\\w\\b";
	private static final String PATTERN_XML_ID_VERSE = "^book_\\d{2}_hymn_\\d{2}_\\d{3}_\\d{2}$";
	
	@Autowired
	private VerseRepository verseRepo;
	

	public static void main(String[] args) throws SaxonApiException, IOException {
		DataImportService trans = new DataImportService();
		List<Verse> verses = trans.transformXML2Verses("/home/mumpitz/Documents/VedaWeb/rv_tei.xml");
		
//		FileWriter fw = new FileWriter(new File("rv_parsed.txt"));
//		for (Verse v : verses) fw.write(v.toString() + "\n");
//		fw.close();
	}
	
	
	public void importXMLData(String xmlFilePath){
		List<Verse> verses = null;
		
		System.out.println("[INFO] parsing XML data...");
		
		try {
			verses = transformXML2Verses(xmlFilePath);
		} catch (SaxonApiException e) {
			e.printStackTrace();
		}
		
		if (verses != null && !verses.isEmpty()){
			System.out.println("[INFO] deleting old documents...");
			verseRepo.deleteAll();
			System.out.println("[INFO] importing new data into db...");
			verseRepo.insert(verses);
		} else {
			System.err.println("[ERROR] data import failed.");
		}
		
		System.out.println("[INFO] db import finished.");
	}
	
	
	private List<Verse> transformXML2Verses(String xmlFilePath) throws SaxonApiException{
		//xml file
		File xmlFile = new File(xmlFilePath);
		
		List<Verse> versesList = new ArrayList<Verse>();
		int currVerseIndex = 0;
		int currTokenIndex = 0;
		
		//xml parsing prep
		Processor processor = new Processor(false);
		XdmNode xmlDoc = processor.newDocumentBuilder().build(new StreamSource(xmlFile));
		XPathCompiler compiler = processor.newXPathCompiler();
		compiler.declareNamespace("xml", "http://www.tei-c.org/ns/1.0");
		
		//iterate: verses
		XdmValue verses = compiler.evaluate("//*:div[matches(@*:id, '" + PATTERN_XML_ID_VERSE + "')]", xmlDoc);
		for(XdmItem verse : verses){
			String[] verseLocationData = compiler.evaluate("@*:id", verse).itemAt(0).getStringValue()
					.replaceFirst("book_\\d{2}_hymn_", "").split("_");
			
			//verse obj data
			Verse verseObj = new Verse();
			verseObj.setBook(Integer.parseInt(verseLocationData[0]));
			verseObj.setHymn(Integer.parseInt(verseLocationData[1]));
			verseObj.setVerse(Integer.parseInt(verseLocationData[2]));
			verseObj.setIndex(currVerseIndex);
			verseObj.setId(verseLocationData[0] + verseLocationData[1] + verseLocationData[2]);
			
			//padas
			int padaIndex = 0;
			XdmValue padas = compiler.evaluate("*:linkGrp[@*:type='annotations']/*:link/@*:target", verse);
			for (XdmItem pada : padas){
				String padaId = pada.getStringValue().replaceAll("\\s.*$", "").replaceAll("\\#", "");
				verseObj.addPada(generatePadaObject(padaIndex, padaId, verse, compiler));
				padaIndex++;
			}
			
			//set token indices
			int tokenIndex = 0;
			for (Pada p : verseObj.getPadas()){
				for (Token t : p.getTokens()){
					t.setIndex(tokenIndex++);
				}
			}
			
			//translations
			XdmValue translations = compiler.evaluate("*:linkGrp[@*:type='translations']/*:link/@*:target", verse);
			for (XdmItem translation : translations){
				String translationId = translation.getStringValue().replaceAll(PATTERN_XML_ID_PADA, "").replaceAll("\\s?\\#", "");
				verseObj.addTranslation(generateTranslationObject(translationId, verse, compiler));
			}
			
			//counters
			currVerseIndex++;
			versesList.add(verseObj);
			//DEV DEBUG
			//System.out.println(currVerseIndex);
			//System.out.println(verseObj);
		}
		return versesList;
	}
	
	
	private Pada generatePadaObject(
			int padaIndex,
			String padaId,
			XdmItem refNode,
			XPathCompiler compiler)
					throws IndexOutOfBoundsException, SaxonApiUncheckedException, SaxonApiException{
		
		String form = compiler.evaluate("*:lg/*:l[@*:id='" + padaId + "']/text()", refNode).itemAt(0).getStringValue();
		XdmValue tokensNode = compiler.evaluate("*:lg/*:l[@*:id='" + padaId + "_tokens']/*:w", refNode);
		Pada pada = new Pada();
		pada.setForm(form);
		pada.setIndex(padaIndex);
		
		for (XdmItem token : tokensNode){
			Token tokenObj = new Token();
			tokenObj.setLemma(((XdmNode)token).getAttributeValue(new QName("lemma")));
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
	
	
	private Translation generateTranslationObject(
			String translationId,
			XdmItem refNode,
			XPathCompiler compiler)
					throws IndexOutOfBoundsException, SaxonApiUncheckedException, SaxonApiException {
		
		XdmValue translationText = compiler.evaluate(".//*:l[@*:id='" + translationId + "']/text()", refNode);
		
		Translation translationObj = new Translation(
				compiler.evaluate(".//*:l[@*:id='" + translationId + "']/@*:lang", refNode).itemAt(0).getStringValue(),
				translationText.size() == 0 ? "" : translationText.itemAt(0).getStringValue(),
				compiler.evaluate(".//*:l[@*:id='" + translationId + "']/@*:source", refNode).itemAt(0).getStringValue()
		);
		
		return translationObj;
	}
	
}
