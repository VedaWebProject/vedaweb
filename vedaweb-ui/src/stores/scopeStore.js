import { store } from 'react-easy-state';


const scopeStore = store({

    options: [],

    ranges: {
        fromBookRange: [],
        fromHymnRange: [],
        toBookRange: [],
        toHymnRange: []
    },

    scope: {
        fromBook: 0,
        fromHymn: 0,
        toBook: 0,
        toHymn: 0
    },

    setOptions(booksData){
        let options = Array(booksData.length);
        booksData.forEach(function (nrOfHymns, i) {
            let hymns = Array(nrOfHymns);
            for (let j = 1; j <= nrOfHymns; j++){
                hymns[j] = {
                    display: ('00' + (j)).slice(-3),
                    value: j
                }
            }
            //specific books
            options[i+1] = {
                display: ('0' + (i+1)).slice(-2),
                value: i+1,
                hymns: hymns
            }
        });
        scopeStore.options = options;
        scopeStore.ranges.fromBookRange = options;
    },

    updateFromBook(index){
        scopeStore.scope.fromBook = index;
        scopeStore.scope.fromHymn = 0;
        scopeStore.scope.toBook = 0;
        scopeStore.scope.toHymn = 0;
        scopeStore.updateRanges();
    },

    updateFromHymn(index){
        scopeStore.scope.fromHymn = index;
        scopeStore.scope.toHymn
            = (scopeStore.scope.fromBook === scopeStore.scope.toBook
                && index >= scopeStore.scope.toHymn) ? 0 : scopeStore.scope.toHymn;
        scopeStore.updateRanges();
    },

    updateToBook(index){
        scopeStore.scope.toBook = index;
        scopeStore.scope.toHymn = 0;
        scopeStore.updateRanges();
    },

    updateToHymn(index){
        scopeStore.scope.toHymn = index;
    },

    updateRanges(){
        //fromHymn
        if (scopeStore.scope.fromBook > 0) {
            scopeStore.ranges.fromHymnRange
                = scopeStore.options[scopeStore.scope.fromBook].hymns;
        } else {
            scopeStore.ranges.fromHymnRange = [];
        }
        
        //toBook
        if (scopeStore.scope.fromBook > 0) {
            scopeStore.ranges.toBookRange = scopeStore.options.filter((book, i) =>
                i >= scopeStore.scope.fromBook
            )
        } else {
            scopeStore.ranges.toBookRange = [];
        }

        //toHymn
        if (scopeStore.scope.toBook > 0) {
            scopeStore.ranges.toHymnRange
                = scopeStore.options[scopeStore.scope.toBook].hymns.filter(hymn => 
                    scopeStore.scope.fromBook !== scopeStore.scope.toBook
                    || scopeStore.scope.fromHymn < hymn.value
                );
        } else {
            scopeStore.ranges.toHymnRange = [];
        }
    }

});

export default scopeStore;