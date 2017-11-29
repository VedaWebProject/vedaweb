package de.unikoeln.vedaweb.search;
import java.util.HashMap;
import java.util.Map;

public class TargetToken {
	
	private Map<String, Object> attributes;
	
	public TargetToken(){
		attributes = new HashMap<String, Object>();
	}
	
	public void addAttribute(String field, Object value){
		attributes.put(field, value);
	}
	
	public Map<String, Object> getAttributes(){
		return attributes;
	}
	
	public void setAttributes(Map<String, Object> attributes){
		this.attributes = attributes;
	}
	
	public Object getAttribute(String field){
		return attributes.get(field);
	}
	
	public String[] getAttributeFields(){
		return attributes.keySet().toArray(new String[0]);
	}
	
	@Override
	public String toString() {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		
		for (String key : attributes.keySet()){
			sb.append(key + ":" + attributes.get(key) + "; ");
		}
		
		sb.delete(sb.length() - 2, sb.length());
		sb.append("]");
		return sb.toString();
	}
	
}
