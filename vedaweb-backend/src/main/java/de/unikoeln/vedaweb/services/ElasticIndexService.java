package de.unikoeln.vedaweb.services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.http.HttpEntity;
import org.apache.http.util.EntityUtils;
import org.elasticsearch.action.admin.indices.create.CreateIndexRequest;
import org.elasticsearch.action.admin.indices.create.CreateIndexResponse;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexResponse;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.search.aggregations.Aggregation;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.nested.Nested;
import org.elasticsearch.search.aggregations.bucket.nested.NestedAggregationBuilder;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.aggregations.metrics.cardinality.Cardinality;
import org.elasticsearch.search.aggregations.metrics.cardinality.CardinalityAggregationBuilder;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import de.unikoeln.vedaweb.data.Pada;
import de.unikoeln.vedaweb.data.Token;
import de.unikoeln.vedaweb.data.Verse;
import de.unikoeln.vedaweb.data.VerseRepository;
import de.unikoeln.vedaweb.data.VerseVersion;
import de.unikoeln.vedaweb.util.IOUtils;
import de.unikoeln.vedaweb.util.StringUtils;


@Service
@PropertySource(value = "classpath:es.properties")
public class ElasticIndexService {
	
	@Autowired
	private VerseRepository verseRepo;
	
	@Autowired
	private ElasticService elastic;
	
	@Value("${es.index.name}")
	private String indexName;
	
	@Value("classpath:es-index.json")
	private Resource indexDef;

	
	public JSONObject rebuildIndex(){
		JSONObject response = new JSONObject();
		try {
			//delete old index
			System.out.println("[INFO] deleting old index...");
			response.put("deleteIndex", deleteIndex().getString("response"));
			//create new Index
			System.out.println("[INFO] creating new index...");
			response.put("createIndex", createIndex().getString("response"));
			// get all documents from db
			System.out.println("[INFO] creating and inserting new index documents...");
			response.put("fillIndex", indexDbDocuments().getString("response"));
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return response;
	}
	
	
	public JSONObject indexDbDocuments(){
		JSONObject jsonResponse = new JSONObject();
		Iterator<Verse> dbIter = verseRepo.findAll().iterator();
		// create es bulk request
		BulkRequest bulkRequest = new BulkRequest();

		// process docs
		while (dbIter.hasNext()) {
			Verse dbDoc = dbIter.next();
			JSONObject indexDoc = new JSONObject();

			try {
				indexDoc.put("id", dbDoc.getId());
				indexDoc.put("index", dbDoc.getIndex());
				indexDoc.put("book", dbDoc.getBook());
				indexDoc.put("hymn", dbDoc.getHymn());
				indexDoc.put("verse", dbDoc.getVerse());
				indexDoc.put("hymnAddressee", dbDoc.getHymnAddressee());
				indexDoc.put("hymnGroup", dbDoc.getHymnGroup());
				indexDoc.put("strata", dbDoc.getStrata());
				indexDoc.put("translation", concatTranslations(dbDoc));
				String concat = concatPadaForms(dbDoc) + concatTokenLemmata(dbDoc);
				indexDoc.put("form", StringUtils.removeUnicodeAccents(concat));
				indexDoc.put("form_raw", StringUtils.normalize(concat));
				indexDoc.put("tokens", buildTokensList(dbDoc));
			} catch (JSONException e) {
				e.printStackTrace();
			}
			
			// create index request
			IndexRequest request = new IndexRequest("vedaweb", "doc", dbDoc.getId());

			// add request source
			request.source(indexDoc.toString(), XContentType.JSON);

			// add to bulk request
			bulkRequest.add(request);
		}

		// send bulk request
		BulkResponse bulkResponse = null;
		try {
			bulkResponse = elastic.client().bulk(bulkRequest);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		//create response object
		try {
			jsonResponse.put("response",
					bulkResponse != null && !bulkResponse.hasFailures()
					? "{fillIndex:'OK'}"
					: "{fillIndex:'Error'}");
		} catch (JSONException e) {
			e.printStackTrace();
		}

		return jsonResponse;
	}
	

	private List<JSONObject> buildTokensList(Verse doc) throws JSONException{
		List<Pada> padas = doc.getPadas();
		List<JSONObject> tokens = new ArrayList<JSONObject>();

		for (Pada pada : padas) {
			for (Token token : pada.getTokens()) {
				JSONObject indexToken = new JSONObject();
				indexToken.put("index", token.getIndex());
				indexToken.put("form", StringUtils.removeUnicodeAccents(token.getForm()));
				indexToken.put("lemma", StringUtils.removeUnicodeAccents(token.getLemma()));
				//grammar
//				JSONArray indexTokenGrammar = new JSONArray();
				JSONObject indexTokenGrammar = new JSONObject();
//				JSONObject currGrammarAttribute;
				for (String attr : token.getGrammarAttributes().keySet()) {
//					currGrammarAttribute = new JSONObject();
//					currGrammarAttribute.put("tag", attr);
//					currGrammarAttribute.put("value", token.getGrammarAttribute(attr));
//					indexTokenGrammar.put(currGrammarAttribute);
					String values = token.getGrammarAttribute(attr);
					if (values.split("\\/").length > 1) {
						JSONArray tagValues = new JSONArray();
						for (String tv : values.split("\\/")) {
							tagValues.put(tv);
						}
						indexTokenGrammar.put(attr, tagValues);
					} else {
						indexTokenGrammar.put(attr, token.getGrammarAttribute(attr));
					}
				}
				indexToken.put("grammar", indexTokenGrammar);
				tokens.add(indexToken);
			}
		}

		return tokens;
	}
	

	public JSONObject deleteIndex(){
		JSONObject jsonResponse = new JSONObject();
		DeleteIndexRequest deleteRequest = new DeleteIndexRequest(indexName);
		DeleteIndexResponse deleteResponse = null;
		try {
			deleteResponse = elastic.client().indices().delete(deleteRequest);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		//create response object
		try {
			jsonResponse.put("response",
					deleteResponse != null && deleteResponse.isAcknowledged()
					? "{deleteIndex:'OK'}"
					: "{deleteIndex:'Error'}");
		} catch (JSONException e) {
			e.printStackTrace();
		}

		return jsonResponse;
	}
	
	
	public JSONObject createIndex(){
		JSONObject jsonResponse = new JSONObject();
		CreateIndexRequest createRequest = new CreateIndexRequest(indexName);
		byte[] json = null;
		
		try {
			json = IOUtils.convertStreamToByteArray(indexDef.getInputStream());
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		
		createRequest.source(json, XContentType.JSON);
		CreateIndexResponse createResponse = null;
		
		try {
			createResponse = elastic.client().indices().create(createRequest);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		//create response object
		try {
			jsonResponse.put("response",
					createResponse != null && createResponse.isAcknowledged()
					? "{createIndex:'OK'}"
					: "{createIndex:'Error'}");
		} catch (JSONException e) {
			e.printStackTrace();
		}

		return jsonResponse;
	}
	
	
	public JSONArray getUIGrammarData() {
		List<String> grammarFields = new ArrayList<>();
		
		JSONObject response = (JSONObject) urlRequest(
				"get",
				"vedaweb/_mapping/doc/field/tokens.grammar.*",
				"\"/vedaweb/mappings/doc\"");
		
		for (String prop : response.keySet()) {
			grammarFields.add(prop.replaceAll("^(\\w+\\.)+", ""));
		}
		
		Collections.sort(grammarFields);
		return convertGrammarAggregationsToJSON(collectGrammarFieldAggregations(grammarFields));
	}
	
	//TODO
	public JSONArray getUIBooksData() {
		//Map<Integer, Integer> books = new HashMap<>();
		
		return null;
	}
	
	
	private JSONObject urlRequest(String method, String url) {
		JSONObject response = null;
		try {
			HttpEntity http =
					elastic.client()
					.getLowLevelClient()
					.performRequest(method, url)
					.getEntity();
			response = new JSONObject(EntityUtils.toString(http));
		} catch (IOException e) {
			e.printStackTrace();
		}
		return response;
	}
	
	
	private Object urlRequest(String method, String url, String jsonQuery) {
		JSONObject response = urlRequest(method, url);
		if (response == null) return null;
		return response.query("/vedaweb/mappings/doc");
	}
	
	
	@SuppressWarnings("unused")
	private long distinct(String field) {
		long count = 0;
		CardinalityAggregationBuilder agg = AggregationBuilders.cardinality("agg");
		agg.field(field);
		SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder().aggregation(agg);
		SearchRequest req = new SearchRequest("vedaweb").types("doc").source(searchSourceBuilder);
		try {
			SearchResponse response = elastic.client().search(req);
			count = ((Cardinality)response.getAggregations().get("agg")).getValue();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return count;
	}
	
	
	private Map<String, List<String>> collectGrammarFieldAggregations(List<String> grammarFields) {
		Map<String, List<String>> grammarAggregations = new HashMap<>();
		
		SearchRequest req = new SearchRequest("vedaweb"); 
		req.types("doc");
		SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder(); 
		
		NestedAggregationBuilder tokens = AggregationBuilders.nested("tokens", "tokens");
		
		for (String grammarField : grammarFields) {
			tokens.subAggregation(
					AggregationBuilders.terms(grammarField).field("tokens.grammar." + grammarField).size(1000)
			);
		}
		
		searchSourceBuilder.aggregation(tokens);
		req.source(searchSourceBuilder);
		
		try {
			SearchResponse response = elastic.client().search(req);
			Nested nested = response.getAggregations().get("tokens");
			for (Aggregation agg : nested.getAggregations()) {
				Terms terms = (Terms) agg;
				List<String> values = new ArrayList<String>();
				for (Terms.Bucket bucket : terms.getBuckets()) {
					values.add(bucket.getKey().toString());
				}
				grammarAggregations.put(terms.getName(), values);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return grammarAggregations;
	}
	
	
	private JSONArray convertGrammarAggregationsToJSON(Map<String, List<String>> aggs) {
		JSONArray tagsArray = new JSONArray();
		
		for (String grammarField : aggs.keySet()) {
			JSONObject tagData = new JSONObject();
			tagData.put("field", grammarField);
			tagData.put("ui", grammarField.substring(0, 1).toUpperCase() + grammarField.substring(1).toLowerCase());
			tagData.put("values", new JSONArray(aggs.get(grammarField)));
			tagsArray.put(tagData);
		}
		
		return tagsArray;
	}
	
	
	private String concatPadaForms(Verse doc) {
		StringBuilder sb = new StringBuilder();
		for (Pada pada : doc.getPadas()) {
			sb.append(pada.getForm());
			sb.append(" ");
		}
		return sb.toString().replaceAll("\\s+", " ").trim();
	}
	
	
	private String concatTokenLemmata(Verse doc) {
		StringBuilder sb = new StringBuilder();
		for (Pada pada : doc.getPadas()) {
			for (Token token : pada.getTokens()){
				sb.append(token.getForm());
				sb.append(" ");
			}
		}
		return sb.toString().trim();
	}
	
	
	private String concatTranslations(Verse doc) {
		StringBuilder sb = new StringBuilder();
		for (VerseVersion t : doc.getTranslations()) {
			for (String line : t.getForm()) {
				sb.append(line);
				sb.append(" ");
			}
		}
		return sb.toString().trim();
	}
	
	
}
