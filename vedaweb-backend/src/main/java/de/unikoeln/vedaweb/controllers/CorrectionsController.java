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
import io.swagger.v3.oas.annotations.Hidden;


/**
 * Controller for handling dictionary mapping corrections
 * 
 * @author bkis
 * 
 */
@RestController
@RequestMapping("api/corrections")
@Hidden
public class CorrectionsController {
	
	@Autowired
	CorrectionsRepository correctionsRepo;
	
	/**
	 * Saves passed Correction object
	 * @param correction
	 * @return
	 */
	@PostMapping(value = "/save", produces = MediaType.APPLICATION_JSON_VALUE)
    public String saveCorrections(@RequestBody Correction correction) {
		return correctionsRepo.save(correction).toString();
    }
	
	/**
	 * Returns a list of corrections for the given lemma
	 * @param lemma
	 * @return
	 */
	@PostMapping(value = "/lemma", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Correction> getCorrections(@RequestBody JsonNode lemma) {
		return correctionsRepo.findAllByCaseId(lemma.get("caseId").textValue());
    }

}
