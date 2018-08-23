import { store } from 'react-easy-state';
import uiDataStore from "./uiDataStore";

const searchGrammarStore = store({

    data: {
        blocks: []
    },

    addBlock(){
        let blockId = 'block_' + Date.now()
        searchGrammarStore.data.blocks = searchGrammarStore.data.blocks.concat({
            id: blockId,
            form: '',
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
                        if (fieldProp === "name" && value.length === 0){
                            searchGrammarStore.data.blocks[i].fields[j].value = "";
                        } else if (fieldProp === "name" && value.length > 0){
                            searchGrammarStore.data.blocks[i].fields[j].value = searchGrammarStore.getValueOptionsForFieldName(value)[0];
                        }
                        break;
                    }
                }
                break;
            }
        }
    },

    updateForm(blockId, form){
        for (let i = 0; i < searchGrammarStore.data.blocks.length; i++){
            if (searchGrammarStore.data.blocks[i].id === blockId){
                searchGrammarStore.data.blocks[i].form = form;
                break;
            }
        }
    },

    updateDistance(blockId, distance){
        for (let i = 0; i < searchGrammarStore.data.blocks.length; i++){
            if (searchGrammarStore.data.blocks[i].id === blockId){
                searchGrammarStore.data.blocks[i].distance = distance;
                break;
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
            break;
        }
        return usedFieldNames;
    },

    getValueOptionsForFieldName(fieldName){
        for (let grammar of uiDataStore.search.grammar.tags){
            if (grammar.field === fieldName){
                return grammar.values;
            }
            break;
        }
        return [];
    }

})

export default searchGrammarStore;