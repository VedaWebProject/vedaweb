package de.unikoeln.vedaweb.arbitrarydata;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.unikoeln.vedaweb.util.JsonUtilService;



@RestController
@RequestMapping("api")
public class ArbitraryHtmlController {
	
	@Autowired
	private ArbitraryHtmlRepository dataRepo;
	
	@Autowired
	private JsonUtilService json;
	
	@RequestMapping(value = "/data/{id}", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public String getData(@PathVariable("id") String id) {
		return json.mapOptionalToJson(
				dataRepo.findById(
						id.replaceFirst("\\.html?$", "") + ".html"
				));
    }
	
}
