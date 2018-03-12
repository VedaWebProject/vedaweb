import { store } from 'react-easy-state';


const searchScopeStore = store({

    scopeOptions: [],

    scopeRanges: {
        fromBookRange: [],
        fromHymnRange: [],
        toBookRange: [],
        toHymnRange: []
    },

    scopeSettings: {
        fromBook: 0,
        fromHymn: 0,
        toBook: 0,
        toHymn: 0
    },

    setScopeOptions(booksData){
        let scopeOptions = Array(booksData.length);
        booksData.forEach(function (nrOfHymns, i) {
            let hymns = Array(nrOfHymns);
            for (let j = 1; j <= nrOfHymns; j++){
                hymns[j] = {
                    display: ('00' + (j)).slice(-3),
                    value: j
                }
            }
            //specific books
            scopeOptions[i+1] = {
                display: ('0' + (i+1)).slice(-2),
                value: i+1,
                hymns: hymns
            }
        });
        searchScopeStore.scopeOptions = scopeOptions;
        searchScopeStore.scopeRanges.fromBookRange = scopeOptions;
    },

    updateFromBook(index){
        searchScopeStore.scopeSettings.fromBook = index;
        searchScopeStore.scopeSettings.fromHymn = 0;
        searchScopeStore.scopeSettings.toBook = 0;
        searchScopeStore.scopeSettings.toHymn = 0;
        searchScopeStore.updateRanges();
    },

    updateFromHymn(index){
        searchScopeStore.scopeSettings.fromHymn = index;
        searchScopeStore.updateRanges();
    },

    updateToBook(index){
        searchScopeStore.scopeSettings.toBook = index;
        searchScopeStore.scopeSettings.toHymn = 0;
        searchScopeStore.updateRanges();
    },

    updateToHymn(index){
        searchScopeStore.scopeSettings.toHymn = index;
    },

    updateRanges(){
        //fromHymn
        if (searchScopeStore.scopeSettings.fromBook > 0) {
            searchScopeStore.scopeRanges.fromHymnRange
                = searchScopeStore.scopeOptions[searchScopeStore.scopeSettings.fromBook].hymns;
        } else {
            searchScopeStore.scopeRanges.fromHymnRange = [];
        }
        
        //toBook
        if (searchScopeStore.scopeSettings.fromBook > 0) {
            searchScopeStore.scopeRanges.toBookRange = searchScopeStore.scopeOptions.filter((book, i) =>
                i >= searchScopeStore.scopeSettings.fromBook
            )
        } else {
            searchScopeStore.scopeRanges.toBookRange = [];
        }

        //toHymn
        if (searchScopeStore.scopeSettings.toBook > 0) {
            searchScopeStore.scopeRanges.toHymnRange
                = searchScopeStore.scopeOptions[searchScopeStore.scopeSettings.toBook].hymns.filter(hymn => 
                    searchScopeStore.scopeSettings.fromBook !== searchScopeStore.scopeSettings.toBook
                    || searchScopeStore.scopeSettings.fromHymn < hymn.value
                );
        } else {
            searchScopeStore.scopeRanges.toHymnRange = [];
        }
    }

});

export default searchScopeStore;