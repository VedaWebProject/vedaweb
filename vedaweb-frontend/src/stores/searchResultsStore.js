import { store } from 'react-easy-state';


const searchResultsStore = store({

    page: 1,
    size: 10,
    total: 0,
    resultsData: {},
    queryJSON: {},
    queryEncoded: ''

});

export default searchResultsStore;