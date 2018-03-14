import { store } from 'react-easy-state';


const appStateStore = store({

    searchViewActive: false,

    openSearchView(open){
        appStateStore.searchViewActive = open;
    }

})

export default appStateStore;