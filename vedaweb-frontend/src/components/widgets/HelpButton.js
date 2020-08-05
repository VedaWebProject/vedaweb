import React, { Component } from "react";
import { Icon, Modal, Typography } from 'antd';
import help from "../../img/help.png";
import "./HelpButton.css";

const { Text } = Typography;

const helpTexts = {
    transliteration: {
        title: "Input Transliteration",
        content:
            <div>
                <p>
                    You can select one of the available transliteration standards for your search inputs.
                    This setting also applies to the Quick Search in the page header and will be saved as long as you stay 
                    on this website.
                </p>
            </div>
    },
    start: {
        title: "There you go!",
        content:
            <div>
                <p>
                    Right, this is how it works. But this particular help button was meant for demonstration purposes only.
                </p>
            </div>
    },
    grammarSearch : {
        title: "Grammar Search",
        content:
            <div>
                <p>
                    Using the grammar search, you can find stanzas containing lemmas or word forms with certain grammatical properties.
                    The underlying data for this search are the morphological glossings (and other annotations),
                    composed at the University of Zurich on the basis of the Rigveda version by Lubotsky (see "Morphological Glossing" view in the stanza data).<br/>
                    <strong>Please note: </strong>This means that this feature searches a different data set (single tokens, lemmas, grammar annotations) than the quick search in the header of the page (full-text search)!
                </p>
                <p>
                    <h4>Usage</h4>
                    Define a word form or lemma (optional) and select a property (like <Text code>case</Text>, <Text code>number</Text>, <Text code>person</Text>, etc.)
                    and the value you are looking for (optional). You may add more properties to your search term by clicking the <Text code>+</Text> button to the right.<br/>
                    Lemmas must be searched without meta characters, so you just have to search for <Text code>īḍ īḷ</Text> to find <Text code>√īḍ- ~ √īḷ-</Text> or for <Text code>dā 1</Text> to find <Text code>√dā-¹</Text>.
                    Please note that if you want to find e.g. both <Text code>√dā-¹</Text> and <Text code>√dā-²</Text> (so the number doesn't matter), suffix the lemma with a wildcard symbol: <Text code>dā*</Text>!
                </p>
                <p>
                    It's also possible to use <strong>wildcards</strong> (just like in the <i>Quick search</i> at the top of the page),
                    e.g. searching for <Text code>agn*</Text> would match all word forms or lemmas starting with <i>agn</i>.
                </p>
                <p>
                    To add more than one word form or lemma to find in a stanza, click on the <Text code>+</Text> button below.
                </p>
            </div>
    },
    metricalSearch : {
        title: "Metrical Search",
        content:
            <div>
                <p>
                    With this search mode, you can search for metrical patterns.
                </p>
                <p>
                    <h4>Usage</h4>
                    There is metrical data associated with some text versions, of which you can choose the one you want to search in using the dropdown menu.<br/>
                    The metrical data is composed of markers for short and long syllables.
                    They are displayed in a stanza's data as <Text code>—</Text> for a long and <Text code>◡</Text> for a short syllable.
                </p>
                <p>
                    To make searching in this data easier, you have to use <Text code>L</Text> for a long and <Text code>S</Text> for a short syllable.
                    You can also search for multiple "words" in any order, or even in a fixed order by using a quoted "phrase search" (e.g. <Text code>"LSS SL"</Text>).
                </p>
                <p>
                    <h4>Wildcards</h4>
                    It's also possible to use <strong>wildcards</strong> (just like in the <i>Quick search</i> at the top of the page),
                    e.g. searching for <Text code>LLS*</Text> would match all words starting with this metrical pattern.
                    Likewise, <Text code>LLS?</Text> would find words with four syllables, where the last one can be long <i>or</i> short.
                </p>
                <p>
                    <strong>Please be aware that you <u>cannot use wildcards in a phrase search</u>!</strong>
                </p>
            </div>
    },
    metricalPositionSearch : {
        title: "Metrical Position Search",
        content:
            <div>
                <p>
                    With this search mode, you can search for terms in certain metrical positions of the containing Pada (verse).
                    The underlying metrical analysis is based on the text version by Van Nooten & Holland.
                    Because of that, the terms entered in the input field must
                    match the terms in the stanzas of this text version to be found.
                </p>
                <p>
                    Please note that this search mode will only search for single terms - not for multiple terms or phrases!
                </p>
                <h4>Wildcards</h4>
                <p>
                    It is possible to search for words starting or ending with a certain substring.
                    Searching for <Text code>agni*</Text> will find <Text code>agnim</Text>, <Text code>agniḥ</Text>, <Text code>agnināgniḥ</Text>, and so on - so the Asterisk (<Text code>*</Text>)
                    works as a simple placeholder. You can use this in the beginning (<Text code>*dāḥ</Text>), the end (<Text code>agni*</Text>)
                    or both (<Text code>*dak*</Text>).
                </p>
            </div>
    },
    searchScope : {
        title: "Search Range Filter",
        content:
            <div>
                <p>
                    The search range filter lets you specify ranges of books (and hymns) to limit your search to. 
                    You may add more ranges by clicking the <Text code>+</Text> button to the right of each line.
                </p>
            </div>
    },
    searchMetaFilters : {
        title: "Meta Filters",
        content:
            <div>
                <p>
                    By setting up meta filters, you can limit your search to stanzas matching the specified meta properties.
                </p>
                <p>
                    It is possible to select multiple values per property. The results will only contain stanzas 
                    that match at least one of the selected values for each property you specified!
                </p>
            </div>
    },
    zurichGlossing : {
        title: "Morphological Glossings from Zurich",
        content:
            <div>
                <p>
                    The morphological annotation was carried out at the University of Zurich.<br/>
                    It follows the Leipzig Glossing Rules. The abbreviations used are listed below:
                </p>
                <table style={{width: 'auto'}}><tbody>
                    <tr><td className="bold">1</td><td>first person</td></tr>
                    <tr><td className="bold">2</td><td>second person</td></tr>
                    <tr><td className="bold">3</td><td>third person</td></tr>
                    <tr><td className="bold">ABL</td><td>ablative</td></tr>
                    <tr><td className="bold">ACC</td><td>accusative</td></tr>
                    <tr><td className="bold">ACT</td><td>active</td></tr>
                    <tr><td className="bold">AOR</td><td>aorist</td></tr>
                    <tr><td className="bold">COND</td><td>conditional</td></tr>
                    <tr><td className="bold">CVB</td><td>converb</td></tr>
                    <tr><td className="bold">DAT</td><td>dative</td></tr>
                    <tr><td className="bold">DU</td><td>dual</td></tr>
                    <tr><td className="bold">F</td><td>feminine</td></tr>
                    <tr><td className="bold">FUT</td><td>future</td></tr>
                    <tr><td className="bold">GEN</td><td>genitive</td></tr>
                    <tr><td className="bold">IMP</td><td>imperative</td></tr>
                    <tr><td className="bold">IND</td><td>indicative</td></tr>
                    <tr><td className="bold">INF</td><td>infinitive</td></tr>
                    <tr><td className="bold">INJ</td><td>injuctive</td></tr>
                    <tr><td className="bold">INS</td><td>instrumental</td></tr>
                    <tr><td className="bold">IPRF</td><td>imperfect</td></tr>
                    <tr><td className="bold">LOC</td><td>locative</td></tr>
                    <tr><td className="bold">M</td><td>mascuiline</td></tr>
                    <tr><td className="bold">MED</td><td>middle voice</td></tr>
                    <tr><td className="bold">N</td><td>neuter</td></tr>
                    <tr><td className="bold">NOM</td><td>nominative</td></tr>
                    <tr><td className="bold">OPT</td><td>optative</td></tr>
                    <tr><td className="bold">PASS</td><td>passive voice</td></tr>
                    <tr><td className="bold">PL</td><td>plural</td></tr>
                    <tr><td className="bold">PLUPRF</td><td>past perfect</td></tr>
                    <tr><td className="bold">PPP</td><td>na participle perfective passive</td></tr>
                    <tr><td className="bold">PPP</td><td>ta participle perfective passive</td></tr>
                    <tr><td className="bold">PRF</td><td>perfect</td></tr>
                    <tr><td className="bold">PRS</td><td>present</td></tr>
                    <tr><td className="bold">PTCP</td><td>participle</td></tr>
                    <tr><td className="bold">SBJV</td><td>subjunctive</td></tr>
                    <tr><td className="bold">SG</td><td>singular</td></tr>
                    <tr><td className="bold">VOC</td><td>vocative</td></tr>
                </tbody></table>
            </div>
    },
    quickSearch : {
        title: "Quick Search",
        content:
            <div>
                <p>
                    The Quick Search is a versatile search for, well, quick searches.
                    It is why it is present at the top of each page at all time.
                    You can search for several things in several ways:
                </p>
                <h4>Stanza location</h4>
                <p>
                    Just type a Rigveda stanza location in the form of <Text code>2.1.3</Text> or <Text code>02.001.03</Text> or 
                    even <Text code>0200103</Text> to be redirected to this stanza's page without further detours.<br/>
                    You can also use an absolute hymn- and stanza number in the following form: <Text code>517,3</Text>
                </p>
                <h4>Simple text search:</h4>
                <p>
                    First, choose <i>where</i> you want to search - either in certain text version (or in all of them) or in a certain translation (or all of them).
                    Then, type the word form(s) you want to search for. It's also possible to search for <strong>multiple words</strong> at once, in which case the <strong>stanzas containing the most</strong> of what you are looking
                    for will be <strong>ranked higher</strong> in the search results.
                </p>
                <h4>Transliteration</h4>
                <p>
                    If you search for terms in the Rigveda stanzas, you can <strong>use a transliteration method of your choice</strong>.
                    Our data is in ISO-15919, so if you want to type in ISO-15919 you can just do that (or why not try the on-screen keyboard with the button at the beginning of the search input field?).
                    But your search input can also be transliterated from several other standards to ISO-15919.
                    The <strong>default setting is Harvard-Kyoto (HK)</strong>, but you can change this in the <strong>Advanced Search Settings</strong>.
                </p>
                <h4>Wildcards</h4>
                <p>
                    It is possible to search for words starting or ending with a certain substring.
                    Searching for <Text code>agni*</Text> will find <Text code>agnim</Text>, <Text code>agniḥ</Text>, <Text code>agnināgniḥ</Text>, and so on - so the Asterisk (<Text code>*</Text>)
                    works as a simple placeholder. You can use this in the beginning (<Text code>*dāḥ</Text>), the end (<Text code>agni*</Text>)
                    or both (<Text code>*dak*</Text>).
                </p>
                <h4>Phrase search</h4>
                <p>
                    You can search for multiple words in a specific order by quoting them as a phrase, e.g. <Text code>"a hundred jars of wine"</Text><br/>
                    <strong>Please be aware that you <u>cannot use wildcards in a phrase search</u>!</strong>
                </p>
                <h4>Logical operators</h4>
                <p>
                    Using the <Text code>AND</Text> and <Text code>OR</Text> operators, you can construct little logical statements.
                    Searching for <Text code>agnim OR indra</Text>, you'll find every stanza containing one of the words <strong>agnim</strong> or <strong>indra</strong>.
                    The same works for the <Text code>AND</Text> operator: <Text code>agnim AND indra</Text> will give you the stanzas containing both words.
                </p>
                <h4>Required and prohibited terms</h4>
                <p>
                    With <Text code>+</Text> and <Text code>-</Text>, you can specify terms that <strong>must</strong> or <strong>must not</strong> occur in a stanza to be found.
                    So, for example, <Text code>agnim -indra</Text> finds stanzas containing <strong>agnim</strong> and not containing <strong>indra</strong>,
                    while <Text code>agnim +indra</Text> finds stanzas that <i>might</i> contain <strong>agnim</strong> but definitely contain <strong>indra</strong>.
                </p>
                <h4>Fuzzy Search</h4>
                <p>
                    A search like <Text code>agnm~</Text> (with the appended <Text code>~</Text>) will perform a fuzzy search for <Text code>agnm</Text>. 
                    This means that not only <Text code>agnm</Text> will be found, but also similar terms (Like <Text code>agnim</Text>, <Text code>agne</Text> or <Text code>agnā</Text>). 
                    The measurement for similarity here is a <i>Damerau-Levenshtein distance</i> of <Text code>2</Text>.
                </p>
            </div>
    },
    quickSearchRegex : {
        title: "Quick Search: Regular Expressions (RegEx)",
        content:
            <div>
                <p>You can enable Regular Expressions (RegEx) for the Quick Search.</p>
                <p>
                    <strong><Icon type="exclamation-circle"/> ATTENTION:</strong>
                    <ul>
                        <li>RegEx are matched against <strong>a whole stanza</strong> of the selected text version(s).</li>    
                        <li>
                            RegEx are always anchored by default. There is no reason to
                            use <Text code>^</Text> or <Text code>$</Text> to match the 
                            beginning or end of the matching string, because your RegEx <i>always must match the whole stanza</i>!
                        </li>
                    </ul>
                </p>
                <h4>Example</h4>
                <p class="text-font">
                    sómasya mā tavásaṁ vákṣy agne<br/>
                    váhniṁ cakartha vidáthe yájadhyai<br/>
                    devā́m̐ áchā dī́dyad yuñjé ádriṁ<br/>
                    śamāyé agne tanvàṁ juṣasva
                </p>
                <p>
                    Here, a RegEx-enabled search for <Text code>.*mā.*asva</Text> would match this stanza,
                    because <Text code>asva</Text> is at the end of this line.
                    The <Text code>.*</Text> before <Text code>mā</Text> is necessary, because <Text code>mā</Text>
                    is not the beginning of this stanza.<br/>
                    Also, <Text code>sómasya.*juṣasva</Text> would match this stanza,
                    because, again, the RegEx-search applies to all lines of a stanza by default.
                </p>
                <h4>Another Example</h4>
                <p>
                    To search for words ending with <Text code>ṣv</Text>, directly followed by the word <Text code>ā</Text>, 
                    you could search for a Regular Expression <Text code>.*ṣv ā .*</Text>.
                </p>
                <p>
                    <strong>
                        You get an overview of the supported RegEx operators <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/regexp-syntax.html#regexp-standard-operators" target="_blank" rel="noopener noreferrer">here</a>.
                    </strong>
                </p>
            </div>
    },
    accentSensitive : {
        title: "Accent-sensitive search",
        content:
            <div>
                <p>
                    If you use accent-sensitive search, you will only find stanzas matching your exact use of accented vowels,
                    whereas if you disable accent-sensitive search, accents will be ignored, <i>even if you use them</i>.
                </p>
            </div>
    },
    version_lubotskyzurich : {
        title: "Rigveda Version in ISO-15919",
        content:
            <div>
                <p>
                    A version of the Rigveda text based on Lubotsky's concordance,
                    used as the reference text for the annotations added at the University of Zurich
                </p>
            </div>
    },
    version_eichler : {
        title: "Devanagari (Eichler)",
        content:
            <div>
                <p>
                    Devanagari version based on the Samhita-text by Aufrecht and Van Nooten &amp; Holland, provided by Detlef Eichler.<br/>
                    <a href="http://www.detlef108.de/Rigveda.htm" target="_blank" rel="noopener noreferrer">http://www.detlef108.de/Rigveda.htm</a>
                </p>
            </div>
    },
    version_gasuns : {
        title: "Devanagari (provided by Mārcis Gasūns)",
        content:
            <div>
                <p>
                    Devanagari version provided by Mārcis Gasūns.<br/>
                    <a href="https://www.sanskrit-lexicon.uni-koeln.de/" target="_blank" rel="noopener noreferrer">https://www.sanskrit-lexicon.uni-koeln.de/</a>
                </p>
            </div>
    },
    version_vannootenholland : {
        title: "Van Nooten & Holland",
        content:
            <div>
                <p>
                    Nooten, Barend A. van &amp; Gary Holland (eds.). 1994. Rig Veda: a metrically restored text with an introduction and notes. Cambridge, Mass. [u.a.]: Harvard University Press.
                </p>
                <b>Coverage of this version:</b><br/>
                <p>
                    <Text code>01.001.01</Text> to <Text code>06.063.10</Text><br/>  
                    <Text code>06.064.01</Text> to <Text code>10.191.03</Text>
                </p>
            </div>
    },
    version_aufrecht : {
        title: "Aufrecht",
        content:
            <div>
                <p>
                    Aufrecht, Theodor. 1955. Die Hymnen des Rigveda. Erster Teil. Mandala I-VI. Darmstadt: Wissenschaftliche Buchgesellschaft. UND Aufrecht, Theodor. 1955. Die Hymnen des Rigveda. Zweiter Teil. Mandala VII-X. Darmstadt: Wissenschaftliche Buchgesellschaft.
                </p>
                <b>Coverage of this version:</b><br/>
                <p>
                    <Text code>01.001.01</Text> to <Text code>01.064.15</Text><br/>  
                    <Text code>01.071.01</Text> to <Text code>07.016.12</Text><br/>  
                    <Text code>07.018.01</Text> to <Text code>07.032.02</Text><br/>  
                    <Text code>07.032.04</Text> to <Text code>07.033.14</Text><br/>  
                    <Text code>07.034.22</Text> to <Text code>10.191.03</Text>
                </p>
            </div>
    },
    version_padapatha : {
        title: "Padapatha",
        content:
            <div>
                <p>
                    (source info is yet to be provided)
                </p>
                <b>Coverage of this version:</b><br/>
                <p>
                    <Text code>01.001.01</Text> to <Text code>09.097.34</Text><br/>  
                    <Text code>09.097.36</Text> to <Text code>10.191.03</Text>
                </p>
            </div>
    },
    version_gunkelryan : {
        title: "Samitha (Gunkel & Ryan)",
        content:
            <div>
                <p>
                    provided by D. Gunkel and K. Ryan
                </p>
            </div>
    },
    version_lubotsky : {
        title: "Lubotsky",
        content:
            <div>
                <p>
                    Lubotsky, Alexander. 1997. A Rgvedic word concordance. (2 Vols.) New Haven, Conn.: American Oriental Society.
                </p>
            </div>
    },
    translation_griffith : {
        title: "Griffith",
        content:
            <div>
                <p>
                    Griffith, Ralph Thomas Hotchkin. 1890. The Hymns of the Rigveda. E.J. Lazarus.
                </p>
                <b>Coverage of this translation:</b><br/>
                <p>
                    <Text code>01.001.01</Text> to <Text code>01.011.08</Text><br/>  
                    <Text code>01.012.02</Text> to <Text code>01.024.15</Text><br/>  
                    <Text code>01.025.02</Text> to <Text code>01.037.15</Text><br/>  
                    <Text code>01.038.02</Text> to <Text code>01.041.09</Text><br/>  
                    <Text code>01.042.02</Text> to <Text code>01.043.09</Text><br/>  
                    <Text code>01.044.02</Text> to <Text code>01.044.14</Text><br/>  
                    <Text code>01.045.02</Text> to <Text code>01.052.15</Text><br/>  
                    <Text code>01.053.02</Text> to <Text code>01.055.08</Text><br/>  
                    <Text code>01.056.02</Text> to <Text code>01.056.06</Text><br/>  
                    <Text code>01.057.02</Text> to <Text code>01.057.06</Text><br/>  
                    <Text code>01.058.02</Text> to <Text code>01.059.07</Text><br/>  
                    <Text code>01.060.02</Text> to <Text code>01.065.05</Text><br/>  
                    <Text code>01.066.01</Text> to <Text code>01.066.05</Text><br/>  
                    <Text code>01.067.01</Text> to <Text code>01.067.05</Text><br/>  
                    <Text code>01.068.01</Text> to <Text code>01.068.05</Text><br/>  
                    <Text code>01.069.01</Text> to <Text code>01.069.05</Text><br/>  
                    <Text code>01.070.01</Text> to <Text code>01.070.06</Text><br/>  
                    <Text code>01.071.01</Text> to <Text code>01.072.10</Text><br/>  
                    <Text code>01.073.02</Text> to <Text code>01.091.17</Text><br/>  
                    <Text code>01.091.19</Text> to <Text code>02.021.06</Text><br/>  
                    <Text code>02.022.02</Text> to <Text code>02.028.11</Text><br/>  
                    <Text code>02.029.02</Text> to <Text code>04.009.08</Text><br/>  
                    <Text code>04.010.02</Text> to <Text code>04.032.24</Text><br/>  
                    <Text code>04.033.02</Text> to <Text code>05.011.06</Text><br/>  
                    <Text code>05.012.02</Text> to <Text code>05.044.13</Text><br/>  
                    <Text code>05.044.15</Text> to <Text code>05.055.07</Text><br/>  
                    <Text code>05.055.09</Text> to <Text code>06.027.08</Text><br/>  
                    <Text code>06.028.02</Text> to <Text code>07.024.06</Text><br/>  
                    <Text code>07.025.02</Text> to <Text code>08.026.03</Text><br/>  
                    <Text code>08.026.05</Text> to <Text code>08.037.07</Text><br/>  
                    <Text code>08.038.02</Text> to <Text code>08.060.15</Text><br/>  
                    <Text code>08.061.01</Text> to <Text code>08.064.12</Text><br/>  
                    <Text code>08.065.02</Text> to <Text code>08.066.11</Text><br/>  
                    <Text code>08.067.01</Text> to <Text code>08.067.10</Text><br/>  
                    <Text code>08.068.01</Text> to <Text code>08.068.09</Text><br/>  
                    <Text code>08.069.01</Text> to <Text code>08.069.10</Text><br/>  
                    <Text code>08.070.01</Text> to <Text code>08.070.09</Text><br/>  
                    <Text code>08.071.01</Text> to <Text code>08.071.09</Text><br/>  
                    <Text code>08.072.01</Text> to <Text code>08.072.09</Text><br/>  
                    <Text code>08.073.01</Text> to <Text code>08.073.09</Text><br/>  
                    <Text code>08.074.01</Text> to <Text code>08.074.09</Text><br/>  
                    <Text code>08.075.01</Text> to <Text code>08.075.05</Text><br/>  
                    <Text code>08.076.01</Text> to <Text code>08.076.06</Text><br/>  
                    <Text code>08.077.01</Text> to <Text code>08.077.06</Text><br/>  
                    <Text code>08.078.01</Text> to <Text code>08.078.07</Text><br/>  
                    <Text code>08.079.01</Text> to <Text code>08.079.06</Text><br/>  
                    <Text code>08.080.01</Text> to <Text code>08.080.07</Text><br/>  
                    <Text code>08.081.01</Text> to <Text code>08.092.14</Text><br/>  
                    <Text code>08.093.01</Text> to <Text code>08.093.10</Text><br/>  
                    <Text code>08.094.01</Text> to <Text code>08.094.10</Text><br/>  
                    <Text code>08.095.01</Text> to <Text code>08.096.10</Text><br/>  
                    <Text code>08.097.01</Text> to <Text code>08.097.08</Text><br/>  
                    <Text code>08.098.01</Text> to <Text code>08.098.08</Text><br/>  
                    <Text code>08.099.01</Text> to <Text code>08.099.05</Text><br/>  
                    <Text code>08.100.01</Text> to <Text code>08.100.05</Text><br/>  
                    <Text code>08.101.01</Text> to <Text code>08.101.04</Text><br/>  
                    <Text code>08.102.01</Text> to <Text code>08.102.03</Text><br/>  
                    <Text code>08.103.01</Text> to <Text code>08.103.07</Text><br/>  
                    <Text code>09.001.01</Text> to <Text code>09.007.08</Text><br/>  
                    <Text code>09.008.01</Text> to <Text code>09.008.07</Text><br/>  
                    <Text code>09.008.09</Text><br/>  
                    <Text code>09.009.02</Text> to <Text code>09.084.05</Text><br/>  
                    <Text code>09.085.02</Text> to <Text code>09.099.08</Text><br/>  
                    <Text code>09.100.02</Text> to <Text code>09.106.14</Text><br/>  
                    <Text code>09.107.02</Text> to <Text code>10.048.06</Text><br/>  
                    <Text code>10.048.08</Text> to <Text code>10.061.04</Text><br/>  
                    <Text code>10.061.10</Text> to <Text code>10.064.17</Text><br/>  
                    <Text code>10.065.02</Text> to <Text code>10.086.15</Text><br/>  
                    <Text code>10.086.18</Text> to <Text code>10.098.12</Text><br/>  
                    <Text code>10.099.02</Text> to <Text code>10.132.04</Text><br/>  
                    <Text code>10.132.06</Text> to <Text code>10.174.05</Text><br/>  
                    <Text code>10.175.02</Text> to <Text code>10.191.03</Text>
                </p>
            </div>
    },
    translation_renou : {
        title: "Renou",
        content:
            <div>
                <p>
                    Renou, Louis. (1955-1964) Études védiques et pāṇinéennes (several vols). Paris: Boccard.
                </p>
                <b>Coverage of this translation:</b><br/>
                <p>
                    <Text code>02.031.01</Text> to <Text code>02.031.07</Text><br/>  
                    <Text code>03.054.01</Text> to <Text code>03.057.06</Text><br/>  
                    <Text code>04.055.01</Text> to <Text code>04.055.10</Text><br/>  
                    <Text code>05.041.01</Text> to <Text code>05.044.15</Text><br/>  
                    <Text code>06.049.01</Text> to <Text code>06.052.04</Text><br/>  
                    <Text code>06.052.06</Text> to <Text code>06.052.07</Text><br/>  
                    <Text code>06.052.09</Text> to <Text code>06.052.17</Text><br/>  
                    <Text code>07.034.01</Text> to <Text code>07.037.08</Text><br/>  
                    <Text code>07.039.01</Text> to <Text code>07.040.07</Text><br/>  
                    <Text code>07.042.01</Text> to <Text code>07.043.04</Text>    
                </p>
            </div>
    },
    translation_geldner : {
        title: "Geldner",
        content:
            <div>
                <p>
                    Geldner, Karl Friedrich. 1951. Der Rig-Veda (aus d. Sanskrit ins Dt. übers. u. mit e. laufenden Kommentar versehen).  Cambridge, Mass.: Harvard University Press.
                </p>
                <b>Coverage of this translation:</b><br/>
                <p>
                    <Text code>01.001.01</Text> to <Text code>01.035.10</Text><br/>  
                    <Text code>01.036.01</Text> to <Text code>10.191.03</Text>
                </p>
            </div>
    },
    translation_grassmann : {
        title: "Graßmann",
        content:
            <div>
                <p>
                    Graßmann, Hermann. 1876, 1877. Rig-Veda (Vol 1 and 2). Leipzig.
                </p>
                <b>Coverage of this translation:</b><br/>
                <p>
                    <Text code>01.001.01</Text> to <Text code>03.005.10</Text><br/>  
                    <Text code>03.006.01</Text> to <Text code>04.002.17</Text><br/>  
                    <Text code>04.002.19</Text> to <Text code>05.041.19</Text><br/>  
                    <Text code>05.042.01</Text> to <Text code>05.052.16</Text><br/>  
                    <Text code>05.053.01</Text> to <Text code>05.055.09</Text><br/>  
                    <Text code>05.056.01</Text> to <Text code>06.048.21</Text><br/>  
                    <Text code>06.049.01</Text> to <Text code>07.083.08</Text><br/>  
                    <Text code>07.084.01</Text> to <Text code>08.005.36</Text><br/>  
                    <Text code>08.006.01</Text> to <Text code>08.012.33</Text><br/>  
                    <Text code>08.013.10</Text> to <Text code>08.034.09</Text><br/>  
                    <Text code>08.034.11</Text> to <Text code>08.067.06</Text><br/>  
                    <Text code>08.067.08</Text> to <Text code>10.164.01</Text><br/>  
                    <Text code>10.165.02</Text> to <Text code>10.185.03</Text><br/>  
                    <Text code>10.187.01</Text> to <Text code>10.187.03</Text><br/>  
                    <Text code>10.188.01</Text> to <Text code>10.191.02</Text> 
                </p>
            </div>
    },
    translation_otto : {
        title: "Otto",
        content:
            <div>
                <p>
                    Otto, Rudolf. 1948. Varuna-Hymnen des Rig-Veda. Bonn: Ludwig Röhrscheid Verlag.
                </p>
                <b>Coverage of this translation:</b><br/>
                <p>
                    <Text code>01.024.07</Text> to <Text code>01.024.15</Text><br/>  
                    <Text code>05.064.01</Text> to <Text code>05.064.07</Text><br/>  
                    <Text code>05.066.01</Text> to <Text code>05.066.02</Text><br/>  
                    <Text code>05.066.04</Text> to <Text code>05.066.06</Text><br/>  
                    <Text code>05.085.01</Text> to <Text code>05.085.07</Text><br/>  
                    <Text code>07.062.01</Text> to <Text code>07.062.06</Text><br/>  
                    <Text code>07.086.01</Text> to <Text code>07.088.07</Text><br/>  
                    <Text code>08.041.01</Text> to <Text code>08.041.10</Text><br/>  
                    <Text code>10.063.01</Text> to <Text code>10.063.07</Text><br/>  
                    <Text code>10.082.02</Text> 
                </p>
            </div>
    },
    translation_macdonell : {
        title: "MacDonell",
        content:
            <div>
                <p>
                    MacDonell, Arthur A. 1922. Hymns from the Rigveda. Selected and Metrically Translated. London: Oxford University Press.
                </p>
                <b>Coverage of this translation:</b><br/>
                <p>
                    <Text code>01.001.01</Text> to <Text code>01.001.09</Text><br/>  
                    <Text code>01.032.01</Text> to <Text code>01.032.15</Text><br/>  
                    <Text code>01.042.01</Text> to <Text code>01.042.08</Text><br/>  
                    <Text code>01.042.10</Text><br/>  
                    <Text code>01.050.01</Text> to <Text code>01.050.05</Text><br/>  
                    <Text code>01.050.07</Text> to <Text code>01.050.10</Text><br/>  
                    <Text code>01.092.04</Text> to <Text code>01.092.15</Text><br/>  
                    <Text code>01.113.01</Text> to <Text code>01.113.20</Text><br/>  
                    <Text code>01.115.01</Text> to <Text code>01.115.06</Text><br/>  
                    <Text code>01.143.01</Text> to <Text code>01.143.08</Text><br/>  
                    <Text code>01.154.01</Text> to <Text code>01.154.06</Text><br/>  
                    <Text code>01.185.01</Text> to <Text code>01.185.11</Text><br/>  
                    <Text code>02.012.01</Text> to <Text code>02.012.15</Text><br/>  
                    <Text code>02.027.01</Text> to <Text code>02.027.17</Text><br/>  
                    <Text code>02.033.01</Text> to <Text code>02.033.15</Text><br/>  
                    <Text code>02.035.01</Text> to <Text code>02.035.15</Text><br/>  
                    <Text code>03.059.01</Text> to <Text code>03.059.09</Text><br/>  
                    <Text code>04.050.01</Text> to <Text code>04.050.02</Text><br/>  
                    <Text code>04.050.04</Text> to <Text code>04.050.11</Text><br/>  
                    <Text code>05.083.01</Text> to <Text code>05.084.03</Text><br/>  
                    <Text code>06.006.01</Text> to <Text code>06.006.07</Text><br/>  
                    <Text code>06.071.01</Text> to <Text code>06.071.03</Text><br/>  
                    <Text code>06.071.05</Text> to <Text code>06.071.06</Text><br/>  
                    <Text code>07.049.01</Text> to <Text code>07.049.04</Text><br/>  
                    <Text code>07.061.01</Text> to <Text code>07.061.07</Text><br/>  
                    <Text code>07.083.01</Text> to <Text code>07.083.10</Text><br/>  
                    <Text code>07.088.01</Text> to <Text code>07.088.07</Text><br/>  
                    <Text code>07.103.01</Text> to <Text code>07.103.10</Text><br/>  
                    <Text code>08.007.01</Text> to <Text code>08.007.28</Text><br/>  
                    <Text code>08.007.30</Text> to <Text code>08.007.36</Text><br/>  
                    <Text code>08.048.01</Text> to <Text code>08.048.15</Text><br/>  
                    <Text code>08.071.01</Text> to <Text code>08.071.06</Text><br/>  
                    <Text code>09.112.01</Text> to <Text code>09.112.03</Text><br/>  
                    <Text code>10.014.01</Text> to <Text code>10.014.02</Text><br/>  
                    <Text code>10.014.04</Text> to <Text code>10.014.15</Text><br/>  
                    <Text code>10.018.01</Text> to <Text code>10.018.13</Text><br/>  
                    <Text code>10.034.01</Text> to <Text code>10.034.14</Text><br/>  
                    <Text code>10.071.01</Text> to <Text code>10.071.11</Text><br/>  
                    <Text code>10.085.18</Text> to <Text code>10.085.19</Text><br/>  
                    <Text code>10.085.26</Text> to <Text code>10.085.27</Text><br/>  
                    <Text code>10.085.31</Text> to <Text code>10.085.32</Text><br/>  
                    <Text code>10.085.36</Text><br/>  
                    <Text code>10.085.38</Text><br/>  
                    <Text code>10.085.42</Text><br/>  
                    <Text code>10.085.44</Text><br/>  
                    <Text code>10.085.47</Text><br/>  
                    <Text code>10.108.01</Text> to <Text code>10.108.11</Text><br/>  
                    <Text code>10.117.01</Text> to <Text code>10.117.09</Text><br/>  
                    <Text code>10.127.01</Text> to <Text code>10.127.08</Text><br/>  
                    <Text code>10.129.01</Text> to <Text code>10.129.07</Text><br/>  
                    <Text code>10.146.01</Text> to <Text code>10.146.06</Text><br/>  
                    <Text code>10.168.01</Text> to <Text code>10.168.03</Text>
                </p>
            </div>
    },
    translation_mueller : {
        title: "Müller",
        content:
            <div>
                <p>
                Müller, Max. 1891. Vedic Hymns. Part 1. Hymns to the Maruts, Rudra, Vâyu and Vâta. Sacred Books of the East. Vol. 32. Oxford: Clarendon Press.
                </p>
            </div>
    },
    translation_oldenberg : {
        title: "Oldenberg",
        content:
            <div>
                <p>
                    Oldenberg, Hermann (1897): Vedic Hymns. Part 2. Hymns to Agni (Mandalas I-V). Oxford: Oxford University Press (Sacred books of the East, 46).
                </p>
            </div>
    },
    translation_elizarenkova : {
        title: "Elizarenkova",
        content:
            <div>
                <p>
                    Elizarenkova, Tatʹjana. 1999. Rigveda : Ṛgvēdasaṃhitā. Moscow: Nauk.
                </p>
                <b>Coverage of this translation:</b><br/>
                <p>
                    complete.
                </p>
            </div>
    },
    metaLabels : {
        title: "Pada Labels",
        content:
            <div>
                <p>
                    provided by D. Gunkel and K. Ryan
                </p>
                <table style={{width: 'auto'}}><tbody>
                    <tr><td className="bold">D</td><td>genre D</td></tr>
                    <tr><td className="bold">E2</td><td>epic anuṣṭubh (424)</td></tr>
                    <tr><td className="bold">R</td><td>repeated line</td></tr>
                    <tr><td className="bold">E3a</td><td>epic anuṣṭubh (292)</td></tr>
                    <tr><td className="bold">H</td><td>12 = 5+7, ending LHX|| — a type of hypersyllabic triṣṭubh.</td></tr>
                    <tr><td className="bold">S</td><td>line affected by realignment</td></tr>
                    <tr><td className="bold">V</td><td>Vālakhilya</td></tr>
                    <tr><td className="bold">M</td><td>genre M</td></tr>
                    <tr><td className="bold">4</td><td>12 = 8+4</td></tr>
                    <tr><td className="bold">5</td><td>pentad (decasyllabic), including Arnold’s “pure” and “mixed”; see Oldenberg (1888) 95–8 and Arnold (1905) 238–40.</td></tr>
                    <tr><td className="bold">B</td><td>bhārgavī; see Arnold (1905) 240–1.</td></tr>
                    <tr><td className="bold">h</td><td>11 = 4+7, ending HLX|| — a type of hyposyllabic jagatī.</td></tr>
                    <tr><td className="bold">G</td><td>gautamī; see Arnold (1905) 240–1</td></tr>
                    <tr><td className="bold">O</td><td>Oldenberg's gāyatrī-corpus, cf. Oldenberg (1888: 9f.).</td></tr>
                    <tr><td className="bold">T</td><td>Trochaic gāyatrī; see Oldenberg (1888) 25 and Vedic Metre (Arnold, 1905) 165.</td></tr>
                    <tr><td className="bold">U</td><td>uneven lyric; see Arnold (1905) 154, 244 (Appendix III).</td></tr>
                    <tr><td className="bold">4b</td><td>11 = 8+3</td></tr>
                    <tr><td className="bold">v</td><td>virāṭsthānā; see Oldenberg (1888) 86–95 and Arnold (1905) 240–1, 246.</td></tr>
                    <tr><td className="bold">P</td><td>popular</td></tr>
                    <tr><td className="bold">E1</td><td>epic anuṣṭubh (525)</td></tr>
                    <tr><td className="bold">E3b</td><td>epic anuṣṭubh (380)</td></tr>
                </tbody></table>

                <p>
                    Arnold, Edward Vernon.
                    Vedic Metre in Its Historical Development.
                    Cambridge: Cambridge University Press, 1905.
                    <a href="http://archive.org/details/vedicmetreinitsh00arnouoft" target="_blank" rel="noopener noreferrer"> http://archive.org/details/vedicmetreinitsh00arnouoft</a>
                </p>
                <p>
                    Oldenberg, Hermann.
                    Die Hymnen Des Ṛigveda, 1: Metrische Und Textgeschichtliche Prolegomena. Die Hymnen Des Ṛigveda.
                    Berlin: Hertz, 1888.
                    <a href="https://archive.org/details/OldenbergRigvedaV11888/page/n7" target="_blank" rel="noopener noreferrer"> https://archive.org/details/OldenbergRigvedaV11888/page/n7</a>
                </p>
            </div>
    },
    metaStrata : {
        title: "Stanza Strata",
        content:
            <div>
                <p>
                    Arnold, Edward Vernon.
                    Vedic Metre in Its Historical Development.
                    Cambridge: Cambridge University Press, 1905. Appendix IV (pp.269ff.).
                    <a href="http://archive.org/details/vedicmetreinitsh00arnouoft" target="_blank" rel="noopener noreferrer"> http://archive.org/details/vedicmetreinitsh00arnouoft</a>
                </p>
                <table style={{width: 'auto'}}><tbody>
                    <tr><td className="bold">A</td><td>Archaic</td></tr>
                    <tr><td className="bold">a</td><td>Archaic on metrical evidence alone</td></tr>
                    <tr><td className="bold">S</td><td>Strophic</td></tr>
                    <tr><td className="bold">s</td><td>Strophic on metrical evidence alone</td></tr>
                    <tr><td className="bold">N</td><td>Normal</td></tr>
                    <tr><td className="bold">n</td><td>Normal on metrical evidence alone</td></tr>
                    <tr><td className="bold">C</td><td>Cretic</td></tr>
                    <tr><td className="bold">c</td><td>Cretic on metrical evidence alone</td></tr>
                    <tr><td className="bold">P</td><td>Popular for linguistic reasons, and possibly also for non-linguistic reasons</td></tr>
                    <tr><td className="bold">p</td><td>Popular for non-linguistic reasons</td></tr>
                </tbody></table>
            </div>
    },
    metaAdrGroup : {
        title: "Hymn Addressees / Hymn Groups",
        content:
            <div>
                <p>
                    Geldner, Karl Friedrich. <i>Der Rig-Veda. Aus dem Sanskrit ins Deutsche übersetzt und mit einem laufenden Kommentar versehen von Karl Friedrich Geldner.</i> Cambridge (Mass.) [repr. 2003]: Harvard Univ. Pr., 1951.
                </p>
            </div>
    },
    dict_grassmann : {
        title: "Graßmann dictionary references",
        content:
            <div>
                <p>
                    Links to entries in Graßmann's dictionary have been generated automatically and may be erroneous in some cases. Corrections will constantly be added and updated.
                </p>
            </div>
    }
};


class HelpButton extends Component {

    state = { visible: false }

    showModal = () => {
        if (helpTexts.hasOwnProperty(this.props.type)){
            this.setState({
                visible: true,
            });
        } else {
            console.log("Error: '" + this.props.type + "' is not a valid help text type, so i won't open the help view.")
        }
    }

    hideModal = () => {
        this.setState({
            visible: false,
        });
    }

    render() {

        if (this.props.hidden) return null;

        const modalHeader = !helpTexts.hasOwnProperty(this.props.type) ? "" :
            <div className="secondary-font red bold">
                <img
                src={help}
                alt=""
                style={{height:"32px", paddingRight:"1rem"}}/>
                <span className="font-big" style={{verticalAlign:"middle"}}>
                    {helpTexts[this.props.type].title}
                </span>
            </div>;

        const containerStyle = Object.assign({
            textAlign: this.props.align ? this.props.align : "right",
            float: this.props.float ? (this.props.align === undefined ? "right" : this.props.align) : "none",
            display: this.props.inline ? "inline" : "block"
        }, this.props.style);

        const iconStyle = Object.assign({
            verticalAlign: "middle",
            fontSize: "90%"
        }, this.props.iconStyle || {});


        return (
            
            <div style={containerStyle}>

                <div className="help-button-container" onClick={this.showModal}>

                    { this.props.label && (!this.props.labelPosition || this.props.labelPosition === "left") &&
                        <span className="help-button-label">{this.props.label}</span>
                    }

                    <Icon
                    type="question-circle"
                    theme="outlined"
                    className="help-button-icon"
                    style={iconStyle}
                    title={this.props.title || (helpTexts[this.props.type] ? "Show help: \"" + helpTexts[this.props.type].title + "\"" : "")} />

                    { this.props.label && this.props.labelPosition === "right" &&
                        <span className="help-button-label">{this.props.label}</span>
                    }

                </div>
                
                <Modal
                title={modalHeader}
                centered
                footer={null}
                maskClosable={true}
                visible={this.state.visible}
                onOk={this.hideModal}
                onCancel={this.hideModal}
                okText="OK">
                    {helpTexts[this.props.type] ? helpTexts[this.props.type].content : ""}
                </Modal>
            </div>
        );

    }

}

export default HelpButton;