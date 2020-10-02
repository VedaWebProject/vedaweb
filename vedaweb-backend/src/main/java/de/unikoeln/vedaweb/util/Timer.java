package de.unikoeln.vedaweb.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Simple, portable timer class to measure approximate duration
 * of import procedures and the like...
 * 
 * @author bkis
 *
 */
public class Timer {
	
	private long start;
	
	/**
	 * Starts this timer.
	 */
	public void start() {
		start = System.nanoTime();
	}
	
	/**
	 * Stops this timer and returns the measured time in seconds
	 * @return double seconds
	 */
	public double stop() {
		return ((double)System.nanoTime() - (double)start) / 1000000d;
	}
	
	/**
	 * Stops this timer and returns the measured time in
	 * the given unit, rounded to <code>round</code> decimal places
	 * 
	 * @param unit
	 * @param round
	 * @return measured time
	 */
	public double stop(String unit, boolean round) {
		double time = 
				unit.equals("s") ? ((double)System.nanoTime() - (double)start) / 1000000000d
				: unit.equals("ns") ? ((double)System.nanoTime() - (double)start)
				: stop();
		return round ? round(time, 2) : time;
	}
	
	/*
	 * Rounds a double value to the given number of decimal places
	 */
	private double round(double value, int decPlaces) {
	    if (decPlaces < 0) throw new IllegalArgumentException();
	    BigDecimal temp = new BigDecimal(value);
	    temp = temp.setScale(decPlaces, RoundingMode.HALF_UP);
	    return temp.doubleValue();
	}

}
