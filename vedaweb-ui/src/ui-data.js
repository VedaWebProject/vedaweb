export default {

	search: {
        meta: {
            modes: [],
            scopes: [99, 104, 34, 65, 13, 86, 45, 19, 67, 11],
            transliterations: [
				{id: "hk", name: "Harvard-Kyoto"},
				{id: "slp1", name: "SLP1 (Sanskrit Library Phonetic Basic)"},
				{id: "iast", name: "IAST (Internat. Alphabet of Sanskrit Translit.)"},
				{id: "itrans", name: "ITRANS"}
			]
        },
        smart: {
            fields: [
				{field: "form", ui: "Rigveda (HK)"},
				{field: "translation", ui: "Translations"}
			]
		},
		simple: {
            fields: [
				{field: "form", ui: "Rigveda"},
				{field: "translation", ui: "Translations"}
			]
        },
        grammar: {
            tags: [
				{
					ui: "Person",
					field: "person",
					values: ["1", "2"]
				},
				{
					ui: "Case",
					field: "case",
					values: ["NOM", "ACC", "GEN", "NOM/ACC"]
				},
				{
					ui: "Diathesis",
					field: "diathesis",
					values: ["med.", "dings."]
				},
				{
					ui: "Time",
					field: "tense",
					values: ["PRS", "PST", "FUT"]
				}
			]
        }
    }

}