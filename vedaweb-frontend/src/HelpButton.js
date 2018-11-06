import React, { Component } from "react";
import { Icon, Modal } from 'antd';
import help from "./img/help.png";

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
    grammarSearch : {
        title: "Grammar Search",
        content:
            <div>
                <p>
                    Using the grammar search, you can find verses containing terms with certain grammatical properties.
                </p>
                <p>
                    Define a search term (optional) and select an attribute (like case, number, person, etc.)
                     and the value you are looking for (this is also optional). You may add multiple properties 
                     for the term by clicking the plus-button to the right.
                </p>
                <p>
                    To add more than one term to find in a verse, click on the plus-button below. This will display 
                    another block which lets you define the additional term.
                </p>
            </div>
    },
    searchScope : {
        title: "Search Range",
        content:
            <div>
                <p>
                    The search range setting lets you specify ranges of books (and hymns) to limit the search to. 
                    You may add more ranges by clicking the plus-button to the right of each line.
                </p>
            </div>
    },
    searchMetaFilters : {
        title: "Meta Filters",
        content:
            <div>
                <p>
                    By setting up meta filters, you can limit your search to verses matching the specified meta properties.
                </p>
                <p>
                    It is possible to select multiple values per property. The results will only contain verses 
                    that match one of the selected values of each property specified!
                </p>
            </div>
    },
    zurichIso : {
        title: "Rigveda from Zürich",
        content:
            <div>
                <p>
                    This is the Rigveda text from Zürich.
                </p>
            </div>
    },
    zurichGlossing : {
        title: "Morphological glossings from Zürich",
        content:
            <div>
                <p>
                    These are morphological glossings from Zürich.
                </p>
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
                <h2>Verse location:</h2>
                <p>
                    Just type a Rigveda verse location in the form of <strong>1.2.3</strong> or <strong>01.002.03</strong> or 
                    even <strong>0100203</strong> to be redirected to this verse's page without further detours.
                </p>
                <h2>Simple text search:</h2>
                <p>
                    By setting the place to search in to <strong>Rigveda</strong> or <strong>Translation</strong>,
                    you can search for words in the Rigveda verses or in their translations, respectively. It's also possible
                    to search for <strong>multiple words</strong> at once, in which case the <strong>verses containing the most</strong> of what you are looking
                    for will be <strong>ranked higher</strong> in the search results.
                </p>
                <h2>Transliteration</h2>
                <p>
                    If you search for terms in the Rigveda verses, you can <strong>use a transliteration method of your choice</strong>.
                    Our data is in ISO-15919, but your search input can be transliterated from several other standards to ISO-15919.
                    The <strong>default setting is Harvard-Kyoto (HK)</strong>, but you can change this in the <strong>Advanced Search Settings</strong>.
                </p>
                <h2>Wildcards</h2>
                <p>
                    It is possible to search for words starting or ending with a certain substring.
                    Searching for <strong>agni*</strong> will find agnim, agniḥ, agnināgniḥ, and so on - so the Asterisk (<strong>*</strong>)
                    works as a simple placeholder. You can use this in the beginning (<strong>*dāḥ</strong>), the end (<strong>agni*</strong>)
                    or both (<strong>*dak*</strong>).
                </p>
                <h2>Logical operators</h2>
                <p>
                    Using the <strong>AND</strong> and <strong>OR</strong> operators, you can construct little logical statements.
                    Searching for <strong>agnim OR indra</strong>, you'll find every verse containing one of the words <strong>agnim</strong> or <strong>indra</strong>.
                    The same works for the <strong>AND</strong> operator: <strong>agnim AND indra</strong> will give you the verses containing both words.
                </p>
                <h2>Required and prohibited terms</h2>
                <p>
                    With <strong>+</strong> and <strong>-</strong>, you can specify terms that <strong>must</strong> or <strong>must not</strong> occur in a verse to be found.
                    So, for example, <strong>agnim -indra</strong> finds verses containing <strong>agnim</strong> and not containing <strong>indra</strong>,
                    while <strong>agnim +indra</strong> finds verses that <i>might</i> contain <strong>agnim</strong> but defenitely contain <strong>indra</strong>.
                </p>
            </div>
    },
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
            textAlign: this.props.align === undefined ? "right" : this.props.align,
            float: this.props.float === undefined ? "none" : (this.props.align === undefined ? "right" : this.props.align)
        }

        //apply styles from props
        for(var style in this.props.style) containerStyle[style] = this.props.style[style];

        return (
            
            <div style={containerStyle}>
                <Icon
                type="question-circle"
                theme="outlined"
                onClick={this.showModal}
                title={helpTexts[this.props.type] !== undefined ? "Show help: \"" + helpTexts[this.props.type].title + "\"" : undefined}
                style={{cursor:"pointer", margin:"0", color: '#aaa'}}/>
                
                {this.state.visible &&
                    <Modal
                    title={modalHeader}
                    centered
                    footer={null}
                    visible={this.state.visible}
                    onOk={this.hideModal}
                    onCancel={this.hideModal}
                    okText="OK">
                        {helpTexts[this.props.type].content}
                    </Modal>
                }
            </div>
        );

    }

}

export default HelpButton;