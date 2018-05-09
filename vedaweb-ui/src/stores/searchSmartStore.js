import { store } from 'react-easy-state';


const searchSmartStore = store({

    data: {
        input: ''
    },

    setInput(input){
        searchSmartStore.data.input = input;
    }

})

export default searchSmartStore;