import React, { Component } from "react";
import { Input, Select, Tooltip } from 'antd';

import { view } from 'react-easy-state';
import stateStore from "../../../stateStore";

import HelpButton from "../../widgets/HelpButton";
import TransliterationPreview from "../../widgets/TransliterationPreview";
import OSK from "../../widgets/OSK";

import './SearchMetricalPosition.css'

const { Option } = Select;



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

        const selectBefore = (
            <Select
            defaultValue={1}
            value={stateStore.search.metricalPosition.position}
            onSelect={(value, option) => stateStore.search.metricalPosition.position = value}
            style={{ width: '220px' }}
            className="secondary-font">
                {[...Array(10).keys()].map(i => 
                    <Option
                    key={'metrical_position_' + (i + 1)}
                    value={(i + 1)}>
                        {/* This will be good ... */}
                        {
                            (i + 1)
                            + (i === 0
                                ? "st"
                                : (i === 1
                                    ? "nd"
                                    : (i === 2
                                        ? "rd"
                                        : "th")))
                            + " position"
                        }
                    </Option>
                )}
            </Select>
        );

        return (
            <div className="search-container">

                <HelpButton
                type="metricalPositionSearch"
                label="Search for a single term in a certain metrical position (based on Van Nooten & Holland). Click here for more help!"
                inline/>

                <div className="top-gap">

                    <Tooltip
                    title={transliteration}
                    overlayClassName="transliteration-tooltip"
                    trigger="focus"
                    placement="bottom">

                        <Input
                        value={stateStore.search.metricalPosition.input}
                        onChange={e => stateStore.search.metricalPosition.input = e.target.value}
                        addonBefore={selectBefore}
                        title=""
                        prefix={<OSK value={stateStore.search.metricalPosition.input} updateInput={v => stateStore.search.metricalPosition.input = v}/>}
                        size="large"
                        placeholder="agnim" />

                    </Tooltip>

                </div>
            </div>
        );
    }
}

export default view(SearchMetricalPosition);