import { store } from 'react-easy-state';


const searchGrammarStore = store({

    data: {
        blocks: []
    },

    grammarOptions: [],

    setGrammarOptions(grammarOptions){
        searchGrammarStore.grammarOptions = grammarOptions;
    },

    addBlock(){
        let blockId = 'block_' + Date.now()
        searchGrammarStore.data.blocks = searchGrammarStore.data.blocks.concat({
            id: blockId,
            term: '',
            distance: 0,
            fields: []
        });
        searchGrammarStore.addFieldToBlock(blockId);
    },

    removeBlock(blockId){
        searchGrammarStore.data.blocks = searchGrammarStore.data.blocks.filter(block => block.id !== blockId);
        searchGrammarStore.data.blocks[0].distance = 0;
    },

    addFieldToBlock(blockId){
        for (let i = 0; i < searchGrammarStore.data.blocks.length; i++){
            if (searchGrammarStore.data.blocks[i].id === blockId){
                searchGrammarStore.data.blocks[i].fields.push({
                    id: 'field_' + Date.now(),
                    name: '',
                    value: ''
                });
                break;
            }
        }
    },

    removeFieldFromBlock(blockId, fieldId){
        for (let i = 0; i < searchGrammarStore.data.blocks.length; i++){
            if (searchGrammarStore.data.blocks[i].id === blockId){
                searchGrammarStore.data.blocks[i].fields
                    = searchGrammarStore.data.blocks[i].fields.filter(field => field.id !== fieldId);
                break;
            }
        }
    },

    updateField(blockId, fieldId, fieldProp, value){
        for (let i = 0; i < searchGrammarStore.data.blocks.length; i++){
            if (searchGrammarStore.data.blocks[i].id === blockId){
                for (let j = 0; j < searchGrammarStore.data.blocks[i].fields.length; j++){
                    if (searchGrammarStore.data.blocks[i].fields[j].id === fieldId){
                        searchGrammarStore.data.blocks[i].fields[j][fieldProp] = value;
                    }
                }
            }
        }
    },

    updateTerm(blockId, term){
        for (let i = 0; i < searchGrammarStore.data.blocks.length; i++){
            if (searchGrammarStore.data.blocks[i].id === blockId){
                searchGrammarStore.data.blocks[i].term = term;
            }
        }
    },

    updateDistance(blockId, distance){
        for (let i = 0; i < searchGrammarStore.data.blocks.length; i++){
            if (searchGrammarStore.data.blocks[i].id === blockId){
                searchGrammarStore.data.blocks[i].distance = distance;
            }
        }
    },

    getUsedFieldNamesForBlock(blockId){
        let usedFieldNames = [];
        for (let block of searchGrammarStore.data.blocks){
            if (block.id === blockId){
                for (let field of block.fields){
                    usedFieldNames.push(field.name);
                }
            }
        }
        return usedFieldNames;
    },

    getValueOptionsForFieldName(fieldName){
        for (let grammar of searchGrammarStore.grammarOptions){
            if (grammar.field === fieldName){
                return grammar.values;
            }
        }
        return [];
    }

})

export default searchGrammarStore;