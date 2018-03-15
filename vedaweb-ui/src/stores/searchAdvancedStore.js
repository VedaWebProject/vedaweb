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
    },

    addFieldToBlock(blockId){
        searchAdvancedStore.data.blocks = searchAdvancedStore.data.blocks.map(block => (
            block.id !== blockId ? block : {
                id: block.id,
                term: block.term,
                distance: block.distance,
                fields: block.fields.concat({
                    id: 'field_' + Date.now(),
                    name: '',
                    value: ''
                })
            }
        ));
    },

    removeFieldFromBlock(blockId, fieldId){
        searchAdvancedStore.data.blocks = searchAdvancedStore.data.blocks.map(block => (
            block.id !== blockId ? block : {
                id: block.id,
                term: block.term,
                distance: block.distance,
                fields: block.fields.filter(field => field.id !== fieldId)
            }
        ));
    },

    updateFieldName(blockId, fieldId, fieldName){
        searchAdvancedStore.data.blocks = searchAdvancedStore.data.blocks.map(block => (
            block.id !== blockId ? block : {
                id: block.id,
                term: block.term,
                distance: block.distance,
                fields: block.fields.map(field => (
                    field.id !== fieldId ? field : {
                        id: field.id,
                        name: fieldName,
                        value: ''
                    }
                ))
            }
        ));
    },

    updateFieldValue(blockId, fieldId, fieldValue){
        searchAdvancedStore.data.blocks = searchAdvancedStore.data.blocks.map(block => (
            block.id !== blockId ? block : {
                id: block.id,
                term: block.term,
                distance: block.distance,
                fields: block.fields.map(field => (
                    field.id !== fieldId ? field : {
                        id: field.id,
                        name: field.name,
                        value: fieldValue
                    }
                ))
            }
        ));
    },

    updateTerm(blockId, term){
        searchAdvancedStore.data.blocks = searchAdvancedStore.data.blocks.map(block => (
            block.id !== blockId ? block : {
                id: block.id,
                term: term,
                distance: block.distance,
                fields: block.fields
            }
        ));
    },

    updateDistance(blockId, distance){
        searchAdvancedStore.data.blocks = searchAdvancedStore.data.blocks.map(block => (
            block.id !== blockId ? block : {
                id: block.id,
                term: block.term,
                distance: distance,
                fields: block.fields
            }
        ));
        console.log(JSON.stringify(searchAdvancedStore.data.blocks));
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