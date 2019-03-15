package de.unikoeln.vedaweb.dev;

import de.unikoeln.vedaweb.util.StringUtils;

public class DevMain {

	public static void main(String[] args) {
		String s = "agním ā́ īḷe puróhitaṁ pŕ̥ŕ̥śnimātaraḥ";
		System.out.println(StringUtils.containsAccents(s));
		System.out.println(s);
		System.out.println(StringUtils.removeVowelAccents(s));
	}

}
