import { store } from 'react-easy-state';


const searchSimpleStore = store({

    term: '',
    field: 'text',

    setTerm(term){
        searchSimpleStore.term = term;
    },

    setField(field){
        searchSimpleStore.field = field;
    }

})

export default searchSimpleStore;