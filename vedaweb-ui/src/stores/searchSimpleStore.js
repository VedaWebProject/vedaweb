import { store } from 'react-easy-state';


const searchSimpleStore = store({

    term: '',
    field: '',
    fieldData: [],

    setTerm(term){
        searchSimpleStore.term = term;
    }

})

export default searchSimpleStore;