# Quick Search: Regular Expressions (RegEx)

You can enable Regular Expressions (RegEx) for the Quick Search. ** ATTENTION:**

- RegEx are matched against **a whole stanza** of the selected text version(s).    
- RegEx are always anchored by default. There is no reason to use `^` or `$` to match the beginning or end of the matching string, because your RegEx _always must match the whole stanza_! 


## Example

    sómasya mā tavásaṁ vákṣy agne  
    váhniṁ cakartha vidáthe yájadhyai  
    devā́m̐ áchā dī́dyad yuñjé ádriṁ  
    śamāyé agne tanvàṁ juṣasva

Here, a RegEx-enabled search for `.*mā.*asva` would match this stanza, because `asva` is at the end of this line. The `.*` before `mā` is necessary, because `mā` is not the beginning of this stanza.  
Also, `sómasya.*juṣasva` would match this stanza, because, again, the RegEx-search applies to all lines of a stanza by default.


## Another Example

To search for words ending with `ṣv`, directly followed by the word `ā`, 
you could search for a Regular Expression `.*ṣv ā .*`.

**You get an overview of the supported RegEx operators [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/regexp-syntax.html#regexp-standard-operators).**