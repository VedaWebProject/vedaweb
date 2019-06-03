package de.unikoeln.vedaweb.util;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class HtmlSnippetsLoader {
	
	private static final String SNIPPETS_DIR = "snippets";
	
	
	public static ObjectNode loadHtmlSnippets() throws IOException {
		
		ObjectNode snippets = JsonNodeFactory.instance.objectNode();
		File snippetsDir = new File(SNIPPETS_DIR);
		
		if (!snippetsDir.exists() || !snippetsDir.isDirectory()) {
			return snippets;
		}
		
		for (File f : snippetsDir.listFiles()) {
			if (f.isFile()) {
				StringBuilder sb = new StringBuilder();
				for (String line : Files.readAllLines(f.toPath(), StandardCharsets.UTF_8)) {
					sb.append(line + "\n");
				}
				snippets.put(f.getName().replaceFirst("\\.[^\\.]+$", ""), sb.toString());
			}
		}
		
		return snippets;
	}

}
