package de.unikoeln.vedaweb.legacy;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field.Store;
import org.apache.lucene.document.IntPoint;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.springframework.stereotype.Service;

import com.mongodb.client.MongoCursor;

//@Service
public class IndexService {
	
	private static final String INDEX_DIR_PATH = "index";
	
	private Directory indexDirectory;
	private IndexWriter indexWriter;
	private Analyzer analyzer;
	private IndexSearcher searcher;
	private IndexReader indexReader;
	
	
	public IndexService(){
		init();
	}
	
	public void init(){
		initAnalyzer();
		initIndexDirectory();
		initIndexSearcher();
	}
	
	public void createIndex(MongoCursor<org.bson.Document> dbDocs){
		System.out.println("[INFO] No index found. Creating new index...");
		initIndexWriter();
		initAnalyzer();
		int countPlainTokens = 0;
		
		//delete old index
		if (indexExists()){
			try {
				indexWriter.deleteAll();
				indexWriter.commit();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		
		//add documents to index
		while (dbDocs.hasNext()){
			org.bson.Document dbDoc = dbDocs.next();
			int tokenPosition = 0;
			
			//parts/Halbverse
			List<org.bson.Document> parts = dbDoc.get("parts", List.class);
			for (org.bson.Document part : parts){
				
				//Tokens from plain text
				List<String> plainTokens = new ArrayList<String>(
						Arrays.asList(part.getString("form").split("[\\s\\|\\‖]+"))); //TODO ???
				
				//Tokens from grammar data
				List<org.bson.Document> gramTokens = part.get("tokens", List.class);
				
				//build documents
				for (org.bson.Document token : gramTokens){
					//check if there is dup in plain tokens, remove
					plainTokens.remove(token.getString("form"));
					
					Document indexDoc = new Document();
					
					//meta
					indexDoc.add(new StringField("location_id", dbDoc.getObjectId("_id").toString(), Store.YES));
					indexDoc.add(new IntPoint("book", dbDoc.getInteger("book")));
					indexDoc.add(new IntPoint("hymn", dbDoc.getInteger("hymn")));
					indexDoc.add(new IntPoint("verse", dbDoc.getInteger("verse")));
					indexDoc.add(new IntPoint("part", part.getInteger("index")));
					indexDoc.add(new IntPoint("position", tokenPosition++));
					
					//non-meta
					indexDoc.add(new TextField("form", token.getString("form"), Store.YES));
					indexDoc.add(new TextField("lemma", token.getString("lemma"), Store.YES));
					indexDoc.add(new TextField("casus", token.getString("casus"), Store.YES));
					indexDoc.add(new TextField("genus", token.getString("genus"), Store.YES));
					indexDoc.add(new TextField("tempus", token.getString("tempus"), Store.YES));
					indexDoc.add(new TextField("person", token.getString("person"), Store.YES));
					indexDoc.add(new TextField("modus", token.getString("modus"), Store.YES));
					indexDoc.add(new TextField("numerus", token.getString("numerus"), Store.YES));
					indexDoc.add(new TextField("diathesis", token.getString("diathesis"), Store.YES));

					//add document
					try {
						indexWriter.addDocument(indexDoc);
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
				
				//add additional plain tokens
				for (String plainToken : plainTokens){
					countPlainTokens++;
					System.out.println("FOUND ADDITIONAL PLAIN TOKEN: " + plainToken);
					Document indexDoc = new Document();
					
					//meta
					indexDoc.add(new StringField("location_id", dbDoc.getObjectId("_id").toString(), Store.YES));
					indexDoc.add(new IntPoint("book", dbDoc.getInteger("book")));
					indexDoc.add(new IntPoint("hymn", dbDoc.getInteger("hymn")));
					indexDoc.add(new IntPoint("verse", dbDoc.getInteger("verse")));
					indexDoc.add(new IntPoint("part", part.getInteger("index")));
					
					//token
					indexDoc.add(new TextField("form", plainToken, Store.YES));
					
					//add document
					try {
						indexWriter.addDocument(indexDoc);
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
			}
		}
		
		//commit, close
		try {
			indexWriter.commit();
			indexWriter.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		System.out.println("[INFO] Total # of additional plain text tokens: " + countPlainTokens);
		System.out.println("[INFO] Index created.");
	}
	
	
	public Analyzer getAnalyzer(){
		return analyzer;
	}
	
	
	private void initIndexWriter(){
		if (this.indexWriter != null) return;
		IndexWriterConfig config = new IndexWriterConfig(analyzer);
		
		try {
			this.indexWriter = new IndexWriter(this.indexDirectory, config);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	
	public boolean indexExists(){
		try {
			return DirectoryReader.indexExists(indexDirectory);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return false;
	}
	
	
	private File getIndexDirectory(){
		File indexDir = new File(INDEX_DIR_PATH);
		if (!indexDir.exists()) indexDir.mkdirs();
		return indexDir;
	}
	
	
	private void initAnalyzer(){
		if (this.analyzer != null) return;
		this.analyzer = new StandardAnalyzer();
	}
	
	
	private void initIndexDirectory(){
		if (this.indexDirectory != null) return;
		
		try {
			this.indexDirectory = FSDirectory.open(
					getIndexDirectory().toPath());
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	private void initIndexSearcher(){
		if (this.indexReader == null){
			try {
				this.indexReader = DirectoryReader.open(indexDirectory);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		if (this.searcher == null){
			this.searcher = new IndexSearcher(indexReader);
		}
	}
	
	public IndexSearcher getSearcher(){
		return searcher;
	}
	
	
}
