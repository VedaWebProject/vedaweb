import React, { Component } from "react";
import { withRouter } from 'react-router-dom';

import { Icon } from 'antd';
import Tour from './Tour';


class GuidedTour extends Component {

    render() {

        const tourCheckpoints = [
            {
                id: "nav-browse",
                title: "Browse Rigveda",
                text: "Jump right into one of the books using this button!",
                icon: <Icon type="book"/>,
                execBefore: () => this.props.history.replace("/view/index/0")
            },
            {
                id: "quick-search",
                title: "Quick Search",
                text: "This is the Quick Search. It's always accessible on the top of the page and lets you search the data in many different, efficient ways. Click the help button to the right to learn about the details.",
                icon: <Icon type="search"/>,
                execBefore: () => this.props.history.replace("/view/index/0")
            },
            {
                id: "quick-search-osk",
                title: "ISO-15919 On-screen Keyboard",
                text: "Our data is transliterated in ISO-15919. If you don't want to use Harvard-Kyoto or SLP1 as an intermediate transliteration scheme for your search, the Quick Search (and any other search input fields in VedaWeb) has this small button that toggles an on-screen keyboard to directly type ISO-15919 characters.",
                icon: <Icon type="edit"/>,
                execBefore: () => this.props.history.replace("/view/index/0")
            },
            {
                id: "nav-search",
                title: "Advanced Search",
                text: "This is how you get to the advanced search modes (e.g. Grammar Search) and some extra search settings.",
                icon: <Icon type="search"/>,
                execBefore: () => this.props.history.replace("/view/index/0")
            },
            {
                id: "content-location",
                title: "Stanza Navigation",
                text: "You'll find this atop any stanza you open. By choosing a different location, you will be redirected to it. You can also click the arrows for next/previous stanza or use the arrow keys on your keyboard!",
                icon: <Icon type="book"/>,
                execBefore: () => this.props.history.replace("/view/index/0")
            },
            {
                id: "toggle-content",
                title: "Toggle Content",
                text: "By clicking here here, you can toggle on/off all the different kinds of data views for the current stanza!",
                icon: <Icon type="eye-o"/>,
                execBefore: () => this.props.history.replace("/view/index/0")
            },
            {
                id: "toggle-export",
                title: "Export Stanza Data",
                text: "Click here to choose an export format and download the currently selected data!",
                icon: <Icon type="export"/>,
                execBefore: () => this.props.history.replace("/view/index/0")
            },
            {
                id: "nav-tour",
                title: "The Guided Tour",
                text: "Whenever you want to repeat this tour, just click here!",
                icon: <Icon type="notification"/>,
                execBefore: () => this.props.history.replace("/view/index/0")
            },
        ];

        return (

            <Tour
            checkpoints={tourCheckpoints}
            enabled={this.props.enabled}
            onCloseTour={this.props.onCloseTour}
            bubbleTitleStyle={{fontSize: "110%", fontWeight: "normal", color: "#931111"}}
            bubbleIconStyle={{color: "#931111"}}
            config={{
                progressBarColor: "#931111",
            }}/>
            
        );
    }
}

export default withRouter(GuidedTour);