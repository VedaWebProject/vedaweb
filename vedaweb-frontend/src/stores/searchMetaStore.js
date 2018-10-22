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

    scopeDataRaw: [],

    transliteration: {},

    meta: {
        hymnAddressee: [],
        hymnGroup: [],
        strata: []
    },

    hasMetas(){
        return searchMetaStore.meta.hymnAddressee.length > 0
        || searchMetaStore.meta.hymnGroup.length > 0
        || searchMetaStore.meta.strata.length > 0
    },

    setSearchMode(mode){
        searchMetaStore.mode = mode;
    },

    setTransliteration(id){
        searchMetaStore.transliteration = id;
    },

    setScopeFromBook(scopeId, index){
        for (let i = 0; i < searchMetaStore.scopes.length; i++){
            if (searchMetaStore.scopes[i].id === scopeId){
                searchMetaStore.scopes[i].fromBook = index;
                searchMetaStore.scopes[i].fromHymn = 0;
                searchMetaStore.scopes[i].toBook = 0;
                searchMetaStore.scopes[i].toHymn = 0;
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
                break;
            }
        }
    },

    setScopeToBook(scopeId, index){
        for (let i = 0; i < searchMetaStore.scopes.length; i++){
            if (searchMetaStore.scopes[i].id === scopeId){
                searchMetaStore.scopes[i].toBook = index;
                searchMetaStore.scopes[i].toHymn = 0;
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

    addScope(){
        let scopeId = 'scope_' + Date.now();
        searchMetaStore.scopes = searchMetaStore.scopes.concat({
            id: scopeId,
            fromBook: 0,
            fromHymn: 0,
            toBook: 0,
            toHymn: 0
        });
    },

    removeScope(scopeId){
        searchMetaStore.scopes = searchMetaStore.scopes.filter(scope => scope.id !== scopeId);
    },

    getScopeSettings(scopeId){
        for (let i = 0; i < searchMetaStore.scopes.length; i++){
            if (searchMetaStore.scopes[i].id === scopeId){
                return searchMetaStore.scopes[i];
            }
        }
        return {};
    },

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
    },

    reset(){
        searchMetaStore.scopes = [
            {
                id: 'scope_0',
                fromBook: 0,
                fromHymn: 0,
                toBook: 0,
                toHymn: 0
            }
        ];
        searchMetaStore.meta = {
            hymnAddressee: [],
            hymnGroup: [],
            strata: []
        };
    }

});

export default searchMetaStore;