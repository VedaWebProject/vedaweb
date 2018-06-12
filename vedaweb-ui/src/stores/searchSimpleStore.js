import { store } from 'react-easy-state';


const searchSimpleStore = store({

    data: {
        input: '',
        field: 'form'
    },

    setInput(input){
        searchSimpleStore.data.input = input;
    },

    setField(field){
        searchSimpleStore.data.field = field;
    }

})

export default searchSimpleStore;