package de.unikoeln.vedaweb.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Arrays;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Service for easy access to static file system (as in: not in classpath)
 * application resources like import data, static UI text or i18n files.
 * 
 * @author bkis
 * 
 */
@Service
public class FsResourcesService {
	
	private final Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Value("${vedaweb.fsresources}")
	private String resDirPath;
	
	private File resDir;
	private FileFilter checkDir;
	private FileFilter checkFile;
	
	
	/*
	 * Initialize instance fields when loaded as service...
	 */
	@PostConstruct
	private void init(){
		checkDir = new IsDirectoryAndExistsFileFilter();
		checkFile = new IsFileAndExistsFileFilter();
		
		resDir = new File(resDirPath);
		if (!resDir.exists())
			log.warn("Invalid path to static resources directory"
					+ " (doesn't exist): " + resDir.getAbsolutePath());
		else if (!resDir.isDirectory())
			log.warn("Invalid path to static resources directory"
					+ " (not a directory): " + resDir.getAbsolutePath());
		else if (!resDir.canRead())
			log.warn("Invalid path to static resources directory"
					+ " (cannot read): " + resDir.getAbsolutePath());
		else
			log.info("Static file system resources "
					+ "directory set to \"" + resDir.getAbsolutePath() + "\".");
	}
	
	
	/**
	 * Returns all files (no directories) located at 
	 * top-level in the static resources directory.
	 * @return File[] Array containing the requested File objects
	 */
	public File[] getResourcesFiles() {
		return resDir.listFiles(checkFile);
	}
	
	
	/**
	 * Returns all files (no directories) located at 
	 * the given sub-path in the static resources directory, or
	 * an empty File[] if the path is invalid.
	 * @return File[] Array containing the requested File objects
	 */
	public File[] getResourcesFiles(String resourceDirectoryPath) {
		File subDir = getResource(resourceDirectoryPath, true);
		if (subDir == null) {
			log.warn("Not an existing directory: " + resourceDirectoryPath);
			return new File[0];
		}
		return subDir.listFiles(checkFile);
	}
	
	
	/**
	 * Returns a single resource file located at 
	 * the given sub-path in the static file system resources directory, or
	 * null if the path is invalid.
	 * @return the requested File object or null
	 */
	public File getResourcesFile(String path) {
		File f = getResource(path, false);
		if (f == null) log.warn("Not an existing file: " + path);
		return f;
	}
	
	
	/*
	 * Check and return a given resource file or directory
	 */
	private File getResource(String path, boolean isDirectory) {
		File f = new File(resDir.getAbsolutePath() + File.separator + path);
		if ((!isDirectory && !checkFile.accept(f)) 
				|| (isDirectory && !checkDir.accept(f))) {
			log.warn("Invalid path to resource: " + f.getAbsolutePath());
			return null;
		}
		return f;
	}
	
	
	/**
	 * Filters an array of File objects to only contain those objects with paths
	 * ending with one of the given suffixes.
	 * @param files
	 * @param fileNameSuffixes
	 * @return The filtered File[]
	 */
	public File[] filterForFileNameSuffixes(File[] files, String... fileNameSuffixes) {
		FileFilter filter = new FileNameSuffixFilter(fileNameSuffixes);
		return new ArrayList<File>(Arrays.asList(files))
			.stream()
			.filter(f -> filter.accept(f))
			.toArray(File[]::new);
	}
	
	
	/*
	 * FileFilter that checks if a File object
	 * represents an existing, readable file
	 */
	private class IsFileAndExistsFileFilter implements FileFilter {
		@Override
		public boolean accept(File f) {
			return f.exists() && f.isFile() && f.canRead();
		}
	}
	
	
	/*
	 * FileFilter that checks if a File object
	 * represents an existing, readable directory
	 */
	private class IsDirectoryAndExistsFileFilter implements FileFilter {
		@Override
		public boolean accept(File f) {
			return f.exists() && f.isDirectory() && f.canRead();
		}
	}
	
	
	/*
	 * FilenameFilter that checks if a File object
	 * represents a path ending with one of the specified suffixes
	 */
	private class FileNameSuffixFilter implements FileFilter {
		
		private String[] suffixes;
		
		public FileNameSuffixFilter (String... suffixes) {
			this.suffixes = suffixes;
		}
		
		@Override
	    public boolean accept(File f) {
	    	for (String suffix : suffixes) {
	    		if (f.getName().toLowerCase().endsWith(suffix.toLowerCase())) {
	    			return true;
	    		}
	    	}
	        return false;
	    }
	}
	
	
	/**
	 * Reads all the textual contents of the 
	 * given files into an array of String objects
	 * @param resourcesFiles
	 * @return
	 */
	public String[] readResourceFiles(File[] resourcesFiles) {
		String[] contents = new String[resourcesFiles.length];
		for (int i = 0; i < resourcesFiles.length; i++)
			contents[i] = readResourceFile(resourcesFiles[i]);
		return contents;
	}
	
	
	/**
	 * Reads the textual content of the given 
	 * file and returns it as a String object
	 * @param resourcesFile
	 * @return
	 */
	public String readResourceFile(File resourcesFile) {
		if (!checkFile.accept(resourcesFile)) {
			log.error("Not an existing, readable file: " + resourcesFile.getAbsolutePath());
			return "";
		}
		StringBuilder sb = new StringBuilder();
		try (BufferedReader br = Files.newBufferedReader(resourcesFile.toPath())){
			String line;
			while ((line = br.readLine()) != null) {
				sb.append(line);
				sb.append("\n");
			}
		} catch (IOException e) {
			log.error("Could not read resource file: " + resourcesFile.getAbsolutePath());
		}
		return sb.toString();
	}


}
