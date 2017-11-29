package de.unikoeln.vedaweb.search;
import java.util.HashSet;
import java.util.Set;


public class SearchResults {
	
	private Set<SearchResult> results;
	
	public SearchResults(){
		results = new HashSet<SearchResult>();
	}
	
	public void add(SearchResult result){
		results.add(result);
	}
	
	public Set<SearchResult> getResultsList(){
		//Collections.sort(results);
		return results;
	}
	
	public boolean containsLocationId(String locationId){
		return results.contains(new SearchResult(0, locationId, null, null));
	}
	
	public boolean isEmpty(){
		return results.isEmpty();
	}
	
	public void retainCommon(SearchResults otherSearchResults){
		if (results.isEmpty()){
			results = otherSearchResults.getResultsList();
		} else {
			Set<SearchResult> other = otherSearchResults.getResultsList();
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

}
