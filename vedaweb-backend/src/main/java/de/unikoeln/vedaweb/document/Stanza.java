package de.unikoeln.vedaweb.document;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="stanzas")
public class Stanza implements Comparable<Stanza> {
	
	@Id
	private String id;
	private int index;
	
	private int book;
	private int hymn;
	private int stanza;
	
	private int hymnAbs;
	
	private String hymnAddressee;
	private String hymnGroup;
	private String strata;
	
	private List<Pada> padas;
	private List<StanzaVersion> versions;
	
	
	public Stanza(){
		versions = new ArrayList<StanzaVersion>();
		padas = new ArrayList<Pada>();
	}
	

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	
	public int getIndex() {
		return index;
	}

	public void setIndex(int index) {
		this.index = index;
	}

	public int getBook() {
		return book;
	}

	public void setBook(int book) {
		this.book = book;
	}

	public int getHymn() {
		return hymn;
	}

	public void setHymn(int hymn) {
		this.hymn = hymn;
	}

	public int getStanza() {
		return stanza;
	}

	public void setStanza(int stanza) {
		this.stanza = stanza;
	}
	
	public int getHymnAbs() {
		return hymnAbs;
	}

	public void setHymnAbs(int hymnAbs) {
		this.hymnAbs = hymnAbs;
	}


	public String getHymnAddressee() {
		return hymnAddressee;
	}
	
	public void setHymnAddressee(String hymnAddressee) {
		this.hymnAddressee = hymnAddressee;
	}

	public String getHymnGroup() {
		return hymnGroup;
	}

	public void setHymnGroup(String hymnGroup) {
		this.hymnGroup = hymnGroup;
	}
	
	public String getStrata() {
		return strata;
	}

	public void setStrata(String strata) {
		this.strata = strata;
	}

//	public List<StanzaVersion> getTranslations(){
//		List<StanzaVersion> translations = new ArrayList<StanzaVersion>();
//		for (StanzaVersion vv : versions)
//			if (vv.getType().equals("translation"))
//				translations.add(vv);
//		return translations;
//	}
	
	public List<StanzaVersion> getVersions() {
		return versions;
	}
	
	public void addVersion(StanzaVersion version) {
		versions.add(version);
	}
	
	public List<Pada> getPadas() {
		return padas;
	}

	public void setPadas(List<Pada> padas) {
		this.padas = padas;
	}
	
	public void addPada(Pada pada) {
		padas.add(pada);
	}

	@Override
	public String toString() {
		return index + ";" + id + ";" + book + "." + hymn + "." + stanza + ":\t" +
				"(" + hymnAddressee + " / " + hymnGroup + ")\t" + versions;
	}

	@Override
	public int compareTo(Stanza o) {
		return id.compareTo(o.getId());
	}
	
}
