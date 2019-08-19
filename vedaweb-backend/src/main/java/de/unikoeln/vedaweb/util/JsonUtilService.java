package de.unikoeln.vedaweb.util;

import java.io.IOException;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import de.unikoeln.vedaweb.exceptions.NotFoundException;


@Service
public class JsonUtilService {
	
	private ObjectMapper mapper;
	
	
	public JsonUtilService(){
		mapper = new ObjectMapper();
		mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
	}
	
	
	public ObjectNode newObjectNode() {
		return mapper.createObjectNode();
	}
	
	
	public ArrayNode newArrayNode() {
		return mapper.createArrayNode();
	}
	
	
	public ObjectNode parse(String jsonString) {
		try {
			return (ObjectNode) mapper.readTree(jsonString);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return newObjectNode();
	}
	
	
	public ObjectMapper getMapper() {
		return mapper;
	}
	
	
	public String mapOptionalToJsonString(Optional<?> o){
		if (!o.isPresent())
			return mapObjectToJsonString(null);
		else
			return mapObjectToJsonString(o.get());
	}
	
	
	public String mapObjectToJsonString(Object o){
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
	
	
	public JsonNode mapOptionalToJsonNode(Optional<?> o){
		if (!o.isPresent())
			return newObjectNode();
		else
			return mapObjectToJsonNode(o.get());
	}
	
	
	public <T> JsonNode mapObjectToJsonNode(T obj){
		return mapper.valueToTree(obj);
	}

}
