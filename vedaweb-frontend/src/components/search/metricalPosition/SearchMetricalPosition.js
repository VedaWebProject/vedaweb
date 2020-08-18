import React, { Component } from "react";
import { Input, Tooltip } from 'antd';

import { view } from 'react-easy-state';
import stateStore from "../../../stateStore";

import HelpButton from "../../help/HelpButton";
import TransliterationPreview from "../../widgets/TransliterationPreview";
import OSK from "../../widgets/OSK";

import './SearchMetricalPosition.css';



class SearchMetricalPosition extends Component {

    // constructor(props){
    //     super(props);
    // }

    // componentDidMount(){
    // }


    render() {

        const transliteration = (
            <TransliterationPreview
            input={stateStore.search.metricalPosition.input}
            transliteration={stateStore.settings.transliteration}/>
        );

        return (
            <div className="search-container">

                Search for terms in certain metrical positions (based on Van Nooten & Holland)<br/>
                by prepending a digit representing the metrical position to the respective term.

                <HelpButton
                type="metricalPositionSearch"
                label="Click here for more guidance!" />

                <div className="top-gap">

                    <Tooltip
                    title={transliteration}
                    overlayClassName="transliteration-tooltip"
                    trigger="focus"
                    placement="bottom">

                        <Input
                        value={stateStore.search.metricalPosition.input}
                        onChange={e => stateStore.search.metricalPosition.input = e.target.value}
                        prefix={<OSK value={stateStore.search.metricalPosition.input} updateInput={v => stateStore.search.metricalPosition.input = v}/>}
                        size="large"
                        placeholder="Example input: 4devám 6r̥tvíjam" />

                    </Tooltip>

                </div>
            </div>
        );
    }
}

export default view(SearchMetricalPosition);