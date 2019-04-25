
const usageStats = {

    load: function(acceptedTracking){
        if (!acceptedTracking) return;
        console.log("loaded stats lib");

        usageStats.track(acceptedTracking);
        var _paq = window._paq || [];
        (function() {
            var u="https://piwik.rrz.uni-koeln.de/piwik/";
            _paq.push(['setTrackerUrl', u+'matomo.php']);
            _paq.push(['setSiteId', '253']);
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
        })();
    },

    track: function(acceptedTracking){
        if (!acceptedTracking) return;
        console.log("tracked");

        var _paq = window._paq || [];
        _paq.push(['enableHeartBeatTimer', 10]);
        _paq.push(['trackPageView']);
    }

}

export default usageStats;