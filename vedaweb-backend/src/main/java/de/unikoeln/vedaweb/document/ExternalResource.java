package de.unikoeln.vedaweb.document;

import java.util.ArrayList;
import java.util.List;

import io.swagger.annotations.ApiModelProperty;

/**
 * POJO describing an external resource relevant for a document
 * 
 * @author bkis
 *
 */
public class ExternalResource {
	
	@ApiModelProperty(notes = "Describing label for this set of references")
	private String label;
	
	@ApiModelProperty(notes = "Detailed description for this set of references")
	private String description;
	
	@ApiModelProperty(notes = "A list of one or more references")
	private List<String> references;
	
	public ExternalResource() {
		// empty default constructor needed for Spring obj initialization
	}

	public ExternalResource(String label, String firstReference) {
		super();
		this.label = label;
		this.references = new ArrayList<String>();
		addReference(firstReference);
	}
	
	public ExternalResource(String label) {
		this(label, null);
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}
	
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<String> getReferences() {
		return references;
	}
	
	public void addReference (String reference) {
		if (reference != null)
			this.references.add(reference);
	}

	public void setReferences(List<String> references) {
		this.references = references;
	}
	
}
