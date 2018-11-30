package de.unikoeln.vedaweb.search;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.common.text.Text;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SearchHits {
	
	private List<SearchHit> hits;
	private long total;
	private long took;
	
	public SearchHits() {
		this.hits = new ArrayList<SearchHit>();
	}
	
	public SearchHits(SearchResponse response) {
		processSearchResponse(response);
	}
	
	@JsonProperty("total")
	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}

	@JsonProperty("took")
	public long getTook() {
		return took;
	}

	public void setTook(long took) {
		this.took = took;
	}

	@JsonProperty("hits")
	public List<SearchHit> hits(){
		return this.hits;
	}
	
	/*
	 * Process Elasticsearch SearchResponse to prepare SearchHits
	 * object to display in frontend...
	 */
	private void processSearchResponse(SearchResponse response) {
		
		System.out.println(response);
		
		this.hits = new ArrayList<SearchHit>();
		setTotal(response.getHits().getTotalHits());
		setTook(response.getTook().getMillis());
		
		//TODO process hits
		response.getHits().forEach(esHit -> {
			SearchHit hit = new SearchHit();
			Map<String, Object> source = esHit.getSourceAsMap();
			
			hit.setScore(esHit.getScore());
			hit.setHymnAddressee(source.get("hymnAddressee").toString());
			hit.setHymnGroup(source.get("hymnGroup").toString());
			hit.setVerseStrata(source.get("strata").toString());
			hit.setSource(source);
			
			hit.setDocId(
				(int)source.get("book"),
				(int)source.get("hymn"),
				(int)source.get("verse")
			);
			
			//highlighting
			Map<String, org.elasticsearch.search.SearchHits> innerHits = esHit.getInnerHits();
			if (innerHits == null) {
				//without inner hits
				for (String field : esHit.getHighlightFields().keySet()) {
					hit.addHighlight(
						esHit.getHighlightFields().get(field).name(),
						concatText(esHit.getHighlightFields().get(field).fragments())
					);
				}
			} else if (innerHits.containsKey("versions")) {
				//with inner hits
				for (org.elasticsearch.search.SearchHit innerHit : innerHits.get("versions").getHits()) {
					try {
						for (String hKey : innerHit.getHighlightFields().keySet()) {
							hit.addHighlight(
								innerHit.getSourceAsMap().get("source").toString(),
								concatText(innerHit.getHighlightFields().get(hKey).fragments())
							);
						}
					} catch (Exception e) {
						continue;
					}
				}
			} else if (innerHits.containsKey("tokens")) {
				//with inner hits
//				int hitCount = 1;
//				for (org.elasticsearch.search.SearchHit innerHit : innerHits.get("tokens").getHits()) {
//					try {
//						StringBuilder sb = new StringBuilder();
//						for (String hKey : innerHit.getHighlightFields().keySet()) {
//							sb.append(concatText(innerHit.getHighlightFields().get(hKey).fragments()));
//							sb.append(".");
//						}
//						hit.addHighlight("Grammar entity #" + hitCount++, sb.substring(0, sb.length()-1));
//					} catch (Exception e) {
//						continue;
//					}
//				}
			}
			
			this.hits.add(hit);
		});
	}
	
	private String concatText(Text[] texts) {
		StringBuilder sb = new StringBuilder();
		Arrays.stream(texts).forEach(t -> sb.append(t + " / "));
		return sb.substring(0, sb.length() - 3);
	}

}
