import React, { Component } from "react";
import Sanscript from 'sanscript';

import "./css/TransliterationPreview.css";

class TransliterationPreview extends Component {

    render() {

        return (

            <div className="transliteration">
                {(this.props.input !== null && this.props.input.length > 0) &&
                    Sanscript.t(this.props.input, this.props.transliteration, "iso")
                }
                {/*<br/><br/>{
                    Sanscript.t(this.props.input, this.props.transliteration, "devanagari")
                }*/}
                {(this.props.input === null || this.props.input.length) === 0 &&
                    <span>...</span>
                }
            </div>
            
        );
    }
}

export default TransliterationPreview;