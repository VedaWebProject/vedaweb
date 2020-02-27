package de.unikoeln.vedaweb.xmlimport;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import de.unikoeln.vedaweb.dataimport.ArbitraryConcordance;

public class ArbitraryConcordanceTest {
	
	@Test
	public void testSimpleMapping() {
		ArbitraryConcordance ac = new ArbitraryConcordance();
		ac.addMapping("from", "to");
		assertEquals("to", ac.get("from"));
	}

	@Test
	public void testSourceDelimiterTrimming() {
		ArbitraryConcordance ac = new ArbitraryConcordance();
		ac.addMapping("from", "to");
		ac.setKeyDelimiter(".");
		assertEquals("to", ac.get("from.one.to"));
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testTargetTemplateMustContainPlaceholder() {
		new ArbitraryConcordance("https://www.domain.tld/id/");
	}
	
	@Test
	public void testTargetTemplateProcessing() {
		ArbitraryConcordance ac = new ArbitraryConcordance("https://www.domain.tld/id/" + ArbitraryConcordance.PLACEHOLDER);
		ac.addMapping("from", "to");
		ac.setKeyDelimiter(".");
		assertEquals("https://www.domain.tld/id/to", ac.get("from"));
	}

}
