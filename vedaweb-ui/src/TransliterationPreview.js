import React, { Component } from "react";
import Sanscript from 'sanscript';


class TransliterationPreview extends Component {


    render() {

        return (

            <div class="transliteration">
                {Sanscript.t(this.props.input, this.props.transliteration, "devanagari")}
            </div>
            
        );
    }
}

export default TransliterationPreview;