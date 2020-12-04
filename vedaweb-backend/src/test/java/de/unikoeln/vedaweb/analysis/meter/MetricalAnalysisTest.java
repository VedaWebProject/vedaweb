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
		String input = "yé asyā ̀ ācáraṇeṣu dadhriré";
		String expected = "— —— · —◡◡—◡ —◡—";
		String actual = MetricalAnalysis.parse(input, "—", "◡");
		assertEquals(expected, actual);
	}
	
	@Test
	public void testParsing6() {
		String input = "úṣo yé te ̀ prá yā́meṣu yuñjáte";
		String expected = "◡— — — · ◡ ——◡ —◡—";
		String actual = MetricalAnalysis.parse(input, "—", "◡");
		assertEquals(expected, actual);
	}
	
	@Test
	public void testParsing7() {
		assertEquals(
			"1_agním 3_īḷe 5_puróhitaṁ",
			MetricalAnalysis.annotate("agním īḷe puróhitaṁ")
		);
	}
	
	@Test
	public void testParsing8() {
		String input = "kadā́ vaso ̀ stotráṁ háryate ā́";
		String expected = "◡— ◡— · —— —◡— —";
		String actual = MetricalAnalysis.parse(input, "—", "◡");
		assertEquals(expected, actual);
	}
	
	@Test
	public void testParsing9() {
		String input = "íti krátvā nyeriré";
		String expected = "◡— —— —◡—";
		String actual = MetricalAnalysis.parse(input, "—", "◡");
		assertEquals(expected, actual);
	}
	
	@Test
	public void testParsing10() {
		String input = "íti krátvā nieriré";
		String expected = "◡— —— ◡—◡—";
		String actual = MetricalAnalysis.parse(input, "—", "◡");
		assertEquals(expected, actual);
	}
	
	@Test
	public void testParsing11() {
		String input = "tvā́ṁ hy àgne sádam ít samanyávo";
		String expected = "— —— ◡◡ — ◡—◡—";
		String actual = MetricalAnalysis.parse(input, "—", "◡");
		assertEquals(expected, actual);
	}
	
}
