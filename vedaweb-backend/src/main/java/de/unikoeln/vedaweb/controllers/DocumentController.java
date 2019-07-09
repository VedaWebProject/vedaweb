package de.unikoeln.vedaweb.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.unikoeln.vedaweb.document.Stanza;
import de.unikoeln.vedaweb.document.StanzaLocation;
import de.unikoeln.vedaweb.document.StanzaRepository;
import de.unikoeln.vedaweb.util.JsonUtilService;
import de.unikoeln.vedaweb.util.StringUtils;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;


@RestController
@RequestMapping("api/document")
public class DocumentController {
	
	@Autowired
	private StanzaRepository stanzaRepo;
	
	@Autowired
	private JsonUtilService mappingService;
	
	
	@ApiOperation(value = "Get a stanza by ID (e.g. 0100306 for 01.0031.061)",
			response = Stanza.class)
	@GetMapping(value = "/id/{id:.+}",
			produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public String stanzaById(
    		@ApiParam(example = "0300201")
    		@PathVariable("id") String id) {
		
		//id matches form of <hymnAbs, stanza>
		if (id.matches("\\d+\\,\\d+")) {
			String[] i = id.split("\\,");
			Optional<Stanza> stanza = stanzaRepo.findByHymnAbsAndStanza(Integer.parseInt(i[0]), Integer.parseInt(i[1]));
			return mappingService.mapOptionalToJson(stanza);
		}
		
		//else...
		
		StanzaLocation loc = new StanzaLocation(id);
		Optional<Stanza> stanza;
		
		while (!(stanza = stanzaRepo.findByBookAndHymnAndStanza(
				loc.getBook(), loc.getHymn(), loc.getStanza())).isPresent()) {
			loc.setNextFallbackLocation();
		}
		
		return mappingService.mapOptionalToJson(stanza);
    }
	
	
	@ApiOperation(
			value = "Get a stanza by index (e.g. 0 for first stanza, 1 for second stanza and so on)",
			response = Stanza.class)
	@GetMapping(
			value = "/index/{index}",
			produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public String stanzaByLocation(
    		@ApiParam(example = "123")
    		@PathVariable int index) {
		return mappingService.mapOptionalToJson(
				stanzaRepo.findByIndex( StringUtils.normalizeIndex(index, (int)stanzaRepo.count()) ));
    }
	
}
