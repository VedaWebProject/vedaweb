package de.unikoeln.vedaweb.services;

import java.io.IOException;
import java.util.Map;

import org.apache.lucene.document.Document;
import org.apache.lucene.document.IntPoint;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.BooleanClause;
import org.apache.lucene.search.BooleanQuery;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.Sort;
import org.apache.lucene.search.TopDocs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.unikoeln.vedaweb.data.VerseRepository;
import de.unikoeln.vedaweb.search.SearchRequest;
import de.unikoeln.vedaweb.search.SearchResult;
import de.unikoeln.vedaweb.search.SearchResults;


@Service
public class SearchService {
	
	private static final int MAX_SEARCH_HITS = 1000000;
	
	@Autowired
	private IndexService indexService;
	
	
	public SearchResults search(Map<String, String> params){
		return search(generateSearchRequest(params));
	}
	
	
	public SearchResults search(SearchRequest sr){
		sr.cleanAndFormatFields();
		SearchResults results = new SearchResults();
		
		for (Map<String, Object> block : sr.getBlocks()){
			try {
				search(block, results);
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		
		return results;
	}
	
	
	private void search(Map<String, Object> searchBlock, SearchResults results) throws ParseException{
		BooleanQuery.Builder query = new BooleanQuery.Builder();
		
		for (String field : searchBlock.keySet()){
			Object v = searchBlock.get(field);
			if (v instanceof String){
				query.add(new QueryParser(field, indexService.getAnalyzer()).parse((String)v),
						BooleanClause.Occur.MUST);
			} else if (v instanceof Integer){
				System.out.println("INT QUERY");
				IntPoint.newExactQuery(field, (Integer)v);
			}
		}
		
		TopDocs topDocs = null;
		
		try {
			topDocs = indexService.getSearcher().search(query.build(), MAX_SEARCH_HITS, Sort.RELEVANCE, true, false);
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		
        System.out.println("[INFO] Found " + topDocs.totalHits + " documents for '" + searchBlock + "'.");
        
        //contruct search results
        SearchResults newResults = new SearchResults();
        for (ScoreDoc sd : topDocs.scoreDocs){
        	try {
        		Document doc = indexService.getSearcher().doc(sd.doc);
        		newResults.add(new SearchResult(
        						sd.score,
        						doc.get("location_id"),
        						searchBlock,
        						doc));
			} catch (IOException e) {
				e.printStackTrace();
			}
        }
        
        results.retainCommon(newResults);
	}
	
	
	private SearchRequest generateSearchRequest(Map<String, String> params) {
		
		SearchRequest sr = new SearchRequest();
		
		for (String key : params.keySet()){
			
			if (params.get(key).length() == 0){
				continue;
			} else if (params.get(key).equals("book")){
				sr.setScopeBook(Integer.parseInt(params.get(key))); //TODO check if only digits
			} else if (params.get(key).equals("hymn")){
				sr.setScopeHymn(Integer.parseInt(params.get(key))); //TODO check if only digits
			} else {
				
			}
			
		}
		
		return sr;
	}


}
