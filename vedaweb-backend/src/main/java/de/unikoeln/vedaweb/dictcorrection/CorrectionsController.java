package de.unikoeln.vedaweb.dictcorrection;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;

@RestController
@RequestMapping("api/corrections")
public class CorrectionsController {
	
	@Autowired
	CorrectionsRepository correctionsRepo;
	
	@PostMapping(value = "/save", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public String exportSearchCSV(@RequestBody Correction correction) {
		return correctionsRepo.save(correction).toString();
    }
	
	@PostMapping(value = "/lemma", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public List<Correction> getCorrections(@RequestBody JsonNode lemma) {
		return correctionsRepo.findAllByLemma(lemma.get("lemma").textValue());
    }

}
