package de.unikoeln.vedaweb.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.unikoeln.vedaweb.document.Stanza;
import de.unikoeln.vedaweb.document.StanzaRepository;
import de.unikoeln.vedaweb.document.StanzaXml;
import de.unikoeln.vedaweb.document.StanzaXmlRepository;
import de.unikoeln.vedaweb.export.ExportLayers;
import de.unikoeln.vedaweb.export.GlossingsHtmlExport;
import de.unikoeln.vedaweb.export.GlossingsTxtExport;
import de.unikoeln.vedaweb.export.SearchResultsCsvExport;
import de.unikoeln.vedaweb.export.StanzaTxtExport;
import de.unikoeln.vedaweb.search.ElasticSearchService;
import de.unikoeln.vedaweb.search.SearchData;
import de.unikoeln.vedaweb.search.SearchHitsConverter;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("api/export")
public class ExportController {
	
	@Autowired
	private ElasticSearchService search;
	
	@Autowired
	private StanzaXmlRepository stanzaXmlRepo;
	
	@Autowired
	private StanzaRepository stanzaRepo;
	
	
	@ApiOperation(
			value = "Export results of the given search as CSV")
	@PostMapping(
			value = "/search",
			consumes = MediaType.APPLICATION_JSON_VALUE,
			produces = "text/plain;charset=UTF-8")
    public String exportSearchCSV(@RequestBody SearchData searchData) {
		
		searchData.setSize((int)stanzaRepo.count());	//get ALL results
		searchData.setFrom(0);	//export from result 0
		return SearchResultsCsvExport.searchHitsAsCsv(
				SearchHitsConverter.processSearchResponse(
						search.search(searchData)));
    }
	
	
	@ApiOperation(
			httpMethod = "POST",
			value = "Export a specific stanza as TEI XML (this is a POST endpoint, "
					+ "because layer selection via request body will be implemented in the future)")
	@PostMapping(
			value = "/doc/{docId}/xml",
			//consumes = MediaType.APPLICATION_JSON_VALUE,
			produces = "text/xml;charset=UTF-8")
    public String exportDocXml(
    		@PathVariable("docId") String docId) {
		
		Optional<StanzaXml> xml = stanzaXmlRepo.findById(docId);
		return xml.isPresent() ? xml.get().getXml() : "";
    }
	

	@ApiOperation(
			value = "Export a specific stanza's data as plain text")
	@PostMapping(
			value = "/doc/{docId}/txt",
			consumes = MediaType.APPLICATION_JSON_VALUE,
			produces = "text/plain;charset=UTF-8")
    public String exportDocTxt(
    		@PathVariable("docId") String docId,
    		@RequestBody ExportLayers exportLayers) {
		
		Optional<Stanza> stanza = stanzaRepo.findById(docId);
		return stanza.isPresent()
				? StanzaTxtExport.stanzaTxt(stanza.get(), exportLayers)
				: "";
    }
	
	
	

	@ApiOperation(
			value = "Export a specific stanza's morphological glossing as plain text")
	@GetMapping(
			value = "/glossings/{docId}/txt",
			produces = "text/plain;charset=UTF-8")
    public String exportGlossingsTxt(@PathVariable("docId") String docId) {
		
		Optional<Stanza> stanza = stanzaRepo.findById(docId);
		return stanza.isPresent() ? GlossingsTxtExport.glossingsTxt(stanza.get()) : "";
    }
	

	@ApiOperation(
			value = "Export a specific stanza's morphological glossing as HTML table")
	@GetMapping(
			value = "/glossings/{docId}/html",
			produces = "text/plain;charset=UTF-8")
    public String exportGlossingsHtml(@PathVariable("docId") String docId) {
		
		Optional<Stanza> stanza = stanzaRepo.findById(docId);
		return stanza.isPresent() ? GlossingsHtmlExport.glossingsHtml(stanza.get()) : "";
    }
	
	
}
