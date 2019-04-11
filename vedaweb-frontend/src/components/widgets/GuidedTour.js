import React, { Component } from "react";
import { withRouter } from 'react-router-dom';

import { Icon } from 'antd';
import Tour from './Tour';


class GuidedTour extends Component {

    render() {

        const tourCheckpoints = [
            {
                id: "nav-browse",
                title: "Browse the Rigveda",
                text: "Jump right into one of the books using this button!",
                icon: <Icon type="book"/>,
                execBefore: () => this.props.history.replace("/view/index/0")
            },
            {
                id: "quick-search",
                title: "Quick search",
                text: "This is the Quick Search. It's always accessible on top of the page and lets you search for the right data in many different, efficient ways. Click the help button to the right to learn about the details. It has more features than you might think!",
                icon: <Icon type="search"/>,
                execBefore: () => this.props.history.replace("/view/index/0")
            },
            {
                id: "quick-search-osk",
                title: "ISO-15919 on-screen keyboard",
                text: "Our data is transliterated in ISO-15919. If you don't want to use Harvard-Kyoto or SLP1 as an intermediate transliteration scheme for your search, the Quick Search (and any other search input fields in VedaWeb) has this small button that toggles an on-screen keyboard to directly type ISO-15919 characters.",
                icon: <Icon type="edit"/>,
                execBefore: () => this.props.history.replace("/view/index/0")
            },
            {
                id: "content-location",
                title: "Stanza navigation",
                text: "You'll find this atop any stanza you open. By choosing a different location, you will be redirected to it. You can also click the arrows for next/previous stanza or even use the arrow keys on your keyboard!",
                icon: <Icon type="book"/>,
                execBefore: () => this.props.history.replace("/view/index/0")
            },
            {
                id: "toggle-content",
                title: "Select what you want to see",
                text: "By clicking here here, you can toggle on/off all the different kinds of data views for the current stanza!",
                icon: <Icon type="eye-o"/>,
                execBefore: () => this.props.history.replace("/view/index/0")
            },
            {
                id: "toggle-export",
                title: "Export stanza data",
                text: "Click here to choose an export format and download the currently selected data!",
                icon: <Icon type="export"/>,
                execBefore: () => this.props.history.replace("/view/index/0")
            },
            {
                id: "nav-search",
                title: "Advanced search",
                text: "This is how you get to the advanced search modes (e.g. Grammar Search) and some extra search settings. Let's have a look at what you can do there...",
                icon: <Icon type="search"/>,
                execBefore: () => this.props.history.replace("/view/index/0")
            },
            {
                id: "search-settings",
                title: "General search settings",
                text: "The first thing you should do when using the advanced search is to set an input transliteration scheme and decide whether you want your search to be accent-sensitive. Use the small '?'-buttons to understand what that means exactly.",
                icon: <Icon type="tool"/>,
                execBefore: () => this.props.history.replace("/search")
            },
            {
                id: "search-modes",
                title: "The search modes",
                text: "Here you can choose which one of the \"advanced\" search modes you want to use. The Grammar Search, for example, let's you define multiple word forms or lemmas with associated grammatical features to search for.",
                icon: <Icon type="search"/>,
                execBefore: () => this.props.history.replace("/search")
            },
            {
                id: "search-filters",
                title: "Additional search filters",
                text: "These filters apply to all of the \"advanced\" search modes. They help you to narrow down your search based on text sections or meta data.",
                icon: <Icon type="filter"/>,
                execBefore: () => this.props.history.replace("/search")
            },
            {
                id: "help-buttons",
                title: "The help buttons",
                text: "Don't forget to use the little help buttons you can find everywhere. They provide detailed information on all aspects of VedaWeb!",
                icon: <Icon type="question-o"/>,
                execBefore: () => this.props.history.replace("/view/index/0")
            },
            {
                id: "nav-tour",
                title: "That's about it",
                text: "Thank you for taking the guided tour! Whenever you want to repeat it, just click here!",
                icon: <Icon type="smile-o"/>,
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