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
                fields: block.fields.filter(field => field.id !== fieldId)
            }
        ));
    },

    updateFieldName(blockId, fieldId, fieldName){
        searchAdvancedStore.data.blocks = searchAdvancedStore.data.blocks.map(block => (
            block.id !== blockId ? block : {
                id: block.id,
                term: block.term,
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

    updateTerm(blockId, termValue){
        searchAdvancedStore.data.blocks = searchAdvancedStore.data.blocks.map(block => (
            block.id !== blockId ? block : {
                id: block.id,
                term: termValue,
                fields: block.fields
            }
        ));
    }

})

export default searchAdvancedStore;






// use 'todos' instead of 'this' in the store methods to make them passable as callbacks

//   all: [],
//   filter: 'all',
//   get isEmpty () {
//     return todos.all.length === 0
//   },
//   get completed () {
//     return todos.all.filter(todo => todo.completed)
//   },
//   get hasCompleted () {
//     return todos.completed.length !== 0
//   },
//   get allCompleted () {
//     return todos.all.every(todo => todo.completed)
//   },
//   set allCompleted (completed) {
//     todos.all.forEach(todo => {
//       todo.completed = completed
//     })
//   },
//   get active () {
//     return todos.all.filter(todo => !todo.completed)
//   },
//   create (title) {
//     todos.all.push({ title })
//   },
//   remove (id) {
//     todos.all.splice(id, 1)
//   },
//   toggle (id) {
//     const todo = todos.all[id]
//     todo.completed = !todo.completed
//   },
//   toggleAll () {
//     todos.allCompleted = !todos.allCompleted
//   },
//   clearCompleted () {
//     todos.all = todos.active
//   }