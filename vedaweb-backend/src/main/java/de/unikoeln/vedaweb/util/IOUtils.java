package de.unikoeln.vedaweb.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;

public class IOUtils {
	
	
	public static byte[] convertStreamToByteArray(InputStream stream) throws IOException {
	    return convertStreamToString(stream).getBytes();
	}
	
	
	public static String convertStreamToString(InputStream stream) throws IOException {
	    StringBuilder sb = new StringBuilder();
	    int i;
	    while((i = stream.read()) > -1){
	    	sb.append((char)i);
	    }
	    stream.close();
	    return sb.toString();
	}
	
	public static String readFileUTF8(File f) {
		StringBuilder sb = new StringBuilder();
		try (InputStreamReader isr = new InputStreamReader(new FileInputStream(f), "utf-8")){
			int c;
			while ((c = isr.read()) > -1) {
				sb.append((char)c);
			}
			isr.close();
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return sb.toString();
	}

	
}
