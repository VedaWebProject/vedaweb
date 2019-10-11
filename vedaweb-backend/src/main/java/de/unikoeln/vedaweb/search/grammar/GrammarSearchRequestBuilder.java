package de.unikoeln.vedaweb.search.grammar;

import java.util.Map;

import org.apache.lucene.search.join.ScoreMode;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.InnerHitBuilder;
import org.elasticsearch.index.query.NestedQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import de.unikoeln.vedaweb.search.CommonSearchRequest;
import de.unikoeln.vedaweb.util.StringUtils;

public class GrammarSearchRequestBuilder {

	
	public static SearchRequest buildSearchRequest(GrammarSearchData searchData) {
		//root bool query
		BoolQueryBuilder bool = QueryBuilders.boolQuery();
		
		//add search block queries
		addGrammarBlockQueries(bool, searchData);
		
		//add search scope filters
		if (searchData.getScopes().size() > 0)
			bool.filter(CommonSearchRequest.getSearchScopesQuery(searchData));
		
		//add search meta filters
		if (searchData.getMeta().size() > 0)
			bool.filter(CommonSearchRequest.getSearchMetaQuery(searchData));
		
		return CommonSearchRequest.getSearchRequest(searchData.getIndexName()).source(
				CommonSearchRequest.getSearchSourceBuilder(searchData)
				.query(bool)
				.fetchSource(CommonSearchRequest.getFetchSourceContext())
		);
	}
	
	
	public static SearchRequest buildGrammarOccurrencesRequest(GrammarSearchData searchData) {
		SearchRequest req = buildSearchRequest(searchData);
		req.source(req.source().size(19999).from(0)); //get ALL results always from 0
		return req;
	}
	
	
	private static void addGrammarBlockQueries(BoolQueryBuilder rootQuery, GrammarSearchData searchData){
		//iterate search blocks
		for (Map<String, Object> block : searchData.getBlocks()){
			//construct bool query for each block
			BoolQueryBuilder bool = QueryBuilders.boolQuery();
			
			//remove empty fields (already happens client-side)
			//block.values().stream().filter(v -> v != null && v.toString().length() > 0);
			
			//trim values
			block.values().forEach(v -> v = v.toString().trim());
			
			//add queries for block data
			for (String key : block.keySet()){
				
				//unimplemented
				if (key.equalsIgnoreCase("distance"))
					continue; //TEMP DEV
				
				//can be ignored, here
				if (key.equalsIgnoreCase("required"))
					continue; //TEMP DEV
				
				//if fields="term", also search in "lemma"-field
				if (key.equals("term") || key.equals("lemma")) {
					
					//set query string
					String termOrLemma = StringUtils.normalizeNFC((String) block.get(key));
					//if no search term: skip
					if (termOrLemma.length() == 0) continue;
					//set target field
					String field = "tokens." + (key.equals("lemma") ? "lemma" : "form");
					
					//set accent sensitive search
					if (searchData.isAccents())
						field += "_raw";
					else
						termOrLemma = StringUtils.removeVowelAccents(termOrLemma);
					
					//add this query to bool query
					bool.must(QueryBuilders.queryStringQuery(termOrLemma).field(field));
				} else {
					//...otherwise, add a simple term query
					bool.must(QueryBuilders.termQuery("tokens.grammar." + key, block.get(key)));
				}
			}
			
			//wrap block query in nested query
			NestedQueryBuilder blockQuery = QueryBuilders.nestedQuery("tokens", bool, ScoreMode.Total)
				.innerHit(
					new InnerHitBuilder()
						.setName("tokens." + block.hashCode())
						.setSize(10)
					);
			
			//add to root query
			if ((boolean)block.get("required")) {
				rootQuery.must(blockQuery);
			} else {
				rootQuery.should(blockQuery);
			}
			
		}
	}
	

}
