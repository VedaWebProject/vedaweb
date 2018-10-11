import { store } from 'react-easy-state';


const uiDataStore = store({

    //will be filled dynamically with data fetched from server
    search: {},
    abbreviations: {},
    contentView: {},
    viewScrollTo: false,
    viewFilter: {glossing: true, translations: true},
    disabledTranslations: {}

})


export default uiDataStore;