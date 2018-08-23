import { store } from 'react-easy-state';


const searchMetaStore = store({

    mode: 'grammar',

    scopes: [
        {
            id: 'scope_0',
            fromBook: 0,
            fromHymn: 0,
            toBook: 0,
            toHymn: 0
        }
    ],

    /* scopeData: [], */

    scopeDataRaw: [],

    transliteration: {id: 'hk', name: 'Harvard-Kyoto'},

    setSearchMode(mode){
        searchMetaStore.mode = mode;
    },

    setTransliteration(id, name){
        searchMetaStore.transliteration = {id: id, name: name};
    },

    initScopeData(scopeDataRaw){
        searchMetaStore.scopeDataRaw = scopeDataRaw;
        /* let data = Array(scopeDataRaw.length);
        scopeDataRaw.forEach(function (nrOfHymns, i) {
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
        searchMetaStore.scopeData = data; */
    },

    setScopeFromBook(scopeId, index){
        for (let i = 0; i < searchMetaStore.scopes.length; i++){
            if (searchMetaStore.scopes[i].id === scopeId){
                searchMetaStore.scopes[i].fromBook = index;
                searchMetaStore.scopes[i].fromHymn = 0;
                searchMetaStore.scopes[i].toBook = 0;
                searchMetaStore.scopes[i].toHymn = 0;
                //searchMetaStore.updateScopeRanges(scopeId);
                break;
            }
        }
    },

    setScopeFromHymn(scopeId, index){
        for (let i = 0; i < searchMetaStore.scopes.length; i++){
            if (searchMetaStore.scopes[i].id === scopeId){
                searchMetaStore.scopes[i].fromHymn = index;
                searchMetaStore.scopes[i].toHymn
                    = (searchMetaStore.scopes[i].fromBook === searchMetaStore.scopes[i].toBook
                        && index > searchMetaStore.scopes[i].toHymn) ? index : searchMetaStore.scopes[i].toHymn;
                //searchMetaStore.updateScopeRanges(scopeId);
                break;
            }
        }
    },

    setScopeToBook(scopeId, index){
        for (let i = 0; i < searchMetaStore.scopes.length; i++){
            if (searchMetaStore.scopes[i].id === scopeId){
                searchMetaStore.scopes[i].toBook = index;
                searchMetaStore.scopes[i].toHymn = 0;
                //searchMetaStore.updateScopeRanges(scopeId);
                break;
            }
        }
    },

    setScopeToHymn(scopeId, index){
        for (let i = 0; i < searchMetaStore.scopes.length; i++){
            if (searchMetaStore.scopes[i].id === scopeId){
                searchMetaStore.scopes[i].toHymn = index;
                break;
            }
        }
    },

    /* updateScopeRanges(scopeId){
        for (let i = 0; i < searchMetaStore.scopes.length; i++){
            if (searchMetaStore.scopes[i].id === scopeId){
                //fromHymn
                if (searchMetaStore.scopes[i].fromBook > 0) {
                    searchMetaStore.scopes[i].ranges.fromHymnRange
                        = searchMetaStore.scopeData[searchMetaStore.scopes[i].fromBook].hymns;
                } else {
                    searchMetaStore.scopes[i].ranges.fromHymnRange = [];
                }
                
                //toBook
                if (searchMetaStore.scopes[i].fromBook > 0) {
                    searchMetaStore.scopes[i].ranges.toBookRange = searchMetaStore.scopeData.filter((book, i) =>
                        i >= searchMetaStore.scopes[i].fromBook
                    )
                } else {
                    searchMetaStore.scopes[i].ranges.toBookRange = [];
                }

                //toHymn
                if (searchMetaStore.scopes[i].toBook > 0) {
                    searchMetaStore.scopes[i].ranges.toHymnRange
                        = searchMetaStore.scopeData[searchMetaStore.scopes[i].toBook].hymns.filter(hymn => 
                            searchMetaStore.scopes[i].fromBook !== searchMetaStore.scopes[i].toBook
                            || searchMetaStore.scopes[i].fromHymn < hymn.value
                        );
                } else {
                    searchMetaStore.scopes[i].ranges.toHymnRange = [];
                }

                break;
            }
        }
    }, */

    addScope(){
        let scopeId = 'scope_' + Date.now();
        searchMetaStore.scopes = searchMetaStore.scopes.concat({
            id: scopeId,
            /* ranges: {
                fromBookRange: searchMetaStore.scopeData.filter(x => true),
                fromHymnRange: [],
                toBookRange: [],
                toHymnRange: []
            }, */
            fromBook: 0,
            fromHymn: 0,
            toBook: 0,
            toHymn: 0
        });
    },

    removeScope(scopeId){
        searchMetaStore.scopes = searchMetaStore.scopes.filter(scope => scope.id !== scopeId);
    },

    /* updateScope(scopeId, fromBook, fromHymn, toBook, toHymn){
        for (let i = 0; i < searchMetaStore.scopes.length; i++){
            if (searchMetaStore.scopes[i].id === scopeId){
                searchMetaStore.scopes[i].fromBook = fromBook;
                searchMetaStore.scopes[i].fromHymn = fromHymn;
                searchMetaStore.scopes[i].toBook = toBook;
                searchMetaStore.scopes[i].toHymn = toHymn;
                break;
            }
        }
        //searchMetaStore.updateScopeRanges(scopeId);
    }, */

    getScopeSettings(scopeId){
        for (let i = 0; i < searchMetaStore.scopes.length; i++){
            if (searchMetaStore.scopes[i].id === scopeId){
                return searchMetaStore.scopes[i];
            }
        }
        return {};
    },

    /* getScopeRanges(scopeId){
        for (let i = 0; i < searchMetaStore.scopes.length; i++){
            if (searchMetaStore.scopes[i].id === scopeId){
                return searchMetaStore.scopes[i].ranges;
            }
        }
        return {};
    }, */

    getRanges(scopeId){
        for (let i = 0; i < searchMetaStore.scopes.length; i++){
            if (searchMetaStore.scopes[i].id === scopeId){
                let scope = searchMetaStore.scopes[i];
                return {
                    fromBookRange:
                        this.range(1, this.scopeDataRaw.length),
                    fromHymnRange:
                        scope.fromBook === 0 ? [] :
                        this.range(1, this.scopeDataRaw[scope.fromBook === 0 ? 0 : scope.fromBook - 1]),
                    toBookRange:
                        scope.fromBook === 0 ? [] :
                        this.range(scope.fromBook, this.scopeDataRaw.length),
                    toHymnRange:
                        scope.toBook === 0 ? [] :
                        this.range(scope.fromBook === scope.toBook ? (scope.fromHymn === 0 ? 1 : scope.fromHymn) : 1, this.scopeDataRaw[scope.toBook === 0 ? 0 : scope.toBook - 1])
                };
            }
        }
        return {};
    },

    range(from, to) {
        return [...Array(to - from + 1).keys()].map(i => i + from);
    }

});

export default searchMetaStore;