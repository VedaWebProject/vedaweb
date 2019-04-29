import { store } from 'react-easy-state';
import ls from 'local-storage';

const stateStore = store({

    //// APP SETTINGS ////

    settings: {
        store: "settings",
        firstVisit: true,
        tour: false,
        transliteration: "hk",
        accents: false,
        acceptedPrivacyHint: false,
    },

    //// SEARCH RESULTS ////

    results: {
        page: 1,
        size: 10,
        total: 0,
        sortBy: "relevance",
        resultsData: {},
        queryJSON: {},
        queryEncoded: ''
    },

    //// SEARCH ////

    search: {

        //// SEARCH: QUICK SEARCH ////

        quick: {
            store: "search.quick",
            input: "",
            field: "version_lubotskyzurich",
        },

        //// SEARCH: GRAMMAR SEARCH ////

        grammar: {
            blocks: [],

            addBlock(){
                let blockId = 'block_' + Date.now()
                stateStore.search.grammar.blocks = stateStore.search.grammar.blocks.concat({
                    id: blockId,
                    term: '',
                    lemma: false,
                    required: true,
                    distance: 0,
                    fields: []
                });
                stateStore.search.grammar.addFieldToBlock(blockId);
            },
        
            removeBlock(blockId){
                stateStore.search.grammar.blocks = stateStore.search.grammar.blocks.filter(block => block.id !== blockId);
                stateStore.search.grammar.blocks[0].distance = 0;
            },
        
            addFieldToBlock(blockId){
                for (let i = 0; i < stateStore.search.grammar.blocks.length; i++){
                    if (stateStore.search.grammar.blocks[i].id === blockId){
                        stateStore.search.grammar.blocks[i].fields.push({
                            id: 'field_' + Date.now(),
                            name: '',
                            value: ''
                        });
                        break;
                    }
                }
            },
        
            removeFieldFromBlock(blockId, fieldId){
                for (let i = 0; i < stateStore.search.grammar.blocks.length; i++){
                    if (stateStore.search.grammar.blocks[i].id === blockId){
                        stateStore.search.grammar.blocks[i].fields
                            = stateStore.search.grammar.blocks[i].fields.filter(field => field.id !== fieldId);
                        break;
                    }
                }
            },
        
            updateField(blockId, fieldId, fieldProp, value){
                for (let i = 0; i < stateStore.search.grammar.blocks.length; i++){
                    if (stateStore.search.grammar.blocks[i].id === blockId){
                        for (let j = 0; j < stateStore.search.grammar.blocks[i].fields.length; j++){
                            if (stateStore.search.grammar.blocks[i].fields[j].id === fieldId){
                                stateStore.search.grammar.blocks[i].fields[j][fieldProp] = value;
                                if (fieldProp === "name" && value.length === 0){
                                    stateStore.search.grammar.blocks[i].fields[j].value = "";
                                } else if (fieldProp === "name" && value.length > 0){
                                    stateStore.search.grammar.blocks[i].fields[j].value = stateStore.search.grammar.getValueOptionsForFieldName(value)[0];
                                }
                                break;
                            }
                        }
                        break;
                    }
                }
            },
        
            setTerm(blockId, term){
                for (let i = 0; i < stateStore.search.grammar.blocks.length; i++){
                    if (stateStore.search.grammar.blocks[i].id === blockId){
                        stateStore.search.grammar.blocks[i].term = term;
                        break;
                    }
                }
            },
        
            setLemma(blockId, lemma){
                for (let i = 0; i < stateStore.search.grammar.blocks.length; i++){
                    if (stateStore.search.grammar.blocks[i].id === blockId){
                        stateStore.search.grammar.blocks[i].lemma = lemma;
                        break;
                    }
                }
            },
        
            setRequired(blockId, required){
                for (let i = 0; i < stateStore.search.grammar.blocks.length; i++){
                    if (stateStore.search.grammar.blocks[i].id === blockId){
                        stateStore.search.grammar.blocks[i].required = required;
                        break;
                    }
                }
            },
        
            updateDistance(blockId, distance){
                for (let i = 0; i < stateStore.search.grammar.blocks.length; i++){
                    if (stateStore.search.grammar.blocks[i].id === blockId){
                        stateStore.search.grammar.blocks[i].distance = distance;
                        break;
                    }
                }
            },
        
            getUsedFieldNamesForBlock(blockId){
                let usedFieldNames = [];
                for (let block of stateStore.search.grammar.blocks){
                    if (block.id === blockId){
                        for (let field of block.fields){
                            usedFieldNames.push(field.name);
                        }
                    }
                    break;
                }
                return usedFieldNames;
            },
        
            getValueOptionsForFieldName(fieldName){
                for (let grammar of stateStore.ui.search.grammar.tags){
                    if (grammar.field === fieldName){
                        return grammar.values;
                    }
                }
                return [];
            },
        
            reset(){
                stateStore.search.grammar.blocks = [];
                stateStore.search.grammar.addBlock();
            }
            
        },

        //// SEARCH: META (FILTERS, SCOPES, ...) ////

        meta: {
            store: "search.meta",
            mode: "grammar",
            scopes: [
                {
                    id: "scope_0",
                    fromBook: 0,
                    fromHymn: 0,
                    toBook: 0,
                    toHymn: 0
                }
            ],
            meta: {
                hymnAddressee: [],
                hymnGroup: [],
                strata: []
            },

            hasMetas(){
                return stateStore.search.meta.meta.hymnAddressee.length > 0
                || stateStore.search.meta.meta.hymnGroup.length > 0
                || stateStore.search.meta.meta.strata.length > 0
            },

            hasScopes(){
                return stateStore.search.meta.scopes.length > 0
                && stateStore.search.meta.scopes[0].fromBook > 0
            },

            setSearchMode(mode){
                stateStore.search.meta.mode = mode;
            },

            setScopeFromBook(scopeId, index){
                for (let i = 0; i < stateStore.search.meta.scopes.length; i++){
                    if (stateStore.search.meta.scopes[i].id === scopeId){
                        stateStore.search.meta.scopes[i].fromBook = index;
                        stateStore.search.meta.scopes[i].fromHymn = 0;
                        stateStore.search.meta.scopes[i].toBook = 0;
                        stateStore.search.meta.scopes[i].toHymn = 0;
                        break;
                    }
                }
            },

            setScopeFromHymn(scopeId, index){
                for (let i = 0; i < stateStore.search.meta.scopes.length; i++){
                    if (stateStore.search.meta.scopes[i].id === scopeId){
                        stateStore.search.meta.scopes[i].fromHymn = index;
                        stateStore.search.meta.scopes[i].toHymn
                            = (stateStore.search.meta.scopes[i].fromBook === stateStore.search.meta.scopes[i].toBook
                                && index > stateStore.search.meta.scopes[i].toHymn) ? index : stateStore.search.meta.scopes[i].toHymn;
                        break;
                    }
                }
            },

            setScopeToBook(scopeId, index){
                for (let i = 0; i < stateStore.search.meta.scopes.length; i++){
                    if (stateStore.search.meta.scopes[i].id === scopeId){
                        stateStore.search.meta.scopes[i].toBook = index;
                        stateStore.search.meta.scopes[i].toHymn = 0;
                        break;
                    }
                }
            },

            setScopeToHymn(scopeId, index){
                for (let i = 0; i < stateStore.search.meta.scopes.length; i++){
                    if (stateStore.search.meta.scopes[i].id === scopeId){
                        stateStore.search.meta.scopes[i].toHymn = index;
                        break;
                    }
                }
            },

            addScope(){
                let scopeId = 'scope_' + Date.now();
                stateStore.search.meta.scopes = stateStore.search.meta.scopes.concat({
                    id: scopeId,
                    fromBook: 0,
                    fromHymn: 0,
                    toBook: 0,
                    toHymn: 0
                });
            },

            removeScope(scopeId){
                stateStore.search.meta.scopes = stateStore.search.meta.scopes.filter(scope => scope.id !== scopeId);
            },

            getScopeSettings(scopeId){
                for (let i = 0; i < stateStore.search.meta.scopes.length; i++){
                    if (stateStore.search.meta.scopes[i].id === scopeId){
                        return stateStore.search.meta.scopes[i];
                    }
                }
                return {};
            },

            getRanges(scopeId){
                for (let i = 0; i < stateStore.search.meta.scopes.length; i++){
                    if (stateStore.search.meta.scopes[i].id === scopeId){
                        let scope = stateStore.search.meta.scopes[i];
                        return {
                            fromBookRange:
                                stateStore.search.meta.range(
                                    1,
                                    stateStore.ui.search.meta.scopes.length
                                ),
                            fromHymnRange:
                                scope.fromBook === 0 ? [] :
                                stateStore.search.meta.range(
                                    1,
                                    stateStore.ui.search.meta.scopes[scope.fromBook === 0 ? 0 : scope.fromBook - 1]
                                ),
                            toBookRange:
                                scope.fromBook === 0 ? [] :
                                stateStore.search.meta.range(
                                    scope.fromBook, stateStore.ui.search.meta.scopes.length
                                ),
                            toHymnRange:
                                scope.toBook === 0 ? [] :
                                stateStore.search.meta.range(
                                    scope.fromBook === scope.toBook
                                        ? (scope.fromHymn === 0 ? 1 : scope.fromHymn)
                                        : 1, stateStore.ui.search.meta.scopes[scope.toBook === 0 ? 0 : scope.toBook - 1]
                                )
                        };
                    }
                }
                return {};
            },

            range(from, to){
                return [...Array(to - from + 1).keys()].map(i => i + from);
            },

            reset(){
                stateStore.search.meta.scopes = [
                    {
                        id: 'scope_0',
                        fromBook: 0,
                        fromHymn: 0,
                        toBook: 0,
                        toHymn: 0
                    }
                ];
                stateStore.search.meta.meta = {
                    hymnAddressee: [],
                    hymnGroup: [],
                    strata: []
                };
            }
        }
    },

    //// UI DATA ////

    ui: {
        search: {},
        meta: {},
        contentView: {},
        viewScrollTo: false,
        layers: [],

        toggleLayer(id, show){
            for (let i = 0; i < stateStore.ui.layers.length; i++) {
                const l = stateStore.ui.layers[i];
                if (l.id === id){
                    l.show = show;
                }
                if (id.endsWith('_') && l.id.startsWith(id)){
                    l.show = show;
                }
                if (id.startsWith(l.id) && show){
                    l.show = true;
                }
            }

            let cat = id.split('_')[0] + '_';
            if (!id.endsWith('_') && !stateStore.ui.isLayerCategoryVisible(cat)){
                stateStore.ui.toggleLayer(cat, false);
            }
        },

        isLayerVisible(id){
            let l = stateStore.ui.layers.find(l => l.id === id);
            return l !== undefined ? l.show : false;
        },

        isLayerCategoryVisible(catPrefix){
            return stateStore.ui.layers.find(l => l.id !== catPrefix && l.id.startsWith(catPrefix) && l.show) !== undefined;
        }

    },

    //// SAVE/LOAD TO/FROM LOCAL STORAGE ////

    save(obj){
        if (!stateStore.settings.acceptedPrivacyHint) return;
        for (var key in obj) {
            if (!obj.hasOwnProperty(key) || typeof obj[key] !== "object"){
                continue;
            } else if (obj[key].store){
                ls(obj[key].store, obj[key]);
            } else {
                stateStore.save(obj[key]);
            }
        }
    },

    load(obj){
        for (var key in obj) {
            if (!obj.hasOwnProperty(key) || typeof obj[key] !== "object"){
                continue;
            } else if (obj[key].store){
                obj[key] = ls(obj[key].store) ? Object.assign(obj[key], ls(obj[key].store)) : obj[key];
            } else {
                stateStore.load(obj[key]);
            }
        }
    },

    clearStorage(){
        ls.clear();
    }

})

export default stateStore;