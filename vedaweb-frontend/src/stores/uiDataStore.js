import { store } from 'react-easy-state';


const uiDataStore = store({

    //will be filled dynamically with data fetched from server
    search: {},
    meta: {},
    contentView: {},
    viewScrollTo: false,
    viewFilter: {glossing: true, translations: true},
    disabledTranslations: {}

})


export default uiDataStore;