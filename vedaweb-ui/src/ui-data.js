export default {
	"search": {
		"textSearch": {
			"fields": [
				{"field": "text", "ui": "Rigveda Text"},
				{"field": "translation_de", "ui": "Translation DE"},
				{"field": "translation_en", "ui": "Translation EN"},
				{"field": "translation_fr", "ui": "Translation FR"}
			]
		},
		"grammar": [
			{
				"ui": "Person",
				"field": "person",
				"values": ["1.", "2.", "2./3."]
			},
			{
				"ui": "Case",
				"field": "case",
				"values": ["Akk.", "Gen.", "Dat.", "Ind."]
			},
			{
				"ui": "Diathesis",
				"field": "diathesis",
				"values": ["med.", "dings."]
			},
			{
				"ui": "Time",
				"field": "time",
				"values": ["pres.", "past.", "fut."]
			}
		],
        "books": [99, 104, 34, 65, 13, 86, 45, 19, 67, 11],
		"transliteration": [
			{"id": "hk", "name": "Harvard-Kyoto"},
			{"id": "iast", "name": "IAST (International Alphabet of Sanskrit Transliteration)"},
			{"id": "itrans", "name": "ITRANS"},
			{"id": "slp1", "name": "SLP1 (Sanskrit Library Phonetic Basic)"}
		]
	}
}