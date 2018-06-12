package de.unikoeln.vedaweb.services;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.text.Normalizer;
import java.text.Normalizer.Form;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.elasticsearch.action.admin.indices.create.CreateIndexRequest;
import org.elasticsearch.action.admin.indices.create.CreateIndexResponse;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexResponse;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.common.xcontent.XContentType;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import de.unikoeln.vedaweb.data.Pada;
import de.unikoeln.vedaweb.data.Token;
import de.unikoeln.vedaweb.data.Translation;
import de.unikoeln.vedaweb.data.Verse;
import de.unikoeln.vedaweb.data.VerseRepository;
import de.unikoeln.vedaweb.util.IOUtils;


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
			response.put("deleteOldIndex", deleteIndex().getString("response"));
			//create new Index
			System.out.println("[INFO] creating new index...");
			response.put("createNewIndex", createIndex().getString("response"));
			// get all documents from db
			System.out.println("[INFO] creating and inserting new index documents...");
			response.put("indexDbDocuments", indexDbDocuments().getString("response"));
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
				indexDoc.put("translation", concatTranslations(dbDoc));
				indexDoc.put("form", removeUnicodeAccents(normalize(concatPadaForms(dbDoc) + concatTokenLemmata(dbDoc))));
				indexDoc.put("form_raw", normalize(concatPadaForms(dbDoc)));
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
					? "{response:'OK'}"
					: "{response:'Error'}");
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
				indexToken.put("form", removeUnicodeAccents(normalize(token.getForm())));
				indexToken.put("lemma", removeUnicodeAccents(normalize(token.getLemma())));
				//grammar
				for (String attr : token.getGrammarAttributes().keySet()) {
					indexToken.put(attr, token.getGrammarAttribute(attr));
				}
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
					? "{response:'OK'}"
					: "{response:'Error'}");
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
					? "{response:'OK'}"
					: "{response:'Error'}");
		} catch (JSONException e) {
			e.printStackTrace();
		}

		return jsonResponse;
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
		for (Translation t : doc.getTranslations()) {
			sb.append(t.getTranslation());
			sb.append(" ");
		}
		return sb.toString().trim();
	}
	
	
	private String normalize(String text) {
	    return text == null ? "" :
	        Normalizer.normalize(text, Form.NFD);
	}
	
	
	private String removeUnicodeAccents(String text) {
	    return text == null ? "" :
	        text.replaceAll("\\u0301", "");
	}
	
}
