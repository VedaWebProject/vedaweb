
const usageStats = {

    load: function(acceptedTracking){
        if (!acceptedTracking) return;
        usageStats.track(acceptedTracking);

        var _paq = window._paq || [];
        window._paq = _paq;

        if (window.Matomo) return;

        (function() {
        var u="https://piwik.rrz.uni-koeln.de/piwik/";
        _paq.push(['setTrackerUrl', u+'matomo.php']);
        _paq.push(['setSiteId', '253']);
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
        })();
    },

    track: function(acceptedTracking, location){
        if (!acceptedTracking) return;
        var _paq = window._paq || [];
        if (location) _paq.push(['setCustomUrl', usageStats.normalizeLocation(location.pathname)]);
        _paq.push(['enableHeartBeatTimer', 10]);
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
    },

    normalizeLocation(locationPath){
        return locationPath.match(/^\/[^/]+/i)[0];
    }

}

export default usageStats;