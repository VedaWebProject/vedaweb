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
import de.unikoeln.vedaweb.util.StringUtils;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;


@RestController
@RequestMapping("api/document")
public class DocumentController {
	
	@Autowired
	private StanzaRepository stanzaRepo;
	
	
	@ApiOperation(value = "Get a stanza by ID (e.g. 0100306 for 01.0031.061)",
			response = Stanza.class)
	@GetMapping(value = "/id/{id:.+}",
			produces = MediaType.APPLICATION_JSON_VALUE)
    public Stanza stanzaById(
    		@ApiParam(example = "0300201")
    		@PathVariable("id") String id) {
		
		Optional<Stanza> stanza = null;
		
		//id matches form of <hymnAbs, stanza>
		if (id.matches("\\d+\\,\\d+")) {
			String[] i = id.split("\\,");
			stanza = stanzaRepo.findByHymnAbsAndStanza(Integer.parseInt(i[0]), Integer.parseInt(i[1]));
		} else {
			StanzaLocation loc = new StanzaLocation(id);
			
			while (!(stanza = stanzaRepo.findByBookAndHymnAndStanza(
					loc.getBook(), loc.getHymn(), loc.getStanza())).isPresent()) {
				loc.setNextFallbackLocation();
			}
		}
		
		return stanza != null && stanza.isPresent() ? stanza.get() : null;
    }
	
	
	@ApiOperation(
			value = "Get a stanza by index (e.g. 0 for first stanza, 1 for second stanza and so on)",
			response = Stanza.class)
	@GetMapping(
			value = "/index/{index}",
			produces = MediaType.APPLICATION_JSON_VALUE)
    public Stanza stanzaByLocation(
    		@ApiParam(example = "123")
    		@PathVariable int index) {
		
		Optional<Stanza> stanza = stanzaRepo.findByIndex(StringUtils.normalizeIndex(index, (int)stanzaRepo.count()));
		return stanza != null && stanza.isPresent() ? stanza.get() : null;
    }
	
}
