import React, { Component } from "react";
import { Icon, Button } from 'antd';
import HelpButton from "../help/HelpButton";


class AboutContent extends Component {

    render() {

        return (

            <div>
                <h1><Icon type="bulb"/> About VedaWeb</h1>

                <p>
                    Here you find information on the state of development and recent changes.<br/>
                    To get help on the different features, look out for the <HelpButton type="start" inline/> buttons throughout the page.
                </p>

                <p>
                    The public repository containing the data used for the VedaWeb platform can be found <a href="https://github.com/VedaWebProject/vedaweb-data" target="_blank">here</a>.
                </p>

                <br/>

                <h2><Icon type="message"/> Feedback</h2>
                <p>
                    Feel free to send us your <strong>feedback on functionality, usability and data correctness:</strong>
                    <br/><br/>
                    <Button
                    type="primary"
                    href={"mailto:veda-web@uni-koeln.de?subject=VedaWeb feedback"}
                    className="secondary-font">
                        <Icon type="mail" /> veda-web@uni-koeln.de
                    </Button>
                    <br/><br/>
                    Thank you for using <span className="secondary-font red bold">VedaWeb</span>!
                </p>

                <h2><Icon type="hourglass"/> Upcoming features</h2>
                <ul>
                    <li>Annotation of present stem classes</li>
                </ul>

                <h2><Icon type="issues-close"/> Previously added features (excluding technical improvements and fixes)</h2>
                <ul>
                    <li>Corrected and extended morphological annotations in book 08-10 (2024/10/17)</li>
                    <li>Annotation of denominative and gerundive in book 1-10 (2024/10/17)</li>
                    <li>Review of lemmatization and references to Grassmann dictionary in book 1-10 (2024/10/17)</li>
                    <li>Corrected and extended morphological annotations in book 1 to book 7 (2023/07/07)</li>
                    <li>Grammar search values for participles including -ta and -na, local particles, intensives, causatives, -si imperatives, comparatives and superlatives (PTCP, PTCP-ta, PTCP-na, LP, INT, CAUS, IMP-si, CMP, SUP) (2023/07/07)</li>
                    <li>Revised English translation by Griffith (2023/07/07)</li>
                    <li>Revised French translation by Renou (2023/07/07)</li>
                    <li>Revised German translations by Grassmann and Geldner (2023/07/07)</li>
                    <li>Revised Russian translation by Elizarenkova (2023/07/07)</li>
                    <li>Revised references to Grassmann’s dictionary for frequent lemmata (with frequency of 10 times or more in Rigveda) (2023/07/07)</li>
                    <li>Updated overview of stanza coverage of versions and translations (2023/07/07)</li>
                    <li>Updated <a href="https://github.com/VedaWebProject/vedaweb-data" target="_blank">data repository containing all the textual data (csv and xml-TEI) employed in VedaWeb</a> (2023/07/07)</li>
                    <li>Updated <a href="https://github.com/VedaWebProject/tei-transformations" target="_blank">code repository containing the source code for the TEI transformations</a> (2023/07/07)</li>
                    <li>New references to scans of Delbrück's <i>Altindische Syntax</i> (1888) comments (2023/04/17)</li>
                    <li>Technical improvements & help text filter function (2020/11/17)</li>
                    <li>Display and filter by markings of possible late additions (2020/10/30)</li>
                    <li>New "Help &amp; Instructions" section (2020/08/18)</li>
                    <li>Added English translation by Müller (2020/08/05)</li>
                    <li>Added English translation by Oldenberg (2020/08/05)</li>
                    <li>New advanced search mode "Metrical Position" (2020/07/24)</li>
                    <li>New grammar search value for 'non-finite': 'PPP' (2020/07/20)</li>
                    <li>References to Scans of Ludwig's comments (2020/07/02)</li>
                    <li>New generic grammar attribute vaule in Grammar Search: "any" (2020/06/05)</li>
                    <li>Precise translation/version coverage data in help texts (2020/06/03)</li>
                    <li>Integrated possible corrections to Graßmann's dictionary entries (2020/05/23)</li>
                    <li>Added translation: Elizarenkova, Tatʹjana. 1999. Rigveda : Ṛgvēdasaṃhitā. Moscow: Nauk. (2020/05/14)</li>
                    <li>Added text version: Devanagari version provided by Mārcis Gasūns. (2020/05/14)</li>
                    <li>Improved structure and positioning of global search settings (2020/03/04)</li>
                    <li>References to Scans of Oldenberg's comments (2020/03/02)</li>
                    <li>Added logic and view for references to external resources (2020/03/02)</li>
                    <li>Fixed bugs in ISO-15919 metrical data parsing algorithm (2020/02/11)</li>
                    <li>Fixed ISO-15919 lemma sorting in dictionary view (2020/02/07)</li>
                    <li>Improved Condensed reading view (2019/10/11)</li>
                    <li>Improved Quick Search: RegEx now match a whole stanza (2019/10/11)</li>
                    <li>Made metrical data searchable in Advanced Search (2019/10/02)</li>
                    <li>Re-designed navigational controls layout (2019/08/28)</li>
                    <li>Increased number of possible grammar properties in Grammar Search (2019/06/06)</li>
                    <li>Separate search fields for form and lemma in Grammar Search (2019/06/06)</li>
                    <li>Additional grammar properties (CVB, DES, PREC) integrated into Grammar Search (2019/06/06)</li>
                    <li>Improved condensed reading view (2019/06/06)</li>
                    <li>Export functionality for search results (2019/06/08)</li>
                    <li>Open API documentation via SwaggerUI (2019/06/08)</li>
                    <li>Display metrical parsing for different text versions (2019/08/19)</li>
                    <li>Improved content navigation and data toggling controls (2019/08/28)</li>
                    <li>Metrical data is now searchable via Metrical Search (2019/10/02)</li>
                    <li>Improved RegEx functionality in Quick Search (2019/10/04)</li>
                    <li>Added this manual feature changelog (2019/10/22)</li>
                    <li>Added stanza types meta data based on metrical parse (2019/10/22)</li>
                </ul>

            </div>

        );
    }
}

export default AboutContent;
