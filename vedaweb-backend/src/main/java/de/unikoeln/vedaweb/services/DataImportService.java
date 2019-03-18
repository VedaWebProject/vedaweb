package de.unikoeln.vedaweb.services;
import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import de.unikoeln.vedaweb.data.Stanza;
import de.unikoeln.vedaweb.data.StanzaRepository;
import de.unikoeln.vedaweb.util.Timer;
import de.unikoeln.vedaweb.util.XmlDataImport;
import net.sf.saxon.s9api.SaxonApiException;

@Service
public class DataImportService {
	
	public static final String LOCAL_XML_DIR = "tei";
	
	
	@Autowired
	private StanzaRepository stanzaRepo;
	

	/*
	 * main method for testing import routine in dry run mode
	 */
	public static void main(String[] args) throws SaxonApiException, IOException {
		DataImportService trans = new DataImportService();
		trans.importXMLData(LOCAL_XML_DIR, true);
	}
	
	
	public int importXMLData(String xmlDirPath, boolean dryRun){
		List<Stanza> stanzas = new ArrayList<Stanza>();
		
		//check import directory path
		System.out.println("[DataImport] looking for XML files to import ...");
		File dir = new File(xmlDirPath);
		if (!dir.exists()) {
			System.err.println("[DataImport] error: '" + xmlDirPath + "' could not be found.");
			return -1;
		} else if (!dir.isDirectory()) {
			System.err.println("[DataImport] error: '" + xmlDirPath + "' is not a directory.");
			return -1;
		}
		
		//collect input files
		File[] files = dir.listFiles(getFileFilter());
		Arrays.sort(files);
		
		//start importing
		System.out.println("[DataImport] starting data import from XML ...");
		Timer timer = new Timer();
		for (File xmlFile : files) {
			timer.start();
			try {
				XmlDataImport.collectStanzasFromXML(xmlFile, stanzas);
			} catch (SaxonApiException e) {
				System.err.println("[DataImport] error reading XML data.");
				e.printStackTrace();
				return -1;
			}
			System.out.println("[DataImport]   > finished reading '" 
					+ xmlFile.getName() + "' in " + timer.stop("s", true) + " seconds.");
		}
		
		//sort and apply indices
		System.out.println("[DataImport] sorting documents, applying global indices ...");
		Collections.sort(stanzas);
		for (int i = 0; i < stanzas.size(); i++) {
			stanzas.get(i).setIndex(i);
		}
		
		//dry run?
		if (dryRun){
			System.out.println("[DataImport] dry run: Read " + stanzas.size() + " stanzas from XML.");
			if (stanzas.size() > 0) {
				try {
					System.out.println("[DataImport] SAMPLE:\n" + new ObjectMapper().configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false).writeValueAsString(stanzas.get(0)));
				} catch (JsonProcessingException e) {
					e.printStackTrace();
				}
			}
			return stanzas.size();
		}
		
		//write to DB
		if (stanzas != null && !stanzas.isEmpty()){
			System.out.println("[DataImport] deleting old DB documents...");
			stanzaRepo.deleteAll();
			System.out.println("[DataImport] importing new data into DB...");
			stanzaRepo.insert(stanzas);
		} else {
			System.err.println("[DataImport] error: data import failed. nothing read from XML.");
		}
		
		System.out.println("[DataImport] DONE. data import finished.");
		return stanzas.size();
	}
	
	
	private FilenameFilter getFileFilter() {
		return new FilenameFilter() {
		    public boolean accept(File dir, String name) {
		        return name.toLowerCase().endsWith(".xml");
		    }
		};
	}
	
}
