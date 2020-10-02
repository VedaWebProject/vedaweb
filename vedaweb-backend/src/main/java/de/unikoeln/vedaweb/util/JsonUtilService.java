package de.unikoeln.vedaweb.util;

import java.io.IOException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * Service class for abstracting some common JSON related things
 * 
 * @author bkis
 *
 */
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
	
}
