package de.unikoeln.vedaweb.analysis.meter;

import static org.junit.Assert.*;
import org.junit.Test;


public class MetricalAnalysisTest {

	@Test
	public void testParsing() {
		String input = "yahvā́ iva prá vayā́m ujjíhānāḥ";
		String expected = "—— ◡— ◡ ◡— —◡——";
		String actual = MetricalAnalysis.parse(input, "—", "◡");
		assertEquals(expected, actual);
	}
	
	@Test
	public void testParsing2() {
		String input = "kr̥tam";
		String expected = "◡—";
		String actual = MetricalAnalysis.parse(input, "—", "◡");
		assertEquals(expected, actual);
	}
	
	@Test
	public void testParsing3() {
		String input = "górabhasam ádribhir vaatā́pyam";
		String expected = "—◡◡◡ —◡— ◡◡——";
		String actual = MetricalAnalysis.parse(input, "—", "◡");
		assertEquals(expected, actual);
	}
	
	@Test
	public void testParsing4() {
		String input = "ví ā́śāḥ párvatānaam";
		String expected = "◡ —— —◡—◡—";
		String actual = MetricalAnalysis.parse(input, "—", "◡");
		assertEquals(expected, actual);
	}
	
	@Test
	public void testParsing5() {
		assertEquals(
			"1_agním 3_īḷe 5_puróhitaṁ",
			MetricalAnalysis.annotate("agním īḷe puróhitaṁ")
		);
	}
	
}
