import React, { Component } from "react";
import SanscriptAccents from './SanscriptAccents';

import "./css/TransliterationPreview.css";

class TransliterationPreview extends Component {

    render() {

        return (

            <div className="transliteration text-font">
                {(this.props.input !== null && this.props.input.length > 0) &&
                    SanscriptAccents.t(this.props.input, this.props.transliteration, "iso")
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