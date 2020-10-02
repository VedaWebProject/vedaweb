package de.unikoeln.vedaweb.search.grammar;

import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.index.query.MatchAllQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.nested.NestedAggregationBuilder;
import org.elasticsearch.search.aggregations.bucket.terms.TermsAggregationBuilder;
import org.elasticsearch.search.builder.SearchSourceBuilder;

import de.unikoeln.vedaweb.search.CommonSearchRequest;

/**
 * Utility class that build a grammar aggregations request
 * 
 * @author bkis
 *
 */
public class GrammarAggregationsRequestBuilder {
	
	public static SearchRequest buildGrammarAggregationsRequest(String grammarField, String indexName){
		
		SearchRequest req = CommonSearchRequest.getSearchRequest(indexName);
		SearchSourceBuilder source = new SearchSourceBuilder(); 
		
		//match all
		MatchAllQueryBuilder match = QueryBuilders.matchAllQuery();
		
		//aggregation request
		TermsAggregationBuilder terms
			= AggregationBuilders.terms("agg")
				.field("tokens." + grammarField)
				.size(100);
		NestedAggregationBuilder nestedAgg
			= AggregationBuilders.nested("tokens", "tokens")
				.subAggregation(terms);
		
		source.query(match);
		source.aggregation(nestedAgg);
		source.size(0);
		//System.out.println("\n\n" + searchSourceBuilder.toString() + "\n\n");
		req.source(source);
		return req;
	}

}
