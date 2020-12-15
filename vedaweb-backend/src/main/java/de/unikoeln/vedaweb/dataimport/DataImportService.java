package de.unikoeln.vedaweb.dataimport;
import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.unikoeln.vedaweb.document.ExternalResource;
import de.unikoeln.vedaweb.document.Stanza;
import de.unikoeln.vedaweb.document.StanzaRepository;
import de.unikoeln.vedaweb.document.StanzaXmlRepository;
import de.unikoeln.vedaweb.util.FsResourcesService;
import de.unikoeln.vedaweb.util.Timer;
import net.sf.saxon.s9api.SaxonApiException;

@Service
public class DataImportService {
	
	private final Logger log = LoggerFactory.getLogger(this.getClass());
	
	public static final String TEI_RESOURCES_DIR = "tei";
	public static final String REFERENCES_RESOURCES_DIR = "references";
	
	
	@Autowired
	private StanzaRepository stanzaRepo;
	
	@Autowired
	private StanzaXmlRepository stanzaXmlRepo;
	
	@Autowired
	private FsResourcesService fsResources;
	

	/*
	 * DEV: main method for testing import routine in dry run mode
	 */
//	public static void main(String[] args) throws SaxonApiException, IOException {
//		DataImportService trans = new DataImportService();
//		trans.importXMLData(LOCAL_XML_DIR, true);
//	}
	
	
	public int importXMLData(boolean dryRun){
		List<Stanza> stanzas = new ArrayList<Stanza>();
		
		//check import directory path
		log.info(
			(dryRun ? "(DRY RUN) " : "")
			+ "Looking for XML files to import"
		);
		
		//collect input files (.xml and .tei)
		File[] files = fsResources.getResourcesFiles(
				TEI_RESOURCES_DIR, "rv_book_\\d+\\.tei");
		Arrays.sort(files);
		
		//init timer
		Timer timer = new Timer();
		
		//import raw stanza xml data for export
		
		log.info(
			(dryRun ? "(DRY RUN) " : "")
			+ "Starting raw XML data import from XML files"
		);
		
		if (!dryRun) stanzaXmlRepo.deleteAll();
		for (File xmlFile : files) {
			timer.start();
			try {
				XmlDataImport.readRawStanzaXml(xmlFile, stanzaXmlRepo, dryRun);
			} catch (SaxonApiException e) {
				log.error((dryRun ? "(DRY RUN) " : "") + "Could not read XML data. Malformed?");
				e.printStackTrace();
				return -1;
			}
			log.info(
				(dryRun ? "(DRY RUN) " : "")
				+ "Finished reading " 
				+ xmlFile.getAbsolutePath() 
				+ " in " + timer.stop("s", true) + " seconds"
			);
		}
		
		//start importing stanza object data from xml
		
		log.info(
			(dryRun ? "(DRY RUN) " : "")
			+ "Starting data import from XML"
		);
		
		for (File xmlFile : files) {
			timer.start();
			try {
				XmlDataImport.collectStanzasFromXML(xmlFile, stanzas);
			} catch (SaxonApiException e) {
				log.error((dryRun ? "(DRY RUN) " : "") + "Could not read XML data. Malformed?");
				e.printStackTrace();
				return -1;
			}
			log.info(
				(dryRun ? "(DRY RUN) " : "")
				+ "Finished processing " 
				+ xmlFile.getName() 
				+ " in " + timer.stop("s", true) + " seconds"
			);
		}
		
		//sort and apply indices
		
		log.info(
			(dryRun ? "(DRY RUN) " : "")
			+ "Sorting documents, applying global indices"
		);
		
		Collections.sort(stanzas);
		for (int i = 0; i < stanzas.size(); i++) {
			stanzas.get(i).setIndex(i);
		}
		
		
		//log read stanzas count
		if (stanzas.size() > 0)
			log.info((dryRun ? "(DRY RUN) " : "") + "Read " + stanzas.size() + " stanzas from XML");
		else
			log.warn((dryRun ? "(DRY RUN) " : "") + "Zero (in numbers: 0) stanzas read from XML!");
		
		
		////
		//// process and add concordance data for Oldenberg 1 and 2
		////
		
		log.info(
			(dryRun ? "(DRY RUN) " : "")
			+ "Importing references to Oldenberg ..."
		);
		timer.start();
		
		//create mapping for Oldenberg 1
		ArbitraryConcordance.Csv csv = new ArbitraryConcordance.Csv(
				fsResources.readResourceFile(fsResources.getResourcesFile(
						REFERENCES_RESOURCES_DIR
						+ "/Oldenberg/Oldenberg_Band_1.csv")),
				false, ";", "\"");
		addArbitratyConcordance(
				stanzas,
				"https://digi.ub.uni-heidelberg.de/diglit/oldenberg1909bd1/" 
							+ ArbitraryConcordance.PLACEHOLDER,
						".",
						"\\s?,\\s?",
						"Oldenberg (1909)",
						"Oldenberg, Hermann. 1909. Ṛgveda: "
							+ "textkritische und exegetische Noten (1): "
							+ "Erstes bis sechstes Buch. Berlin",
						csv);
		
		//create mapping for Oldenberg 2
		csv = new ArbitraryConcordance.Csv(
				fsResources.readResourceFile(fsResources.getResourcesFile(
						REFERENCES_RESOURCES_DIR
						+ "/Oldenberg/Oldenberg_Band_2.csv")),
				false, ";", "\"");
		addArbitratyConcordance(
				stanzas,
				"https://digi.ub.uni-heidelberg.de/diglit/oldenberg1909bd2/" 
							+ ArbitraryConcordance.PLACEHOLDER,
						".",
						"\\s?,\\s?",
						"Oldenberg (1909)",
						"Oldenberg, Hermann. 1912. Ṛgveda: "
							+ "textkritische und exegetische Noten (2): "
							+ "Siebentes bis zehntes Buch. Berlin",
						csv);
		
		log.info(
			(dryRun ? "(DRY RUN) " : "")
			+ "Imported Oldenberg references in "
			+ timer.stop("s", true)
			+ " seconds."
		);
		
		
		
		////
		//// process and add concordance data for Ludwig 1
		////
		
		log.info(
			(dryRun ? "(DRY RUN) " : "")
			+ "Importing references to Ludwig ..."
		);
		timer.start();
		
		//create mapping for Ludwig 1
		csv = new ArbitraryConcordance.Csv(
				fsResources.readResourceFile(fsResources.getResourcesFile(
						REFERENCES_RESOURCES_DIR
						+ "/Ludwig/Ludwig_Band_1.csv")),
				false, ";", "\"");
		addArbitratyConcordance(
				stanzas,
				"https://archive.org/details/rigvedaoderdiehe04ludw/page/" 
						+ ArbitraryConcordance.PLACEHOLDER + "/mode/1up",
				".",
				"\\s?,\\s?",
				"Ludwig (1881)",
				"Ludwig, Alfred. 1881. Der Rigveda oder die heiligen Hymnen "
						+ "der Brâhmana. Zum ersten Male vollständig ins "
						+ "Deutsche übersetzt mit Commentar und Einleitung "
						+ "von Alfred Ludwig. Vierter Band (des Commentars "
						+ "erster Teil). Prag: Tempsky.",
				csv);
		
		//create mapping for Ludwig 2
		csv = new ArbitraryConcordance.Csv(
				fsResources.readResourceFile(fsResources.getResourcesFile(
						REFERENCES_RESOURCES_DIR
						+ "/Ludwig/Ludwig_Band_2.csv")),
				false, ";", "\"");
		addArbitratyConcordance(
				stanzas,
				"https://archive.org/details/rigvedaoderdiehe05ludw/page/" 
						+ ArbitraryConcordance.PLACEHOLDER + "/mode/1up",
				".",
				"\\s?,\\s?",
				"Ludwig (1883)",
				"Ludwig, Alfred. 1883. Der Rigveda oder die heiligen Hymnen "
						+ "der Brâhmana. Zum ersten Male vollständig ins "
						+ "Deutsche übersetzt mit Commentar und Einleitung "
						+ "von Alfred Ludwig. Fünfter Band (des Commentars "
						+ "zweiter Teil). Prag: Tempsky.",
				csv);
		
		log.info(
			(dryRun ? "(DRY RUN) " : "")
			+ "Imported Ludwig references in "
			+ timer.stop("s", true)
			+ " seconds."
		);
		
		
		
		//dry run?
		if (dryRun) return stanzas.size();
		
		//write to DB
		if (stanzas != null && !stanzas.isEmpty()){
			log.info("Deleting old DB documents");
			stanzaRepo.deleteAll();
			log.info("Importing new data into DB");
			stanzaRepo.insert(stanzas);
		} else {
			log.error("Data import failed. nothing read from XML?");
		}
		
		log.info("Data import finished.");
		return stanzas.size();
	}
	
	
	private void addArbitratyConcordance(
			List<Stanza> stanzas,
			String referenceTemplate,
			String keyDelimiter,
			String referenceDelimiter,
			String title,
			String description,
			ArbitraryConcordance.Csv csv) {
		
		ArbitraryConcordance concordance = new ArbitraryConcordance(referenceTemplate);
		concordance.setKeyDelimiter(keyDelimiter);
		concordance.setReferenceDelimiter(referenceDelimiter);
		concordance.addFromCsv(csv);
		concordance.setDescription(description);
		
		for (Stanza s : stanzas) {
			String[] refs = concordance.get(s.getLocation());
			if (refs != null) {
				ExternalResource ext = new ExternalResource(title);
				ext.setDescription(description);
				for (String r : refs) ext.addReference(r);
				s.addExternalResource(ext);
			}
		}
	}
	
	
}
