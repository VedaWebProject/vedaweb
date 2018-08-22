package de.unikoeln.vedaweb.services;

import java.io.IOException;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;

@Service
@PropertySource(value = "classpath:es.properties")
public class ElasticService {
	
	// es connection config
	@Value("${es.host}")
	private String esHost;
	@Value("${es.port}")
	private int esPort;
	@Value("${es.protocol}")
	private String esProtocol;
	
	private RestHighLevelClient client;

	
	@PostConstruct
	private void init(){
		// elasticsearch client
		client = new RestHighLevelClient(RestClient.builder(
			new HttpHost(esHost, esPort, esProtocol)));
	}
	
	
	@PreDestroy
	public void destroy() {
		// elasticsearch client
		try {
			client.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	
	public RestHighLevelClient client(){
		if (client == null) init();
		return client;
	}
	

}
