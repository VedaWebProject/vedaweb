package de.unikoeln.vedaweb.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

/**
 * Utility interface for arbitrary IO helper methods
 * 
 * @author bkis
 *
 */
public interface IOUtils {
	
	public static byte[] convertStreamToByteArray(InputStream stream) throws IOException {
	    return convertStreamToString(stream).getBytes();
	}
	
	
	public static String convertStreamToString(InputStream stream) throws IOException {
	    StringBuilder sb = new StringBuilder();
	    BufferedReader in = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8));
	    String line;
	    while((line = in.readLine()) != null){
	    	sb.append(line);
	    	sb.append("\n");
	    }
	    stream.close();
	    return sb.toString();
	}
	
}
