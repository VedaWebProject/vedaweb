import React, { Component } from "react";
import { Checkbox } from 'antd';

import HelpButton from "../../widgets/HelpButton";
import SearchTransliteration from "./SearchTransliteration";

import stateStore from "../../../stateStore";
import { view } from 'react-easy-state';


class SearchSettings extends Component {


    render() {

        const flexContainerStyle = {display: 'flex', width: "100%", margin: '.3rem 0'};
        const flexItemLabelStyle = {minWidth: "180px", maxWidth: "180px", whiteSpace: "nowrap"};
        const flexItemControlStyle = {flexGrow: "1", whiteSpace: "nowrap", overflow:"hidden", textOverflow:"ellipsis"};

        return (

            <div>

                <div style={flexContainerStyle}>
                    <div style={flexItemLabelStyle}>
                        Input method
                        <HelpButton
                        inline
                        type="transliteration"
                        style={{marginLeft: '.5rem'}} />
                    </div>
                    <div style={flexItemControlStyle}>
                        <SearchTransliteration
                        size="small"
                        style={{ width: "100%", maxWidth: '100%' }} />
                    </div>
                </div>
            
                <div style={flexContainerStyle}>
                    <div style={flexItemLabelStyle}>
                        Accent-sensitive
                        <HelpButton
                        type="accentSensitive"
                        inline
                        style={{marginLeft: '.5rem'}} />
                    </div>
                    <div style={flexItemControlStyle}>
                        <Checkbox
                        onChange={e => stateStore.settings.accents = e.target.checked}
                        checked={stateStore.settings.accents}/>
                    </div>
                </div>

            </div>

        );

    }
}

export default view(SearchSettings);