import { store } from 'react-easy-state';


const uiDataStore = store({

    //will be filled dynamically with data fetched from server
    search: {},
    meta: {},
    contentView: {},
    viewScrollTo: false,
    layers: [],
    firstTime: true,

    toggleLayer(id, show){
        for (let i = 0; i < uiDataStore.layers.length; i++) {
            const l = uiDataStore.layers[i];
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
        if (!id.endsWith('_') && !uiDataStore.isLayerCategoryVisible(cat)){
            uiDataStore.toggleLayer(cat, false);
        }
    },

    isLayerVisible(id){
        let l = uiDataStore.layers.find(l => l.id === id);
        return l !== undefined ? l.show : false;
    },

    isLayerCategoryVisible(catPrefix){
        return uiDataStore.layers.find(l => l.id !== catPrefix && l.id.startsWith(catPrefix) && l.show) !== undefined;
    }

})


export default uiDataStore;