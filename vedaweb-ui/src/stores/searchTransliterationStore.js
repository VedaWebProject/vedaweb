import { store } from 'react-easy-state';


const searchTransliterationStore = store({

    transliterationOptions: {},

    transliteration: '',

    setTransliterationOptions(transliterationOptions){
        searchTransliterationStore.transliterationOptions = transliterationOptions;
        searchTransliterationStore.transliteration = searchTransliterationStore.transliterationOptions[0].id;
    },

    setTransliteration(value){
        searchTransliterationStore.transliteration = value;
    }

})

export default searchTransliterationStore;