package de.unikoeln.vedaweb.util;
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
		this.parser = Parser.builder().build();
		this.renderer = HtmlRenderer.builder().build();
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
