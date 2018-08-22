package de.unikoeln.vedaweb.util;

import java.io.IOException;
import java.io.InputStream;

public class IOUtils {
	
	
	public static byte[] convertStreamToByteArray(InputStream stream) throws IOException {
	    StringBuilder sb = new StringBuilder();
	    int i;
	    while((i = stream.read()) > -1){
	    	sb.append((char)i);
	    }
	    stream.close();
	    return sb.toString().getBytes();
	}

	
}
