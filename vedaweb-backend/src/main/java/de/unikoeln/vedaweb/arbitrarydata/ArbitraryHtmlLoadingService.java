package de.unikoeln.vedaweb.arbitrarydata;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.unikoeln.vedaweb.util.IOUtils;


@Service
public class ArbitraryHtmlLoadingService {
	
	private final Logger log = LoggerFactory.getLogger(this.getClass());
	
	private static final String ARBITRARY_DATA_DIR = "data";
	
	@Autowired
	private ArbitraryHtmlRepository dataRepo;
	
	@PostConstruct
	public void init() {
		
		log.info("Loading arbitrary application data from \"" + 
				ARBITRARY_DATA_DIR + "\"");
		
		File dataDir = new File(ARBITRARY_DATA_DIR);
		
		if (!dataDir.exists()) {
			log.error("Arbitrary data directory \"" + 
					dataDir.getPath() + "\" does not exist!");
			return;
		} else if(!dataDir.isDirectory()) {
			log.error("Arbitrary data directory \"" + 
					dataDir.getPath() + "\" is not a directory!");
			return;
		}
		
		File[] dataFiles = dataDir.listFiles();
		for (File f : dataFiles) {
			if (f.isFile()) {
				try {
					if (!dataRepo.existsById(f.getName()))
						dataRepo.insert(
								new ArbitraryHtml(
										f.getName(),
										IOUtils.convertStreamToString(
												new FileInputStream(f))));
				} catch (FileNotFoundException e) {
					e.printStackTrace();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}

}
