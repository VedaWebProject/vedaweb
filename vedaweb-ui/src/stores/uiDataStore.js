import { store } from 'react-easy-state';


const uiDataStore = store({

    search: {
        meta: {
            modes: [],
            scopes: [],
            transliterations: []
        },
        smart: {
            fields: []
        },
        grammar: {
            tags: []
        }
    }

})


export default uiDataStore;