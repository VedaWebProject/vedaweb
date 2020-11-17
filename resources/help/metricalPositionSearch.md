# Metrical Position Search

With this search mode, you can search for terms in certain metrical positions of the containing Pada (verse). The underlying metrical analysis is based on the text version by Van Nooten & Holland. Because of that, the terms entered in the input field must match the terms in the stanzas of this text version.

The minimal syntax for this search mode is simple: Just prepend a digit representing the desired metrical position to the term (e.g. `3víṣṇur`). You can also search for multiple terms in the same pada at once. To do so, simply add more terms separated by a blank space to your search (e.g. `3víṣṇur 5urugāyó`).The search will only find stanzas with padas that contain **all of the given terms** in the given positions.

## Prefix search via wildcards

It is possible to search for words starting with a certain substring (so, prefixes only!). Searching for `agni*` will find `agnim`, `agniḥ`, `agnināgniḥ`, and so on - so the Asterisk (`*`) works as a simple placeholder. You can only use this at the end of a term!