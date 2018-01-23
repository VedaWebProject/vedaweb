package de.unikoeln.vedaweb.services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.common.xcontent.XContentType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.unikoeln.vedaweb.data.Part;
import de.unikoeln.vedaweb.data.VerseDocument;
import de.unikoeln.vedaweb.data.VerseRepository;
import net.minidev.json.JSONObject;

@Service
public class ElasticIndexService {
	
	@Autowired
	private VerseRepository verseRepo;
	
	@Autowired
	private ElasticService elastic;

	
	public void indexDbDocuments() {
		// get all documents from db
		Iterator<VerseDocument> dbIter = verseRepo.findAll().iterator();
		// create es bulk request
		BulkRequest bulkRequest = new BulkRequest();

		// process docs
		while (dbIter.hasNext()) {
			VerseDocument dbDoc = dbIter.next();
			JSONObject indexDoc = new JSONObject();

			System.out.println("[INFO] processing: " + dbDoc.getIndex());

			indexDoc.put("location", dbDoc.getIndex());
			indexDoc.put("book_nr", dbDoc.getBook());
			indexDoc.put("hymn_nr", dbDoc.getHymn());
			indexDoc.put("verse_nr", dbDoc.getVerse());
			indexDoc.put("translation_de", dbDoc.getTranslation());
			indexDoc.put("form", concatPartForms(dbDoc));
			indexDoc.put("tokens", buildTokensList(dbDoc));

			// create index request
			IndexRequest request = new IndexRequest("vedaweb", "doc", dbDoc.getId());

			// add request source
			request.source(indexDoc.toJSONString(), XContentType.JSON);

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

		System.out.println(bulkResponse.hasFailures() ? "ERRORS IN BULK RESPONSE!" : "NO ERRORS");
	}
	

	private List<JSONObject> buildTokensList(VerseDocument doc) {
		List<Part> parts = doc.getParts();
		List<JSONObject> tokens = new ArrayList<JSONObject>();
		int count = 0;

		for (Part part : parts) {
			for (Map<String, Object> token : part.getTokens()) {
				JSONObject indexToken = new JSONObject();

				for (Entry<String, Object> e : token.entrySet()) {
					indexToken.put(e.getKey(), e.getKey().equals("index") ? count : e.getValue());
				}
				tokens.add(indexToken);
				count++;
			}
		}

		return tokens;
	}
	

	private String concatPartForms(VerseDocument doc) {
		List<Part> parts = doc.getParts();
		StringBuilder sb = new StringBuilder();
		for (Part part : parts) {
			sb.append(part.getForm());
			sb.append(" ");
		}
		return sb.toString().trim().replaceAll("|", "");
	}
	
	
}
