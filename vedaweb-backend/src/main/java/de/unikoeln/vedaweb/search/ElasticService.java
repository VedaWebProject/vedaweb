package de.unikoeln.vedaweb.search;

import java.io.IOException;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.apache.http.client.config.RequestConfig;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.RestClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;

/**
 * Uber-service that handles the lifecycle of and
 * provides access to the Elasticsearch client
 *
 * @author bkis
 *
 */
@Service
@PropertySource(value = "classpath:application.properties")
public class ElasticService {

	// es connection config
	@Value("${es.host}")
	private String esHost;
	@Value("${es.port}")
	private int esPort;
	@Value("${es.protocol}")
	private String esProtocol;
	@Value("${es.timeout}")
	private int esTimeout;

	private RestHighLevelClient client;


	@PostConstruct
	private void init(){
		// elasticsearch client
		client = new RestHighLevelClient(RestClient.builder(
			new HttpHost(esHost, esPort, esProtocol)).setRequestConfigCallback(
				new RestClientBuilder.RequestConfigCallback() {
					@Override
					public RequestConfig.Builder customizeRequestConfig(RequestConfig.Builder builder) {
						return esTimeout > 0
							? builder.setSocketTimeout(esTimeout)
							: builder;
					}
				}));
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
