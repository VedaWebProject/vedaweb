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
		File[] files = fsResources.getResourcesFiles(TEI_RESOURCES_DIR);
		files = fsResources.filterForFileNameSuffixes(files, ".xml", ".tei");
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
		
		
		//// process and add concordance data for Oldenberg 1 and 2
		log.info(
			(dryRun ? "(DRY RUN) " : "")
			+ "Importing references to Oldenberg ..."
		);
		timer.start();
		//create mapping for Oldenberg 1
		ArbitraryConcordance oldenberg1 = new ArbitraryConcordance(
				"https://digi.ub.uni-heidelberg.de/diglit/oldenberg1909bd1/" 
						+ ArbitraryConcordance.PLACEHOLDER);
		oldenberg1.setKeyDelimiter(".");
		oldenberg1.setReferenceDelimiter("\\s?,\\s?");
		oldenberg1.addFromCsv(
				fsResources.readResourceFile(fsResources.getResourcesFile(
						"data/references/Oldenberg/Oldenberg_Band_1.csv")),
				false, ";", "\"");
		//create mapping for Oldenberg 2
		ArbitraryConcordance oldenberg2 = new ArbitraryConcordance(
				"https://digi.ub.uni-heidelberg.de/diglit/oldenberg1909bd2/" 
						+ ArbitraryConcordance.PLACEHOLDER);
		oldenberg2.setKeyDelimiter(".");
		oldenberg2.setReferenceDelimiter("\\s?,\\s?");
		oldenberg2.addFromCsv(
				fsResources.readResourceFile(fsResources.getResourcesFile(
						"data/references/Oldenberg/Oldenberg_Band_2.csv")),
				false, ";", "\"");
		//add to stanza data
		for (Stanza s : stanzas) {
			String[] o1 = oldenberg1.get(s.getLocation());
			String[] o2 = oldenberg2.get(s.getLocation());
			if (o1 != null)
				for (String r : o1)
					s.addReference("Oldenberg", r);
			if (o2 != null)
				for (String r : o2)
					s.addReference("Oldenberg", r);
		}
		log.info(
			(dryRun ? "(DRY RUN) " : "")
			+ "Imported Oldenberg references in "
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
	
	
}