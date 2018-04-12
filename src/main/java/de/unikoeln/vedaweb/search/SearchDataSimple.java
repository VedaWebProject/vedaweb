package de.unikoeln.vedaweb.search;


public class SearchDataSimple {
	
	private String input;
	private String inputTrans;
	
	
	public String getInput() {
		return input;
	}

	public void setInput(String input) {
		this.input = input;
	}

	public String getInputTrans() {
		return inputTrans;
	}

	public void setInputTrans(String inputTrans) {
		this.inputTrans = inputTrans;
	}

	@Override
	public String toString() {
		return "input:" + input + " trans:" + inputTrans;
	}
	
}
