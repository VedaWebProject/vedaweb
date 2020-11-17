package de.unikoeln.vedaweb.util;
import java.util.Arrays;
import java.util.List;

import org.commonmark.Extension;
import org.commonmark.ext.gfm.tables.TablesExtension;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;
import org.springframework.stereotype.Service;

/**
 * Service class for parsing Markdown to HTML
 * 
 * @author bkis
 *
 */
@Service
public class MarkdownService {
	
	private Parser parser;
	private HtmlRenderer renderer;
	
	public MarkdownService() {
		List<Extension> extensions = Arrays.asList(TablesExtension.create());
		this.parser = Parser.builder()
				.extensions(extensions)
				.build();
		this.renderer = HtmlRenderer.builder()
				.extensions(extensions)
				.build();
	}
	
	/**
	 * Simply parses the given Markdown to HTML
	 * @param markdown Markdown as string
	 * @return HTML as String
	 */
	public String parse(String markdown) {
		return renderer.render(parser.parse(markdown));
	}

}
