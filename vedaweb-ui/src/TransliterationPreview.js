import React, { Component } from "react";
import Sanscript from 'sanscript';

import "./css/TransliterationPreview.css";

class TransliterationPreview extends Component {

    constructor(props){
        super(props);

        let iso = JSON.parse(JSON.stringify(Sanscript.schemes.iast));
        //let iso = this.extend(Sanscript.schemes.iast, {});
        iso.vowels = 'a ā i ī u ū r̥ r̥̄ l̥ l̥̄ ē e ai ō o au'.split(' ');
        iso.other_marks = ['ṁ', 'ḥ', '~'];
        Sanscript.addRomanScheme ('iso', iso);
    }

 
    extend(){
        for(var i=1; i<arguments.length; i++)
            for(var key in arguments[i])
                if(arguments[i].hasOwnProperty(key)) { 
                    if (typeof arguments[0][key] === 'object'
                        && typeof arguments[i][key] === 'object')
                                 this.extend(arguments[0][key], arguments[i][key]);
                    else
                       arguments[0][key] = arguments[i][key];
                 }
        return arguments[0];
    }


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