import { store } from 'react-easy-state';


const searchScopeStore = store({

    scopeOptions: {},

    scopeRanges: {
        fromBookRange: [],
        fromHymnRange: [],
        toBookRange: [],
        toHymnRange: []
    },

    scopeSettings: {
        fromBook: '',
        fromHymn: '',
        toBook: '',
        toHymn: ''
    },

    setScopeOptions(scopeOptions){
        searchScopeStore.scopeOptions = scopeOptions;
        searchScopeStore.scopeRanges.fromBookRange = scopeOptions;
    },

    updateFromBook(id){
        searchScopeStore.scopeSettings.fromBook = id;
        searchScopeStore.scopeSettings.fromHymn = '';
        searchScopeStore.scopeSettings.toBook = '';
        searchScopeStore.scopeSettings.toHymn = '';
    }

})

export default searchScopeStore;