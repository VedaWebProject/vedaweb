package de.unikoeln.vedaweb.dataimport;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;

import org.junit.Test;


public class ArbitraryConcordanceTest {
	
	@Test
	public void testSimpleMapping() {
		ArbitraryConcordance ac = new ArbitraryConcordance();
		ac.addMapping("from", "to");
		assertArrayEquals(new String[]{"to"}, ac.get("from"));
	}

	@Test
	public void testSourceDelimiterTrimming() {
		ArbitraryConcordance ac = new ArbitraryConcordance();
		ac.addMapping("01.001", "yeah");
		ac.setKeyDelimiter(".");
		assertArrayEquals(new String[]{"yeah"}, ac.get("01.001.04"));
	}
	
	@Test
	public void testReferenceDelimiterSplitting() {
		ArbitraryConcordance ac = new ArbitraryConcordance();
		ac.setKeyDelimiter(".");
		ac.setReferenceDelimiter(",");
		ac.addMapping("from.one", "to,and,fro");
		assertArrayEquals(new String[]{"to", "and", "fro"}, ac.get("from.one.two.three"));
	}
	
	@Test
	public void testTargetTemplateProcessing() {
		ArbitraryConcordance ac = new ArbitraryConcordance(
				"https://www.domain.tld/id/" + 
				ArbitraryConcordance.PLACEHOLDER);
		ac.addMapping("from", "to");
		ac.setKeyDelimiter(".");
		assertArrayEquals(new String[]{"https://www.domain.tld/id/to"}, ac.get("from"));
	}

}
