package de.unikoeln.vedaweb.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;

import de.unikoeln.vedaweb.dictcorrection.Correction;
import de.unikoeln.vedaweb.dictcorrection.CorrectionsRepository;
import springfox.documentation.annotations.ApiIgnore;

@RestController
@RequestMapping("api/corrections")
@ApiIgnore
public class CorrectionsController {
	
	@Autowired
	CorrectionsRepository correctionsRepo;
	
	@PostMapping(value = "/save", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public String exportSearchCSV(@RequestBody Correction correction) {
		return correctionsRepo.save(correction).toString();
    }
	
	@PostMapping(value = "/lemma", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public List<Correction> getCorrections(@RequestBody JsonNode lemma) {
		return correctionsRepo.findAllByCaseId(lemma.get("caseId").textValue());
    }

}
