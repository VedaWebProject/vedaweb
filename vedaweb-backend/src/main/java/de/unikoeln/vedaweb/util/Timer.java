package de.unikoeln.vedaweb.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class Timer {
	
	private long start;
	
	public void start() {
		start = System.nanoTime();
	}
	
	public double stop() {
		return ((double)System.nanoTime() - (double)start) / 1000000d;
	}
	
	public double stop(String unit, boolean round) {
		double time = 
				unit.equals("s") ? ((double)System.nanoTime() - (double)start) / 1000000000d
				: unit.equals("ns") ? ((double)System.nanoTime() - (double)start)
				: stop();
		return round ? round(time, 2) : time;
	}
	
	private double round(double value, int decPlaces) {
	    if (decPlaces < 0) throw new IllegalArgumentException();
	    BigDecimal temp = new BigDecimal(value);
	    temp = temp.setScale(decPlaces, RoundingMode.HALF_UP);
	    return temp.doubleValue();
	}

}
