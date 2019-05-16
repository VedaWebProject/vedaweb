package de.unikoeln.vedaweb.dictcorrection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/corrections")
public class CorrectionsController {
	
	@Autowired
	CorrectionsRepository correctionsRepo;
	
	@PostMapping(value = "/save", produces = MediaType.TEXT_PLAIN_VALUE)
    public String exportSearchCSV(@RequestBody Correction correction) {
		return correctionsRepo.save(correction).toString();
    }

}
