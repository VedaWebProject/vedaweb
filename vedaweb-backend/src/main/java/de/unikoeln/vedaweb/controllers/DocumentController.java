package de.unikoeln.vedaweb.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.unikoeln.vedaweb.data.Stanza;
import de.unikoeln.vedaweb.data.StanzaLocation;
import de.unikoeln.vedaweb.data.StanzaRepository;
import de.unikoeln.vedaweb.services.MappingService;
import de.unikoeln.vedaweb.util.StringUtils;


@RestController
@RequestMapping("api/document")
public class DocumentController {
	
	@Autowired
	private StanzaRepository stanzaRepo;
	
	@Autowired
	private MappingService mappingService;
	
	
	@RequestMapping(value = "/id/{id}", produces = {"application/json"})
    public String stanzaById(
    		@PathVariable("id") String id) {
		
		//request for absolute hymn number?
		if (id.startsWith("hymnAbs_")) {
			return mappingService.mapObjectToJSON(
					stanzaRepo.findByHymnAbs(Integer.parseInt(id.replaceAll("\\D", ""))).get().get(0));
		}
		
		StanzaLocation loc = new StanzaLocation(id);
		Optional<Stanza> v;
		
		while (!(v = stanzaRepo.findByBookAndHymnAndStanza(
				loc.getBook(), loc.getHymn(), loc.getStanza())).isPresent()) {
			loc.setNextFallbackLocation();
		}
		
		return mappingService.mapOptionalToJSON(v);
    }
	
	
	@RequestMapping(value = "/index/{index}", produces = {"application/json"})
    public String stanzaByLocation(@PathVariable int index) {
		return mappingService.mapOptionalToJSON(
				stanzaRepo.findByIndex( StringUtils.normalizeIndex(index, (int)stanzaRepo.count()) ));
    }
	
}
