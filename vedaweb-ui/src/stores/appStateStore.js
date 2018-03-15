import { store } from 'react-easy-state';


const appStateStore = store({

    view: "start",
    searchViewActive: false,

    openSearchView(open){
        appStateStore.searchViewActive = open;
    }

})

export default appStateStore;