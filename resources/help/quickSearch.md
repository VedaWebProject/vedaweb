# Quick Search

The Quick Search is a versatile search for, well, quick searches. It is why it is present at the top of each page at all time. You can search for several things in several ways:

## Stanza location

Just type a Rigveda stanza location in the form of `2.1.3` or `02.001.03` or even `0200103` to be redirected to this stanza's page without further detours.  
You can also use an absolute hymn- and stanza number in the following form: `517,3`

## Simple text search:

First, choose _where_ you want to search - either in certain text version (or in all of them) or in a certain translation (or all of them). Then, type the word form(s) you want to search for. It's also possible to search for **multiple words** at once, in which case the **stanzas containing the most** of what you are looking for will be **ranked higher** in the search results.

## Transliteration

If you search for terms in the Rigveda stanzas, you can **use a transliteration method of your choice**. Our data is in ISO-15919, so if you want to type in ISO-15919 you can just do that (or why not try the on-screen keyboard with the button at the beginning of the search input field?). But your search input can also be transliterated from several other standards to ISO-15919. The **default setting is Harvard-Kyoto (HK)**, but you can change this in the **Advanced Search Settings**.

## Wildcards

It is possible to search for words starting or ending with a certain substring. Searching for `agni*` will find `agnim`, `agniḥ`, `agnināgniḥ`, and so on - so the Asterisk (`*`) works as a simple placeholder. You can use this in the beginning (`*dāḥ`), the end (`agni*`) or both (`*dak*`).

## Phrase search

You can search for multiple words in a specific order by quoting them as a phrase, e.g. `"a hundred jars of wine"`  
**Please be aware that you _cannot use wildcards in a phrase search_!**

## Logical operators

Using the `AND` and `OR` operators, you can construct little logical statements. Searching for `agnim OR indra`, you'll find every stanza containing one of the words **agnim** or **indra**. The same works for the `AND` operator: `agnim AND indra` will give you the stanzas containing both words.

## Required and prohibited terms

With `+` and `-`, you can specify terms that **must** or **must not** occur in a stanza to be found. So, for example, `agnim -indra` finds stanzas containing **agnim** and not containing **indra**, while `agnim +indra` finds stanzas that _might_ contain **agnim** but definitely contain **indra**.

## Fuzzy Search

A search like `agnm~` (with the appended `~`) will perform a fuzzy search for `agnm`. 
This means that not only `agnm` will be found, but also similar terms (Like `agnim`, `agne` or `agnā`). 
The measurement for similarity here is a _Damerau-Levenshtein distance_ of `2`.