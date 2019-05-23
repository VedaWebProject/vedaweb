package de.unikoeln.vedaweb.util;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("api/utils/metre")
public class MetricalParseController {
	
	@GetMapping(value = {"/{input}"}, produces = MediaType.TEXT_PLAIN_VALUE)
    public String getMetre(@PathVariable("input") String input) {
		return MetricalParser.parse(input);
    }
	
}
