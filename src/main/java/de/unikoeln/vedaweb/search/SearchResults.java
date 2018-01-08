package de.unikoeln.vedaweb.search;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


public class SearchResults {
	
	private Set<SearchResult> results;
	
	public SearchResults(){
		results = new HashSet<SearchResult>();
	}
	
	public void add(SearchResult result){
		results.add(result);
	}
	
	public Set<SearchResult> getResults(){
		return results;
	}
	
	public List<SearchResult> getSortedResultsList(){
		List<SearchResult> resultsList = new ArrayList<SearchResult>(results);
		Collections.sort(resultsList);
		return resultsList;
	}
	
	public boolean containsLocationId(String locationId){
		return results.contains(new SearchResult(0, locationId, null, null));
	}
	
	public boolean isEmpty(){
		return results.isEmpty();
	}
	
	public void retainCommon(SearchResults otherSearchResults){
		if (results.isEmpty()){
			results = otherSearchResults.getResults();
		} else {
			Set<SearchResult> other = otherSearchResults.getResults();
			System.out.println("[DEBUG] Joining:\tnew(" + other.size() + ")\told(" + results.size() + ") ...");
			other.retainAll(results);
			results.retainAll(other);
			System.out.println("[DEBUG] Retained:\tnew(" + other.size() + ")\told(" + results.size() + ") ...");
			results.addAll(other);
			System.out.println("[DEBUG] Joined:\t\tnew(" + other.size() + ")\told(" + results.size() + ") ...");
		}
	}
	
	public int size(){
		return results.size();
	}
	
	@Override
	public String toString() {
		StringBuffer sb = new StringBuffer();
		for (SearchResult r : results) sb.append(r + "\n");
		return sb.toString();
	}

}
