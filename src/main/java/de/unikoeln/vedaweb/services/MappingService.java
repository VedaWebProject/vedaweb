package de.unikoeln.vedaweb.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import de.unikoeln.vedaweb.exceptions.NotFoundException;


@Service
public class MappingService {
	
	private ObjectMapper mapper;
	
	
	public MappingService(){
		mapper = new ObjectMapper();
	}
	
	
	public String mapOptionalToJSON(Optional<?> o){
		if (!o.isPresent())
			return mapObjectToJSON(null);
		else
			return mapObjectToJSON(o.get());
	}
	
	public String mapObjectToJSON(Object o){
		String json = "{}";
		if (o == null){
			throw new NotFoundException();
		}
		try {
			json = mapper.writeValueAsString(o);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		return json;
	}

}
