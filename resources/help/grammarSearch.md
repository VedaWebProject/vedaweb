# Grammar Search

Using the grammar search, you can find stanzas containing lemmas or word forms with certain grammatical properties. The underlying data for this search are the morphological glossings (and other annotations), composed at the University of Zurich on the basis of the Rigveda version by Lubotsky (see "Morphological Glossing" view in the stanza data).  
**Please note:** This means that this feature searches a different data set (single tokens, lemmas, grammar annotations) than the quick search in the header of the page (full-text search)!

## Usage

Define a word form or lemma (optional) and select a property (like `case`, `number`, `person`, etc.) and the value you are looking for (optional). You may add more properties to your search term by clicking the `+` button to the right.  
Lemmas must be searched without meta characters, so you just have to search for `īḍ īḷ` to find `√īḍ- ~ √īḷ-` or for `dā 1` to find `√dā-¹`. Please note that if you want to find e.g. both `√dā-¹` and `√dā-²` (so the number doesn't matter), suffix the lemma with a wildcard symbol: `dā*`!

It's also possible to use **wildcards** (just like in the _Quick search_ at the top of the page), e.g. searching for `agn*` would match all word forms or lemmas starting with `agn`.

To add more than one word form or lemma to find in a stanza, click on the `+` button below the current lemma block.