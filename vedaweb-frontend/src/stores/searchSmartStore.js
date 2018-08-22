import { store } from 'react-easy-state';


const searchSmartStore = store({

    data: {
        input: '',
        field: 'form'
    },

    setInput(input){
        searchSmartStore.data.input = input;
    },

    setField(field){
        searchSmartStore.data.field = field;
    }

})

export default searchSmartStore;