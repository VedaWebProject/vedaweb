package de.unikoeln.vedaweb.data;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="verses")
public class Verse implements Comparable<Verse> {
	
	@Id
	private String id;
	private int index;
	
	private int book;
	private int hymn;
	private int verse;
	
	private String hymnAddressee;
	private String hymnGroup;
	private String strata;
	
	private List<Pada> padas;
	
	private List<VerseVersion> versions;
	
	
	public Verse(){
		versions = new ArrayList<VerseVersion>();
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

	public int getVerse() {
		return verse;
	}

	public void setVerse(int verse) {
		this.verse = verse;
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

	public List<VerseVersion> getTranslations(){
		List<VerseVersion> translations = new ArrayList<VerseVersion>();
		for (VerseVersion vv : versions)
			if (vv.getType().equals("translation"))
				translations.add(vv);
		return translations;
	}

	public List<Pada> getPadas() {
		return padas;
	}

	public void addPada(Pada pada) {
		padas.add(pada);
	}
	
	public List<VerseVersion> getVersions() {
		return versions;
	}
	
	public void addVersion(VerseVersion version) {
		versions.add(version);
	}

	@Override
	public String toString() {
		return index + ";" + id + ";" + book + "." + hymn + "." + verse + ":\t" +
				"(" + hymnAddressee + " / " + hymnGroup + ")\t" +
				padas + "\t" +
				versions;
	}

	@Override
	public int compareTo(Verse o) {
		return id.compareTo(o.getId());
	}
	
}
