package de.unikoeln.vedaweb.document;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.unikoeln.vedaweb.util.JsonUtilService;
import de.unikoeln.vedaweb.util.StringUtils;


@RestController
@RequestMapping("api/document")
public class DocumentController {
	
	@Autowired
	private StanzaRepository stanzaRepo;
	
	@Autowired
	private JsonUtilService mappingService;
	
	
	@RequestMapping(value = "/id/{id}", produces = {"application/json"})
    public String stanzaById(
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
	
	
	@RequestMapping(value = "/index/{index}", produces = {"application/json"})
    public String stanzaByLocation(@PathVariable int index) {
		return mappingService.mapOptionalToJson(
				stanzaRepo.findByIndex( StringUtils.normalizeIndex(index, (int)stanzaRepo.count()) ));
    }
	
}
