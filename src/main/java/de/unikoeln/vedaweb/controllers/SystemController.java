package de.unikoeln.vedaweb.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.unikoeln.vedaweb.data.VerseRepository;
import de.unikoeln.vedaweb.services.ElasticIndexService;
import de.unikoeln.vedaweb.services.MappingService;



@RestController
@RequestMapping("system")
public class SystemController {
	
	@Autowired
	private ElasticIndexService indexService;
	
	
	@RequestMapping(value = "/index/{action}", produces = {"application/json"})
    public String verseById(@PathVariable("action") String action) {
		switch (action){
		case "delete":
			return indexService.deleteIndex().toString();
		case "create":
			return indexService.createIndex().toString();
		case "fill":
			return indexService.indexDbDocuments().toString();
		default:
			return "{response:'unknown command'}";
		}
    }
	
	
}
