import { store } from 'react-easy-state';


const searchMetaStore = store({

    mode: 'grammar',

    scope: {
        data: [],
        ranges: {
            fromBookRange: [],
            fromHymnRange: [],
            toBookRange: [],
            toHymnRange: []
        },
        settings: {
            fromBook: 0,
            fromHymn: 0,
            toBook: 0,
            toHymn: 0
        }
    },

    transliteration: {
        data: [],
        setting: ''
    },

    setSearchMode(mode){
        searchMetaStore.mode = mode;
    },

    setTransliterationData(transliterationData){
        searchMetaStore.transliteration.data = transliterationData;
        searchMetaStore.transliteration.setting = searchMetaStore.transliteration.data[0].id;
    },

    setTransliteration(id){
        searchMetaStore.transliteration.setting = id;
    },

    setScopeData(scopeData){
        let data = Array(scopeData.length);
        scopeData.forEach(function (nrOfHymns, i) {
            let hymns = Array(nrOfHymns);
            for (let j = 1; j <= nrOfHymns; j++){
                hymns[j] = {
                    display: ('00' + (j)).slice(-3),
                    value: j
                }
            }
            data[i+1] = {
                display: ('0' + (i+1)).slice(-2),
                value: i+1,
                hymns: hymns
            }
        });
        searchMetaStore.scope.data = data;
        searchMetaStore.scope.ranges.fromBookRange = data;
    },

    setScopeFromBook(index){
        searchMetaStore.scope.settings.fromBook = index;
        searchMetaStore.scope.settings.fromHymn = 0;
        searchMetaStore.scope.settings.toBook = 0;
        searchMetaStore.scope.settings.toHymn = 0;
        searchMetaStore.updateScopeRanges();
    },

    setScopeFromHymn(index){
        searchMetaStore.scope.settings.fromHymn = index;
        searchMetaStore.scope.settings.toHymn
            = (searchMetaStore.scope.settings.fromBook === searchMetaStore.scope.settings.toBook
                && index >= searchMetaStore.scope.settings.toHymn) ? 0 : searchMetaStore.scope.settings.toHymn;
        searchMetaStore.updateScopeRanges();
    },

    setScopeToBook(index){
        searchMetaStore.scope.settings.toBook = index;
        searchMetaStore.scope.settings.toHymn = 0;
        searchMetaStore.updateScopeRanges();
    },

    setScopeToHymn(index){
        searchMetaStore.scope.settings.toHymn = index;
    },

    updateScopeRanges(){
        //fromHymn
        if (searchMetaStore.scope.settings.fromBook > 0) {
            searchMetaStore.scope.ranges.fromHymnRange
                = searchMetaStore.scope.data[searchMetaStore.scope.settings.fromBook].hymns;
        } else {
            searchMetaStore.scope.ranges.fromHymnRange = [];
        }
        
        //toBook
        if (searchMetaStore.scope.settings.fromBook > 0) {
            searchMetaStore.scope.ranges.toBookRange = searchMetaStore.scope.data.filter((book, i) =>
                i >= searchMetaStore.scope.settings.fromBook
            )
        } else {
            searchMetaStore.scope.ranges.toBookRange = [];
        }

        //toHymn
        if (searchMetaStore.scope.settings.toBook > 0) {
            searchMetaStore.scope.ranges.toHymnRange
                = searchMetaStore.scope.data[searchMetaStore.scope.settings.toBook].hymns.filter(hymn => 
                    searchMetaStore.scope.settings.fromBook !== searchMetaStore.scope.settings.toBook
                    || searchMetaStore.scope.settings.fromHymn < hymn.value
                );
        } else {
            searchMetaStore.scope.ranges.toHymnRange = [];
        }
    }

});

export default searchMetaStore;