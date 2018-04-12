package de.unikoeln.vedaweb.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;


@Service
public class MappingService {
	
	private ObjectMapper mapper;
	
	
	public MappingService(){
		mapper = new ObjectMapper();
	}
	
	
	public String mapToJSON(Optional<?> o){
		if (!o.isPresent())
			return mapToJSON(null);
		else
			return mapToJSON(o.get());
	}
	
	public String mapToJSON(Object o){
		String json = "{}";
		if (o == null)
			return json;
		try {
			json = mapper.writeValueAsString(o);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		return json;
	}

}
