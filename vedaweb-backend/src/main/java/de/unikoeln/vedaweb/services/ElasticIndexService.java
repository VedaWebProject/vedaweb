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
import org.elasticsearch.client.Response;
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.MatchQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.Aggregation;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.nested.Nested;
import org.elasticsearch.search.aggregations.bucket.nested.NestedAggregationBuilder;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.aggregations.bucket.terms.Terms.Bucket;
import org.elasticsearch.search.aggregations.bucket.terms.TermsAggregationBuilder;
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
			response.put("deleteIndex", deleteIndex().getString("response"));
			//create new Index
			response.put("createIndex", createIndex().getString("response"));
			// get all documents from db
			response.put("fillIndex", indexDbDocuments().getString("response"));
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return response;
	}
	
	
	public JSONObject indexDbDocuments(){
		System.out.println("[INFO] creating and inserting new index documents...");
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
				indexDoc.put("versions", buildVersionsList(dbDoc));
//				indexDoc.put("lemmata", StringUtils.removeVowelAccents(concatTokenLemmata(dbDoc)));
//				indexDoc.put("lemmata_raw", StringUtils.normalizeNFC(concatTokenLemmata(dbDoc)));
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
					? "OK"
					: "error");
		} catch (JSONException e) {
			e.printStackTrace();
		}

		return jsonResponse;
	}
	

	private List<JSONObject> buildTokensList(Verse doc) throws JSONException{
		List<JSONObject> tokens = new ArrayList<JSONObject>();

		for (Pada pada : doc.getPadas()) {
			for (Token token : pada.getGrammarData()) {
				JSONObject indexToken = new JSONObject();
				indexToken.put("index", token.getIndex());
				indexToken.put("form", StringUtils.removeVowelAccents(token.getForm()));
				indexToken.put("form_raw", StringUtils.normalizeNFC(token.getForm()));
				indexToken.put("lemma",
						StringUtils.removeVowelAccents(
								StringUtils.cleanLemma(token.getLemma())));
				indexToken.put("lemma_raw",
						StringUtils.normalizeNFC(
								StringUtils.cleanLemma(token.getLemma())));
				
				//grammar props
				JSONObject indexTokenGrammar = new JSONObject();
				for (String attr : token.getProps().keySet()) {
					String values = token.getProp(attr);
					if (values.split("\\/").length > 1) {
						JSONArray tagValues = new JSONArray();
						for (String tv : values.split("\\/")) {
							tagValues.put(tv);
						}
						indexTokenGrammar.put(attr, tagValues);
					} else {
						indexTokenGrammar.put(attr, token.getProp(attr));
					}
				}
				indexToken.put("grammar", indexTokenGrammar);
				tokens.add(indexToken);
			}
		}

		return tokens;
	}
	

	public JSONObject deleteIndex(){
		System.out.println("[INFO] deleting old index...");
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
					? "OK"
					: "error");
		} catch (JSONException e) {
			e.printStackTrace();
		}

		return jsonResponse;
	}
	
	
	public JSONObject createIndex(){
		System.out.println("[INFO] creating new index...");
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
					? "OK"
					: "error");
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
				"/vedaweb/mappings/doc");
		
		if (response == null) {
			System.err.println("[ERROR] Could'nt find index grammar mapping");
			return new JSONArray();
		}
		
		for (String prop : response.keySet()) {
			grammarFields.add(prop.replaceAll("^(\\w+\\.)+", ""));
		}
		
		Collections.sort(grammarFields);
		return convertGrammarAggregationsToJSON(collectGrammarFieldAggregations(grammarFields));
	}
	
	
	public JSONArray getUIBooksData() {
		JSONArray books = new JSONArray();
		int booksCount = (int) distinct("book");
		
		for (int i = 1; i <= booksCount; i++) {
			//match current book
			MatchQueryBuilder match = QueryBuilders.matchQuery("book", i);
			//aggregation for distinct hymn number values
			CardinalityAggregationBuilder agg = 
					AggregationBuilders.cardinality("hymns").field("hymn");
			//compose request source
			SearchSourceBuilder searchSourceBuilder = 
					new SearchSourceBuilder().query(match).aggregation(agg);
			//create request
			SearchRequest req = new SearchRequest("vedaweb").types("doc").source(searchSourceBuilder);
			try {
				SearchResponse response = elastic.client().search(req);
				books.put(((Cardinality)response.getAggregations().get("hymns")).getValue());
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return books;
	}
	
	
	public JSONArray getVersesMetaData(String field) {
		List<String> addressees = new ArrayList<String>();
		
		//aggregation for distinct hymn addressee values
		TermsAggregationBuilder agg = 
				AggregationBuilders.terms("metaAgg").field(field).size(1000);
		//compose request source
		SearchSourceBuilder searchSourceBuilder = 
				new SearchSourceBuilder().aggregation(agg);
		//create request
		SearchRequest req = new SearchRequest("vedaweb").types("doc").source(searchSourceBuilder);
		try {
			SearchResponse response = elastic.client().search(req);
			for (Bucket b : ((Terms)response.getAggregations().get("metaAgg")).getBuckets()) {
				addressees.add(b.getKeyAsString());
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		Collections.sort(addressees);
		return new JSONArray(addressees);
	}
	
	
	public boolean indexExists() {
		Response response = null;
		try {
			response = elastic.client().getLowLevelClient().performRequest("HEAD", "/" + indexName);
		} catch (IOException e) {
			System.err.println("[IndexService] Error: Could not check if index exists. Request failed.");
			e.printStackTrace();
		}
        return response != null && response.getStatusLine().getStatusCode() != 404;
	}
	

	public int countVerses(int book, int hymn) {
		MatchQueryBuilder matchBook = QueryBuilders.matchQuery("book", book);
		MatchQueryBuilder matchHymn = QueryBuilders.matchQuery("hymn", hymn);
		BoolQueryBuilder bool = QueryBuilders.boolQuery();
		bool.must(matchBook);
		bool.must(matchHymn);
		
		//aggregation for distinct hymn number values
		CardinalityAggregationBuilder agg = 
				AggregationBuilders.cardinality("verses").field("verse");
		//compose request source
		SearchSourceBuilder searchSourceBuilder = 
				new SearchSourceBuilder().query(bool).aggregation(agg);
		//create request
		SearchRequest req = new SearchRequest("vedaweb").types("doc").source(searchSourceBuilder);
		try {
			SearchResponse response = elastic.client().search(req);
			return (int)((Cardinality)response.getAggregations().get("verses")).getValue();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return 0;
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
		return response.query(jsonQuery);
	}
	
	
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
	
	
	private JSONArray concatForms(VerseVersion version, boolean removeAccents) {
		JSONArray forms = new JSONArray();
		for (String form : version.getForm()) {
			form = StringUtils.removeMetaChars(form);
			forms.put(
				removeAccents
					? StringUtils.removeVowelAccents(form)
					: form
			);
		}
		return forms;
	}
	
	
//	private String concatTokenLemmata(Verse doc) {
//		StringBuilder sb = new StringBuilder();
//		for (Token token : doc.getGrammarData()){
//			sb.append(token.getLemma().replaceAll("\u221a", ""));
//			sb.append(", ");
//		}
//		return sb.substring(0, sb.length() - 2).toString().trim();
//	}
	
	
	private List<JSONObject> buildVersionsList(Verse doc) {
		List<JSONObject> versions = new ArrayList<JSONObject>();
		for (VerseVersion v : doc.getVersions()) {
			JSONObject version = new JSONObject();
			StringBuilder form = new StringBuilder();
			for (String line : v.getForm()) {
				form.append(line + "\n");
			}
			version.put("id", v.getId());
			version.put("form", concatForms(v, true));
			version.put("form_raw", concatForms(v, false));
			version.put("source", v.getSource());
			versions.add(version);
		}
		return versions;
	}
	
}
