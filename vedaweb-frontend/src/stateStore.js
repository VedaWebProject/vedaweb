import { store } from 'react-easy-state';
import ls from 'local-storage';
import SanscriptAccents from './components/utils/SanscriptAccents';

const stateStore = store({

    //// APP SETTINGS ////

    settings: {
        store: "settings",
        firstVisit: true,
        tour: false,
        transliteration: "hk",
        accents: false,
        acceptedPrivacyHint: false,
        condensedView: false,
        showMetricalData: false
    },

    //// SEARCH RESULTS ////

    results: {
        resultsData: {},
        query: {},
        queryEncoded: ''
    },

    //// SEARCH ////

    search: {

        //// SEARCH: QUICK SEARCH ////

        quick: {
            store: "search.quick",
            input: "",
            field: "version_",
            regex: false,

            getQuery(){
                return Object.assign({
                    input: stateStore.search.quick.field.startsWith('version_')
                        ? SanscriptAccents.t(stateStore.search.quick.input, stateStore.settings.transliteration, "iso")
                        : stateStore.search.quick.input,
                    field: stateStore.search.quick.field,
                    regex: stateStore.search.quick.regex
                }, stateStore.search.defaultQuery);
            }
        },

        //// SEARCH: METRICAL SEARCH ////

        metrical: {
            store: "search.metrical",
            input: "",
            field: "version_vannootenholland",

            reset(){
                stateStore.search.metrical.input = "";
                stateStore.search.metrical.field = "version_vannootenholland";
            },

            getQuery(){
                return Object.assign({
                    input: stateStore.search.metrical.input,
                    field: stateStore.search.metrical.field
                }, stateStore.search.defaultQuery);
            }
        },

        //// SEARCH: METRICAL POSITION SEARCH ////

        metricalPosition: {
            store: "search.metricalPosition",
            input: "",
            field: "version_vannootenholland",

            reset(){
                stateStore.search.metricalPosition.input = "";
            },

            getQuery(){
                return Object.assign({
                    input: SanscriptAccents.t(stateStore.search.metricalPosition.input, stateStore.settings.transliteration, "iso"),
                    field: "version_vannootenholland"
                }, stateStore.search.defaultQuery);
            }
        },

        //// SEARCH: GRAMMAR SEARCH ////

        grammar: {
            blocks: [],

            getQuery(){
                let queryBlocks = JSON.parse(JSON.stringify(stateStore.search.grammar.blocks));
                //remove empty blocks
                queryBlocks = queryBlocks.filter(block => !stateStore.search.grammar.isBlockEmpty(block));
                // eslint-disable-next-line
                for (let block of queryBlocks){
                    block.term = SanscriptAccents.t(block.term, stateStore.settings.transliteration, "iso");
                    block.lemma = SanscriptAccents.t(block.lemma, stateStore.settings.transliteration, "iso");
                    //make fields direct props of block
                    // eslint-disable-next-line
                    for (let field of block.fields){
                        if (field.value !== undefined && field.value.length > 0)
                            block[field.name] = field.value;
                    }
                    //cleanup
                    delete block.fields;
                    delete block.id;
                }

                return Object.assign({
                    blocks: queryBlocks
                }, stateStore.search.defaultQuery);
            },

            isBlockEmpty(block){
                return (!block.term || block.term.length === 0)
                    && (!block.lemma || block.lemma.length === 0)
                    && block.fields.filter(field => field.value.length > 0).length === 0;
            },

            addBlock(){
                let blockId = 'block_' + Date.now()
                stateStore.search.grammar.blocks = stateStore.search.grammar.blocks.concat({
                    id: blockId,
                    term: '',
                    lemma: '',
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
                // eslint-disable-next-line
                for (let block of stateStore.search.grammar.blocks){
                    if (block.id === blockId){
                        // eslint-disable-next-line
                        for (let field of block.fields){
                            usedFieldNames.push(field.name);
                        }
                    }
                    break;
                }
                return usedFieldNames;
            },
        
            getValueOptionsForFieldName(fieldName){
                // eslint-disable-next-line
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

        //// SEARCH: DEFAULT COMMON QUERY VALUES ////

        defaultQuery: {
            sortBy: null,
            sortOrder: null,
            size: 10,
            from: 0
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
                strata: [],
                stanzaType: [],
                lateAdditions: []
            },

            hasMetas(){
                let metas = 0;
                Object.keys(stateStore.search.meta.meta)
                    .filter(k => stateStore.search.meta.meta.hasOwnProperty(k))
                    .forEach(k => {metas += stateStore.search.meta.meta[k].length});
                return metas > 0;
                // return (stateStore.search.meta.meta.hymnAddressee
                //     && stateStore.search.meta.meta.hymnAddressee.length)
                // || (stateStore.search.meta.meta.hymnGroup
                //     && stateStore.search.meta.meta.hymnGroup.length)
                // || (stateStore.search.meta.meta.strata
                //     && stateStore.search.meta.meta.strata.length)
                // || (stateStore.search.meta.meta.stanzaType
                //     && stateStore.search.meta.meta.stanzaType.length)
                // || (stateStore.search.meta.meta.lateAdditions
                //     && stateStore.search.meta.meta.lateAdditions.length)
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
                    strata: [],
                    stanzaType: [],
                    lateAdditions: []
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
                if (id.startsWith(l.id) && l.id.endsWith('_') && show){
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
            if (!obj.hasOwnProperty(key) || obj[key] === null || typeof obj[key] !== "object"){
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
            if (!obj.hasOwnProperty(key) || obj[key] === null || typeof obj[key] !== "object"){
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