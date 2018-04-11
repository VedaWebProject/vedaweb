package de.unikoeln.vedaweb.services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;

import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.common.xcontent.XContentType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.unikoeln.vedaweb.data.Pada;
import de.unikoeln.vedaweb.data.Token;
import de.unikoeln.vedaweb.data.Verse;
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
		Iterator<Verse> dbIter = verseRepo.findAll().iterator();
		// create es bulk request
		BulkRequest bulkRequest = new BulkRequest();

		// process docs
		while (dbIter.hasNext()) {
			Verse dbDoc = dbIter.next();
			JSONObject indexDoc = new JSONObject();

			System.out.println("[INFO] processing: " + dbDoc.getIndex());

			indexDoc.put("location", dbDoc.getIndex());
			indexDoc.put("book_nr", dbDoc.getBook());
			indexDoc.put("hymn_nr", dbDoc.getHymn());
			indexDoc.put("verse_nr", dbDoc.getVerse());
			//indexDoc.put("translation_de", dbDoc.getTranslation());
			indexDoc.put("form", concatPadaForms(dbDoc));
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
	

	private List<JSONObject> buildTokensList(Verse doc) {
		List<Pada> padas = doc.getPadas();
		List<JSONObject> tokens = new ArrayList<JSONObject>();
		int count = 0;

		for (Pada pada : padas) {
			for (Token token : pada.getTokens()) {
				JSONObject indexToken = new JSONObject();
				indexToken.put("index", token.getIndex());
				indexToken.put("lemma", token.getLemma());
				//grammar
				for (String attr : token.getGrammarAttributes().keySet()) {
					indexToken.put(attr, token.getGrammarAttribute(attr));
				}
				tokens.add(indexToken);
				count++;
			}
		}

		return tokens;
	}
	

	private String concatPadaForms(Verse doc) {
		List<Pada> padas = doc.getPadas();
		StringBuilder sb = new StringBuilder();
		for (Pada pada : padas) {
			sb.append(pada.getForm());
			sb.append(" ");
		}
		return sb.toString().trim();
	}
	
	
}
