import { store } from 'react-easy-state';


const searchSimpleStore = store({

    term: '',
    field: 'text',
    fields: [],

    setFieldsData(fields){
        searchSimpleStore.fields = fields;
    },

    setTerm(term){
        searchSimpleStore.term = term;
    },

    setField(field){
        searchSimpleStore.field = field;
    }

})

export default searchSimpleStore;