package de.unikoeln.vedaweb.search;

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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import de.unikoeln.vedaweb.document.Pada;
import de.unikoeln.vedaweb.document.Stanza;
import de.unikoeln.vedaweb.document.StanzaRepository;
import de.unikoeln.vedaweb.document.StanzaVersion;
import de.unikoeln.vedaweb.document.Token;
import de.unikoeln.vedaweb.util.IOUtils;
import de.unikoeln.vedaweb.util.JsonUtilService;
import de.unikoeln.vedaweb.util.StringUtils;


@Service
public class ElasticIndexService {
	
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
		ObjectNode response = json.newNode();
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
		ObjectNode jsonResponse = json.newNode();
		Iterator<Stanza> dbIter = stanzaRepo.findAll().iterator();
		// create es bulk request
		BulkRequest bulkRequest = new BulkRequest();

		// process docs
		while (dbIter.hasNext()) {
			Stanza dbDoc = dbIter.next();
			ObjectNode indexDoc = json.newNode();

			indexDoc.put("id", dbDoc.getId());
			indexDoc.put("index", dbDoc.getIndex());
			indexDoc.put("book", dbDoc.getBook());
			indexDoc.put("hymn", dbDoc.getHymn());
			indexDoc.put("stanza", dbDoc.getStanza());
			indexDoc.put("hymnAddressee", dbDoc.getHymnAddressee());
			indexDoc.put("hymnGroup", dbDoc.getHymnGroup());
			indexDoc.put("hymnAbs", dbDoc.getHymnAbs());
			indexDoc.put("strata", dbDoc.getStrata());
			indexDoc.set("versions", json.getMapper().valueToTree(buildVersionsList(dbDoc)));
//				indexDoc.put("lemmata", StringUtils.removeVowelAccents(concatTokenLemmata(dbDoc)));
//				indexDoc.put("lemmata_raw", StringUtils.normalizeNFC(concatTokenLemmata(dbDoc)));
			indexDoc.set("tokens", json.getMapper().valueToTree(buildTokensList(dbDoc)));
			
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
				ObjectNode indexToken = json.newNode();
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
				ObjectNode indexTokenGrammar = json.newNode();
				for (String attr : token.getProps().keySet()) {
					String values = token.getProp(attr);
					if (values.split("\\/").length > 1) {
						ArrayNode tagValues = json.newArray();
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
		ObjectNode jsonResponse = json.newNode();
		DeleteIndexRequest deleteRequest = new DeleteIndexRequest(indexName);
		DeleteIndexResponse deleteResponse = null;
		try {
			deleteResponse = elastic.client().indices().delete(deleteRequest);
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
		ObjectNode jsonResponse = json.newNode();
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
				"vedaweb/_mapping/doc/field/tokens.grammar.*",
				"/vedaweb/mappings/doc");
		
		if (response == null) {
			log.error("Couldn't find index grammar mapping");
			return json.newArray();
		}
		
		Iterator<String> iter = response.fieldNames();
		while (iter.hasNext()) {
			grammarFields.add(iter.next().replaceAll("^(\\w+\\.)+", ""));
		}
		
		Collections.sort(grammarFields);
		return convertGrammarAggregationsToJSON(collectGrammarFieldAggregations(grammarFields));
	}
	
	
	public ArrayNode getUIBooksData() {
		ArrayNode books = json.newArray();
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
		return json.getMapper().valueToTree(addressees);
	}
	
	
	public boolean indexExists() {
		Response response = null;
		try {
			response = elastic.client().getLowLevelClient().performRequest("HEAD", "/" + indexName);
		} catch (IOException e) {
			log.error("Could not check if index exists. Request failed.");
			e.printStackTrace();
		}
        return response != null && response.getStatusLine().getStatusCode() != 404;
	}
	

	public int countStanzas(int book, int hymn) {
		MatchQueryBuilder matchBook = QueryBuilders.matchQuery("book", book);
		MatchQueryBuilder matchHymn = QueryBuilders.matchQuery("hymn", hymn);
		BoolQueryBuilder bool = QueryBuilders.boolQuery();
		bool.must(matchBook);
		bool.must(matchHymn);
		
		//aggregation for distinct hymn number values
		CardinalityAggregationBuilder agg = 
				AggregationBuilders.cardinality("stanzas").field("stanza");
		//compose request source
		SearchSourceBuilder searchSourceBuilder = 
				new SearchSourceBuilder().query(bool).aggregation(agg);
		//create request
		SearchRequest req = new SearchRequest("vedaweb").types("doc").source(searchSourceBuilder);
		try {
			SearchResponse response = elastic.client().search(req);
			return (int)((Cardinality)response.getAggregations().get("stanzas")).getValue();
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
					.performRequest(method, url)
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
		return (ObjectNode) response.at(jsonQuery);
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
	
	
	private ArrayNode convertGrammarAggregationsToJSON(Map<String, List<String>> aggs) {
		ArrayNode tagsArray = json.newArray();
		
		for (String grammarField : aggs.keySet()) {
			ObjectNode tagData = json.newNode();
			tagData.put("field", grammarField);
			tagData.put("ui", grammarField.toLowerCase());
			tagData.set("values", json.getMapper().valueToTree(aggs.get(grammarField)));
			tagsArray.add(tagData);
		}
		
		return tagsArray;
	}
	
	
	private ArrayNode concatForms(StanzaVersion version, boolean removeAccents) {
		ArrayNode forms = json.newArray();
		for (String form : version.getForm()) {
			form = StringUtils.removeMetaChars(form);
			forms.add(
				removeAccents
					? StringUtils.removeVowelAccents(form)
					: form
			);
		}
		return forms;
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
			ObjectNode version = json.newNode();
			StringBuilder form = new StringBuilder();
			for (String line : v.getForm()) {
				form.append(line + "\n");
			}
			version.put("id", v.getId());
			version.set("form", concatForms(v, true));
			version.set("form_raw", concatForms(v, false));
			version.put("source", v.getSource());
			versions.add(version);
		}
		return versions;
	}
	
}
