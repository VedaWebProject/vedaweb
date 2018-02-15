import React, { Component } from "react";
import { Grid, Button, Icon } from 'semantic-ui-react';

import SearchBlock from "./SearchBlock";

import './SearchBlockList.css'


class SearchBlockList extends Component {

    constructor(props){
        super(props);

        this.state = {
            searchBlocks: []
        };

        this.addBlock = this.addBlock.bind(this);
        this.removeBlock = this.removeBlock.bind(this);
    }

    componentDidMount(){
        this.addBlock();
    }

    addBlock(){
        var bid = Date.now();
        this.setState({
            searchBlocks : this.state.searchBlocks.concat({'blockId': bid})
        });
    }

    removeBlock(b){
        this.setState({
            searchBlocks: this.state.searchBlocks.slice(0, -1)
        });
    }

    render() {
        return (
            
            <Grid className="search-block-list">

                {this.state.searchBlocks.map(block => (
                    <Grid.Column width="16">
                        <SearchBlock
                        blockId={block.blockId}
                        key={block.blockId} />
                    </Grid.Column>
                ))}

                <Grid.Column width="2"> 
                    {this.state.searchBlocks.length < 4 &&
                        <Button onClick={this.addBlock} basic icon fluid>
                            <Icon name='add' />
                        </Button>
                    }
                </Grid.Column>

                <Grid.Column width="2"> 
                    {this.state.searchBlocks.length > 1 &&
                        <Button onClick={this.removeBlock} basic icon fluid>
                            <Icon name='minus' />
                        </Button>
                    }
                </Grid.Column>

            </Grid>

        );
    }
}

export default SearchBlockList;