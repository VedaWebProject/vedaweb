package de.unikoeln.vedaweb.search;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.http.HttpEntity;
import org.apache.http.util.EntityUtils;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.support.master.AcknowledgedResponse;
import org.elasticsearch.client.Request;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.indices.CreateIndexRequest;
import org.elasticsearch.client.indices.CreateIndexResponse;
import org.elasticsearch.client.indices.GetIndexRequest;
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
import org.elasticsearch.search.aggregations.metrics.Cardinality;
import org.elasticsearch.search.aggregations.metrics.CardinalityAggregationBuilder;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import de.unikoeln.vedaweb.analysis.meter.MetricalAnalysis;
import de.unikoeln.vedaweb.document.Pada;
import de.unikoeln.vedaweb.document.Stanza;
import de.unikoeln.vedaweb.document.StanzaRepository;
import de.unikoeln.vedaweb.document.StanzaVersion;
import de.unikoeln.vedaweb.document.Token;
import de.unikoeln.vedaweb.util.IOUtils;
import de.unikoeln.vedaweb.util.JsonUtilService;
import de.unikoeln.vedaweb.util.StringUtils;

/**
 * Service for managing the search index
 * 
 * @author bkis
 *
 */
@Service
public class IndexService {
	
	private final Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	private StanzaRepository stanzaRepo;
	
	@Autowired
	private ElasticService elastic;
	
	@Autowired
	private JsonUtilService json;
	
	@Value("${es.index.name}")
	private String indexName;
	
	@Value("classpath:es-index.json")
	private Resource indexDef;

	
	public ObjectNode rebuildIndex(){
		ObjectNode response = json.newObjectNode();
		//delete old index
		response.put("deleteIndex", deleteIndex().findValue("response").asText());
		//create new Index
		response.put("createIndex", createIndex().findValue("response").asText());
		// get all documents from db
		response.put("fillIndex", indexDbDocuments().findValue("response").asText());
		return response;
	}
	
	
	public ObjectNode indexDbDocuments(){
		log.info("Creating and inserting new index documents");
		ObjectNode jsonResponse = json.newObjectNode();
		Iterator<Stanza> dbIter = stanzaRepo.findAll().iterator();
		// create es bulk request
		BulkRequest bulkRequest = new BulkRequest();

		// process docs
		while (dbIter.hasNext()) {
			Stanza dbDoc = dbIter.next();
			ObjectNode indexDoc = json.newObjectNode();

			indexDoc.put("id", dbDoc.getId());
			indexDoc.put("index", dbDoc.getIndex());
			indexDoc.put("book", dbDoc.getBook());
			indexDoc.put("hymn", dbDoc.getHymn());
			indexDoc.put("stanza", dbDoc.getStanza());
			indexDoc.put("hymnAddressee", dbDoc.getHymnAddressee());
			indexDoc.put("hymnGroup", dbDoc.getHymnGroup());
			indexDoc.put("hymnAbs", dbDoc.getHymnAbs());
			indexDoc.put("strata", dbDoc.getStrata());
			indexDoc.put("stanzaType", dbDoc.getStanzaType());
			indexDoc.set("lateAdditions", json.getMapper().valueToTree(dbDoc.getLateAdditions()));
			indexDoc.set("versions", json.getMapper().valueToTree(buildVersionsList(dbDoc)));
//				indexDoc.put("lemmata", StringUtils.removeVowelAccents(concatTokenLemmata(dbDoc)));
//				indexDoc.put("lemmata_raw", StringUtils.normalizeNFC(concatTokenLemmata(dbDoc)));
			indexDoc.set("tokens", json.getMapper().valueToTree(buildTokensList(dbDoc)));
			
			// add metrical positions annotations
			ArrayNode mPosArray = json.newArrayNode();
			String[] metricalAnnotations = generateMetricalAnnotations(dbDoc);
			for (String ma : metricalAnnotations) {
				ObjectNode node = json.newObjectNode();
				node.put("form", StringUtils.removeVowelAccents(ma)); // remove accents
				node.put("form_raw", ma); // keep accents
				mPosArray.add(node);
			}
			indexDoc.set("metricalPositions", mPosArray);
			
			// create index request
			IndexRequest request = new IndexRequest("vedaweb");

			// add request source
			request.source(indexDoc.toString(), XContentType.JSON);

			// add to bulk request
			bulkRequest.add(request);
		}

		// send bulk request
		BulkResponse bulkResponse = null;
		try {
			bulkResponse = elastic.client().bulk(bulkRequest, RequestOptions.DEFAULT);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		//create response object
		jsonResponse.put("response",
				bulkResponse != null && !bulkResponse.hasFailures()
				? "OK"
				: "error");

		return jsonResponse;
	}
	

	private List<ObjectNode> buildTokensList(Stanza doc) {
		List<ObjectNode> tokens = new ArrayList<ObjectNode>();

		for (Pada pada : doc.getPadas()) {
			for (Token token : pada.getGrammarData()) {
				ObjectNode indexToken = json.newObjectNode();
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
				ObjectNode indexTokenGrammar = json.newObjectNode();
				for (String attr : token.getProps().keySet()) {
					String values = token.getProp(attr);
					if (values.split("\\/").length > 1) {
						ArrayNode tagValues = json.newArrayNode();
						for (String tv : values.split("\\/")) {
							tagValues.add(tv);
						}
						indexTokenGrammar.set(attr, tagValues);
					} else {
						indexTokenGrammar.put(attr, token.getProp(attr));
					}
				}
				indexToken.set("grammar", indexTokenGrammar);
				tokens.add(indexToken);
			}
		}

		return tokens;
	}
	

	public ObjectNode deleteIndex(){
		log.info("Deleting old index");
		ObjectNode jsonResponse = json.newObjectNode();
		DeleteIndexRequest deleteRequest = new DeleteIndexRequest(indexName);
		AcknowledgedResponse deleteResponse = null;
		try {
			deleteResponse = elastic.client().indices().delete(deleteRequest, RequestOptions.DEFAULT);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		//create response object
		jsonResponse.put("response",
				deleteResponse != null && deleteResponse.isAcknowledged()
				? "OK"
				: "error");

		return jsonResponse;
	}
	
	
	public ObjectNode createIndex(){
		log.info("Creating new index from mapping definition");
		ObjectNode jsonResponse = json.newObjectNode();
		CreateIndexRequest createRequest = new CreateIndexRequest(indexName);
		byte[] json = null;
		
		try {
			json = IOUtils.convertStreamToByteArray(indexDef.getInputStream());
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		
		createRequest.source(new String(json, StandardCharsets.UTF_8), XContentType.JSON);
		CreateIndexResponse createResponse = null;
		
		try {
			createResponse = elastic.client().indices().create(createRequest, RequestOptions.DEFAULT);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		//create response object
		jsonResponse.put("response",
				createResponse != null && createResponse.isAcknowledged()
				? "OK"
				: "error");

		return jsonResponse;
	}
	
	
	public ArrayNode getUIGrammarData() {
		List<String> grammarFields = new ArrayList<>();
		
		ObjectNode response = urlRequest(
				"get",
				"vedaweb/_mapping/field/tokens.grammar.*",
				"/vedaweb/mappings");
		
		if (response == null) {
			log.error("Couldn't find index grammar mapping");
			return json.newArrayNode();
		}
		
		Iterator<String> iter = response.fieldNames();
		while (iter.hasNext()) {
			grammarFields.add(iter.next().replaceAll("^(\\w+\\.)+", ""));
		}
		
		Collections.sort(grammarFields);
		return convertGrammarAggregationsToJSON(collectGrammarFieldAggregations(grammarFields));
	}
	
	
	public ArrayNode getUIBooksData() {
		ArrayNode books = json.newArrayNode();
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
			SearchRequest req = new SearchRequest("vedaweb").source(searchSourceBuilder);
			try {
				SearchResponse response = elastic.client().search(req, RequestOptions.DEFAULT);
				books.add(((Cardinality)response.getAggregations().get("hymns")).getValue());
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return books;
	}
	
	
	public int[] getHymnAbsValues() {
		//TODO
		return new int[]{1,2,3,4,5,6,7,8};
	}
	
	
	public ArrayNode getStanzasMetaData(String field) {
		List<String> values = new ArrayList<String>();
		
		//aggregation for distinct hymn addressee values
		TermsAggregationBuilder agg = 
				AggregationBuilders.terms("metaAgg").field(field).size(1000);
		//compose request source
		SearchSourceBuilder searchSourceBuilder = 
				new SearchSourceBuilder().aggregation(agg);
		//create request
		SearchRequest req = new SearchRequest("vedaweb").source(searchSourceBuilder);
		try {
			SearchResponse response = elastic.client().search(req, RequestOptions.DEFAULT);
			for (Bucket b : ((Terms)response.getAggregations().get("metaAgg")).getBuckets()) {
				values.add(b.getKeyAsString());
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		Collections.sort(values);
		return json.getMapper().valueToTree(values);
	}
	
	
	public boolean indexExists() {
		log.info("Looking for Elasticsearch index");
		GetIndexRequest request = new GetIndexRequest(indexName);
		boolean exists = false;
		int tries = 10;
		
		while (tries > 0) {
			try {
				exists = elastic
					.client()
					.indices()
					.exists(request, RequestOptions.DEFAULT);
				tries = 1;
			} catch (IOException e) {
				log.warn("Try " + (10 - tries) + "/10: Could not check if index exists."
						+ " Request failed.");
			}
			try {
				Thread.sleep(3000);
			} catch (InterruptedException e) {}
			tries--;
		}
		
        return exists;
	}
	

	public int countStanzas(int book, int hymn) {
		MatchQueryBuilder matchBook = QueryBuilders.matchQuery("book", book);
		MatchQueryBuilder matchHymn = QueryBuilders.matchQuery("hymn", hymn);
		BoolQueryBuilder bool = QueryBuilders.boolQuery();
		bool.must(matchBook);
		bool.must(matchHymn);
		
		//compose request source
		SearchSourceBuilder searchSourceBuilder = 
				new SearchSourceBuilder().query(bool).size(0);
		//create request
		SearchRequest req = new SearchRequest("vedaweb").source(searchSourceBuilder);
		try {
			SearchResponse response = elastic.client().search(req, RequestOptions.DEFAULT);
			return (int) response.getHits().getTotalHits().value;
		} catch (IOException e) {
			e.printStackTrace();
		}
		return 0;
	}
	
	
	private ObjectNode urlRequest(String method, String url) {
		ObjectNode response = null;
		try {
			HttpEntity http =
					elastic.client()
					.getLowLevelClient()
					.performRequest(new Request(method, url))
					.getEntity();
			response = json.parse(EntityUtils.toString(http));
		} catch (IOException e) {
			e.printStackTrace();
		}
		return response;
	}
	
	
	private ObjectNode urlRequest(String method, String url, String jsonQuery) {
		ObjectNode response = urlRequest(method, url);
		if (response == null) return null;
		JsonNode responseData = response.at(jsonQuery);
		return (responseData instanceof ObjectNode)
				? (ObjectNode)responseData
				: response.objectNode();
	}
	
	
	private long distinct(String field) {
		long count = 0;
		CardinalityAggregationBuilder agg = AggregationBuilders.cardinality("agg");
		agg.field(field);
		SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder().aggregation(agg);
		SearchRequest req = new SearchRequest("vedaweb").source(searchSourceBuilder);
		try {
			SearchResponse response = elastic.client().search(req, RequestOptions.DEFAULT);
			count = ((Cardinality)response.getAggregations().get("agg")).getValue();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return count;
	}
	
	
	private Map<String, List<String>> collectGrammarFieldAggregations(List<String> grammarFields) {
		Map<String, List<String>> grammarAggregations = new HashMap<>();
		
		SearchRequest req = new SearchRequest("vedaweb"); 
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
			SearchResponse response = elastic.client().search(req, RequestOptions.DEFAULT);
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
	
	
	private ArrayNode convertGrammarAggregationsToJSON(Map<String, List<String>> aggs) {
		ArrayNode tagsArray = json.newArrayNode();
		
		for (String grammarField : aggs.keySet()) {
			ObjectNode tagData = json.newObjectNode();
			tagData.put("field", grammarField);
			tagData.put("ui", grammarField.toLowerCase());
			tagData.set("values", json.getMapper().valueToTree(aggs.get(grammarField)));
			tagsArray.add(tagData);
		}
		
		return tagsArray;
	}
	
	
	private ArrayNode transformVersionLines(String[] lines, boolean removeAccents) {
		ArrayNode linesNode = json.newArrayNode();
		for (String line : lines) {
			linesNode.add(
				removeAccents
					? StringUtils.removeVowelAccents(line)
					: line
			);
		}
		return linesNode;
	}
	
	//// THIS MAY BE SUPERIOR TO "transformVersionLines"
	private String concatVersionLines(String[] lines, boolean removeAccents) {
		StringBuilder sb = new StringBuilder();
		for (String line : lines) {
			sb.append(
				removeAccents
					? StringUtils.removeVowelAccents(line.trim())
					: line.trim()
			);
			sb.append(" ");
		}
		return sb.substring(0, sb.length() - 1);
	}
	
	
//	private String concatTokenLemmata(Stanza doc) {
//		StringBuilder sb = new StringBuilder();
//		for (Token token : doc.getGrammarData()){
//			sb.append(token.getLemma().replaceAll("\u221a", ""));
//			sb.append(", ");
//		}
//		return sb.substring(0, sb.length() - 2).toString().trim();
//	}
	
	
	private List<ObjectNode> buildVersionsList(Stanza doc) {
		List<ObjectNode> versions = new ArrayList<ObjectNode>();
		for (StanzaVersion v : doc.getVersions()) {
			ObjectNode version = json.newObjectNode();
//			StringBuilder form = new StringBuilder();
//			for (String line : v.getForm()) form.append(line + "\n");
			version.put("id", v.getId());
			//form without accents
			version.put("form", concatVersionLines(v.getForm(), true)); 
			//raw form (with accents)
			version.put("form_raw", concatVersionLines(v.getForm(), false)); 
			//metrical data (for versions that have it)
			if (v.getMetricalData() != null)
				version.set("metrical", transformVersionLines(v.getMetricalData(), false)); 
			//source (author)
			version.put("source", v.getSource()); 
			versions.add(version);
		}
		return versions;
	}
	
	
	private String[] generateMetricalAnnotations(Stanza doc) {
		int indexVNH = doc.getVersions().indexOf(
				StanzaVersion.getDummy("version_vannootenholland"));
		if (indexVNH == -1) return new String[0];
		String[] form = doc.getVersions().get(indexVNH).getForm();
		
		// remove "_" from all elements and return string array
		return Arrays.stream(MetricalAnalysis.annotateMultiline(form))
			.map(a -> a.replaceAll("(?<=\\b\\d+)\\_", "")).toArray(String[]::new);
	}
	
}
