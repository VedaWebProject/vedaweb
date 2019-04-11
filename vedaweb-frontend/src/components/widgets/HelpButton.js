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
                    Define a word form or lemma (optional) and select a property (like case, number, person, etc.)
                    and the value you are looking for (optional). You may add more properties to your search term by clicking the <Text code>+</Text> button to the right.
                </p>
                <p>
                    It's also possible to use <strong>wildcards</strong> (just like in the <i>Quick search</i> at the top of the page),
                    i.e. searching for <Text code>agn*</Text> would match all word forms or lemmas starting with <i>agn</i>.
                </p>
                <p>
                    To add more than one word form or lemma to find in a stanza, click on the <Text code>+</Text> button below.
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
                <h4>Accent-sensitive search</h4>
                <p>
                    If you use accent-sensitive search, you will only find stanzas matching your exact use of accented vowels,
                    whereas if you disable accent-sensitive search, accents will be ignored, <i>even if you use them</i>.
                </p>
                <h4>Wildcards</h4>
                <p>
                    It is possible to search for words starting or ending with a certain substring.
                    Searching for <Text code>agni*</Text> will find <Text code>agnim</Text>, <Text code>agniḥ</Text>, <Text code>agnināgniḥ</Text>, and so on - so the Asterisk (<Text code>*</Text>)
                    works as a simple placeholder. You can use this in the beginning (<Text code>*dāḥ</Text>), the end (<Text code>agni*</Text>)
                    or both (<Text code>*dak*</Text>).
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
            </div>
    },
    accentSensitive : {
        title: "Accent-sensitive Search",
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
    version_devanagari : {
        title: "Devanagari",
        content:
            <div>
                <p>
                    Devanagari version based on the Samhita-text by Aufrecht and Van Nooten &amp; Holland, provided by Detlef Eichler.<br/>
                    <a href="http://www.detlef108.de/Rigveda.htm" target="_blank" rel="noopener noreferrer">http://www.detlef108.de/Rigveda.htm</a>
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
            </div>
    },
    version_aufrecht : {
        title: "Aufrecht",
        content:
            <div>
                <p>
                    Aufrecht, Theodor. 1955. Die Hymnen des Rigveda. Erster Teil. Mandala I-VI. Darmstadt: Wissenschaftliche Buchgesellschaft. UND Aufrecht, Theodor. 1955. Die Hymnen des Rigveda. Zweiter Teil. Mandala VII-X. Darmstadt: Wissenschaftliche Buchgesellschaft.
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
            </div>
    },
    translation_renou : {
        title: "Renou",
        content:
            <div>
                <p>
                    Renou, Louis. (1955-1964) Études védiques et pāṇinéennes (several vols). Paris: Boccard.
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
            </div>
    },
    translation_grassmann : {
        title: "Graßmann",
        content:
            <div>
                <p>
                    Graßmann, Hermann. 1876, 1877. Rig-Veda (Vol 1 and 2). Leipzig.
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
            </div>
    },
    translation_macdonell : {
        title: "MacDonell",
        content:
            <div>
                <p>
                    MacDonell, Arthur A. 1922. Hymns from the Rigveda. Selected and Metrically Translated. London: Oxford University Press.
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
                    <tr><td className="bold">5</td><td>pentad (decasyllabic), including Arnold’s “pure” and “mixed”; see Prolegomena 95–8 and VM 238–40.</td></tr>
                    <tr><td className="bold">B</td><td>bhārgavī; see VM 240–1.</td></tr>
                    <tr><td className="bold">h</td><td>11 = 4+7, ending HLX|| — a type of hyposyllabic jagatī.</td></tr>
                    <tr><td className="bold">G</td><td>gautamī; see VM 240–1</td></tr>
                    <tr><td className="bold">O</td><td>Oldenberg's gāyatrī-corpus, cf. Oldenberg (1888: 9f.).</td></tr>
                    <tr><td className="bold">T</td><td>Trochaic gāyatrī; see Prolegomena 25 and Vedic Metre (VM) 165.</td></tr>
                    <tr><td className="bold">U</td><td>uneven lyric; see VM 154, 244 (Appendix III).</td></tr>
                    <tr><td className="bold">4b</td><td>11 = 8+3</td></tr>
                    <tr><td className="bold">v</td><td>virāṭsthānā; see Prolegomena 86–95 and VM 240–1, 246.</td></tr>
                    <tr><td className="bold">P</td><td>popular</td></tr>
                    <tr><td className="bold">E1</td><td>epic anuṣṭubh (525)</td></tr>
                    <tr><td className="bold">E3b</td><td>epic anuṣṭubh (380)</td></tr>
                </tbody></table>
            </div>
    },
    metaStrata : {
        title: "Stanza Strata",
        content:
            <div>
                <p>
                    Arnold, Edward Vernon.
                    'Sketch of the Historical Grammar of the Rig and Atharva Vedas'. 
                    Journal of the American Oriental Society 18 (1897): 203–352.
                    <a href="https://www.jstor.org/stable/592303" target="_blank" rel="noopener noreferrer"> https://www.jstor.org/stable/592303</a>
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

        const modalHeader = !helpTexts.hasOwnProperty(this.props.type) ? "" :
            <div className="secondary-font red bold">
                <img
                src={help}
                alt=""
                style={{height:"32px", paddingRight:"1rem"}}/>
                <span style={{verticalAlign:"middle"}}>
                    {helpTexts[this.props.type].title}
                </span>
            </div>;

        const containerStyle = {
            textAlign: this.props.align ? this.props.align : "right",
            float: this.props.float ? (this.props.align === undefined ? "right" : this.props.align) : "none",
            display: this.props.inline ? "inline" : "block"
        }

        //apply styles from props
        for(var style in this.props.style) containerStyle[style] = this.props.style[style];

        return (
            
            <span style={containerStyle}>
                <Icon
                type="question-circle"
                theme="outlined"
                className="help-button-icon"
                onClick={this.showModal}
                title={helpTexts[this.props.type] !== undefined ? "Show help: \"" + helpTexts[this.props.type].title + "\"" : undefined} />
                
                <Modal
                title={modalHeader}
                centered
                footer={null}
                maskClosable={true}
                visible={this.state.visible}
                onOk={this.hideModal}
                onCancel={this.hideModal}
                okText="OK">
                    {helpTexts[this.props.type].content}
                </Modal>
            </span>
        );

    }

}

export default HelpButton;