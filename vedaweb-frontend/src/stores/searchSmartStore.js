import { store } from 'react-easy-state';


const searchSmartStore = store({

    data: {
        input: '',
        field: 'version_lubotskyzurich',
        accents: false
    },

    setInput(input){
        searchSmartStore.data.input = input;
    },

    setField(field){
        searchSmartStore.data.field = field;
    },

    setAccents(accents){
        searchSmartStore.data.accents = accents;
    }

})

export default searchSmartStore;