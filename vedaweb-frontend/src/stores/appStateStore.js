import { store } from 'react-easy-state';


const appStateStore = store({

    viewFilter: {
        grammar: true,
        translations: false
    },

    viewScrollTo: false

})

export default appStateStore;