import { store } from 'react-easy-state';


const appStateStore = store({

    view: "start",

    viewFilter: {
        grammar: true,
        translations: false
    },

    searchViewActive: false,

    openSearchView(open){
        appStateStore.searchViewActive = open;
    }

})

export default appStateStore;