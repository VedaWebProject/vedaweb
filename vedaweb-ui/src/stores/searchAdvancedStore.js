import { store } from 'react-easy-state';


const searchAdvancedStore = store({

    data: {
        blocks: []
    },

    grammarOptions: [],

    setGrammarOptions(grammarOptions){
        searchAdvancedStore.grammarOptions = grammarOptions;
    },

    addBlock(){
        let blockId = 'block_' + Date.now()
        searchAdvancedStore.data.blocks = searchAdvancedStore.data.blocks.concat({
            id: blockId,
            term: '',
            distance: 0,
            fields: []
        });
        searchAdvancedStore.addFieldToBlock(blockId);
    },

    removeBlock(blockId){
        searchAdvancedStore.data.blocks = searchAdvancedStore.data.blocks.filter(block => block.id !== blockId);
        searchAdvancedStore.data.blocks[0].distance = 0;
    },

    addFieldToBlock(blockId){
        for (let i = 0; i < searchAdvancedStore.data.blocks.length; i++){
            if (searchAdvancedStore.data.blocks[i].id === blockId){
                searchAdvancedStore.data.blocks[i].fields.push({
                    id: 'field_' + Date.now(),
                    name: '',
                    value: ''
                });
                break;
            }
        }

        ////LEGACY
        // searchAdvancedStore.data.blocks = searchAdvancedStore.data.blocks.map(block => (
        //     block.id !== blockId ? block : {
        //         id: block.id,
        //         term: block.term,
        //         distance: block.distance,
        //         fields: block.fields.concat({
        //             id: 'field_' + Date.now(),
        //             name: '',
        //             value: ''
        //         })
        //     }
        // ));
    },

    removeFieldFromBlock(blockId, fieldId){
        for (let i = 0; i < searchAdvancedStore.data.blocks.length; i++){
            if (searchAdvancedStore.data.blocks[i].id === blockId){
                searchAdvancedStore.data.blocks[i].fields
                    = searchAdvancedStore.data.blocks[i].fields.filter(field => field.id !== fieldId);
                break;
            }
        }

        // //LEGACY
        // searchAdvancedStore.data.blocks = searchAdvancedStore.data.blocks.map(block => (
        //     block.id !== blockId ? block : {
        //         id: block.id,
        //         term: block.term,
        //         distance: block.distance,
        //         fields: block.fields.filter(field => field.id !== fieldId)
        //     }
        // ));
    },

    updateField(blockId, fieldId, fieldProp, value){
        for (let i = 0; i < searchAdvancedStore.data.blocks.length; i++){
            if (searchAdvancedStore.data.blocks[i].id === blockId){
                for (let j = 0; j < searchAdvancedStore.data.blocks[i].fields.length; j++){
                    if (searchAdvancedStore.data.blocks[i].fields[j].id === fieldId){
                        searchAdvancedStore.data.blocks[i].fields[j][fieldProp] = value;
                    }
                }
            }
        }

        // //LEGACY
        // searchAdvancedStore.data.blocks = searchAdvancedStore.data.blocks.map(block => (
        //     block.id !== blockId ? block : {
        //         id: block.id,
        //         term: block.term,
        //         distance: block.distance,
        //         fields: block.fields.map(field => (
        //             field.id !== fieldId ? field : {
        //                 id: field.id,
        //                 name: fieldName,
        //                 value: ''
        //             }
        //         ))
        //     }
        // ));
    },

    // updateFieldValue(blockId, fieldId, fieldValue){
    //     searchAdvancedStore.data.blocks = searchAdvancedStore.data.blocks.map(block => (
    //         block.id !== blockId ? block : {
    //             id: block.id,
    //             term: block.term,
    //             distance: block.distance,
    //             fields: block.fields.map(field => (
    //                 field.id !== fieldId ? field : {
    //                     id: field.id,
    //                     name: field.name,
    //                     value: fieldValue
    //                 }
    //             ))
    //         }
    //     ));
    // },

    updateTerm(blockId, term){
        for (let i = 0; i < searchAdvancedStore.data.blocks.length; i++){
            if (searchAdvancedStore.data.blocks[i].id === blockId){
                searchAdvancedStore.data.blocks[i].term = term;
            }
        }

        // //LEGACY
        // searchAdvancedStore.data.blocks = searchAdvancedStore.data.blocks.map(block => (
        //     block.id !== blockId ? block : {
        //         id: block.id,
        //         term: term,
        //         distance: block.distance,
        //         fields: block.fields
        //     }
        // ));
    },

    updateDistance(blockId, distance){
        for (let i = 0; i < searchAdvancedStore.data.blocks.length; i++){
            if (searchAdvancedStore.data.blocks[i].id === blockId){
                searchAdvancedStore.data.blocks[i].distance = distance;
            }
        }

        // //LEGACY
        // searchAdvancedStore.data.blocks = searchAdvancedStore.data.blocks.map(block => (
        //     block.id !== blockId ? block : {
        //         id: block.id,
        //         term: block.term,
        //         distance: distance,
        //         fields: block.fields
        //     }
        // ));
    },

    getUsedFieldNamesForBlock(blockId){
        let usedFieldNames = [];
        for (let block of searchAdvancedStore.data.blocks){
            if (block.id === blockId){
                for (let field of block.fields){
                    usedFieldNames.push(field.name);
                }
            }
        }
        return usedFieldNames;
    },

    getValueOptionsForFieldName(fieldName){
        for (let grammar of searchAdvancedStore.grammarOptions){
            if (grammar.field === fieldName){
                return grammar.values;
            }
        }
        return [];
    }

})

export default searchAdvancedStore;