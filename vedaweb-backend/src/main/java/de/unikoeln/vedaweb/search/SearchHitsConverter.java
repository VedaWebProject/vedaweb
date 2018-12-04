package de.unikoeln.vedaweb.search;

import java.util.Arrays;
import java.util.Map;

import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.common.text.Text;

public class SearchHitsConverter {
	
	/*
	 * Process Elasticsearch SearchResponse to prepare SearchHits
	 * object to display in frontend...
	 */
	public static SearchHits processSearchResponse(SearchResponse response) {
		SearchHits targetHits = new SearchHits();
		
		targetHits.setTotal(response.getHits().getTotalHits());
		targetHits.setTook(response.getTook().getMillis());
		
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
			} else {
				for (String innerHitKey : innerHits.keySet()) {
					//// iterate inner hits
					if (innerHitKey.startsWith("versions")) {
						// versions
						org.elasticsearch.search.SearchHits hits = innerHits.get(innerHitKey);
						for (org.elasticsearch.search.SearchHit innerHit : hits) {
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
					} else if (innerHitKey.startsWith("tokens")) {
						// tokens
						org.elasticsearch.search.SearchHits hits = innerHits.get(innerHitKey);
						for (org.elasticsearch.search.SearchHit innerHit : hits) {
							try {
								hit.addHighlight(
									innerHit.getSourceAsMap().get("form_raw").toString(),
									buildGrammarHighlightString(innerHit.getSourceAsMap())
								);
							} catch (Exception e) {
								continue;
							}
						}
					}
				}
			}
			
//			else if (innerHits.containsKey("versions")) {
//				//with inner hits
//				for (org.elasticsearch.search.SearchHit innerHit : innerHits.get("versions").getHits()) {
//					try {
//						for (String hKey : innerHit.getHighlightFields().keySet()) {
//							hit.addHighlight(
//								innerHit.getSourceAsMap().get("source").toString(),
//								concatText(innerHit.getHighlightFields().get(hKey).fragments())
//							);
//						}
//					} catch (Exception e) {
//						continue;
//					}
//				}
//			} else if (innerHits.containsKey("tokens")) {
//				//with inner hits
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
//			}
			
			targetHits.addHit(hit);
		});
		return targetHits;
	}
	
	
	private static String concatText(Text[] texts) {
		StringBuilder sb = new StringBuilder();
		Arrays.stream(texts).forEach(t -> sb.append(t + " / "));
		return sb.substring(0, sb.length() - 3);
	}
	
	
	@SuppressWarnings("unchecked")
	private static String buildGrammarHighlightString(Map<String, Object> grammarHitSource) {
		StringBuilder sb = new StringBuilder();
		sb.append(grammarHitSource.get("lemma_raw"));
		
		((Map<String, Object>)grammarHitSource.get("grammar")).forEach((k,v) -> {
			if (!k.equals("lemma type")
					&& !k.equals("position")) {
				sb.append("." + v);
			}
		});
		
		return sb.toString();
	}

}
