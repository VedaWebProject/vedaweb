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

import de.unikoeln.vedaweb.data.Verse;
import de.unikoeln.vedaweb.data.VerseRepository;
import de.unikoeln.vedaweb.util.Timer;
import de.unikoeln.vedaweb.util.XmlDataImportUtils;
import net.sf.saxon.s9api.SaxonApiException;

@Service
public class DataImportService {
	
	public static final String DEV_LOCAL_XML = "/home/mumpitz/Documents/VedaWeb/tei";
	
	
	@Autowired
	private VerseRepository verseRepo;
	

	/*
	 * main method for testing import routine in dry run mode
	 */
	public static void main(String[] args) throws SaxonApiException, IOException {
		DataImportService trans = new DataImportService();
		trans.importXMLData(DEV_LOCAL_XML, true);
	}
	
	
	public int importXMLData(String xmlDirPath, boolean dryRun){
		List<Verse> verses = new ArrayList<Verse>();
		
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
				XmlDataImportUtils.collectVersesFromXML(xmlFile, verses);
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
		Collections.sort(verses);
		for (int i = 0; i < verses.size(); i++) {
			verses.get(i).setIndex(i);
		}
		
		//dry run?
		if (dryRun){
			System.out.println("[DataImport] dry run: Read " + verses.size() + " verses from XML.");
			return verses.size();
		}
		
		//write to DB
		if (verses != null && !verses.isEmpty()){
			System.out.println("[DataImport] deleting old DB documents...");
			verseRepo.deleteAll();
			System.out.println("[DataImport] importing new data into DB...");
			verseRepo.insert(verses);
		} else {
			System.err.println("[DataImport] error: data import failed. nothing read from XML.");
		}
		
		System.out.println("[DataImport] DONE. data import finished.");
		return verses.size();
	}
	
	
	private FilenameFilter getFileFilter() {
		return new FilenameFilter() {
		    public boolean accept(File dir, String name) {
		        return name.toLowerCase().endsWith(".xml");
		    }
		};
	}
	
}
