(function(window, undefined){
    
    if(!window.$)
        throw new Error('Friend module need for jQuery to be installed.');
    
    window._Friend = {
        fb: {
            
            cbs: [],
            counter: 0,
 
            addCB: function(cb){
                _Friend.fb.cbs.push(cb);
                if(window.FB)
                    _Friend.fb.trigger();
            },
            
            trigger: function(){
                if(!window.FB)
                    return;
                var cbs = _Friend.fb.cbs;
                for(var i=0; i<cbs.length; i++)
                    cbs[i]();
                _Friend.fb.cbs = [];
            },
            
            wait: function(){
                if(window.FB)
                    return _Friend.fb.trigger();
                
                _Friend.fb.counter++;
                if(_Friend.fb.counter > 15)
                    throw new Error('Friend module need for fb js api to be installed');
                setTimeout(_Friend.fb.wait, 1000);
            }
        },
 
        ga: {
            _inited: false,
 
            init: function(){
                if(_Friend.ga._inited)
                    return;
                $('body').append('<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>');
            }
        },
 
        items: null,
        
        templates: {
            1: '<a href="#link" title="#title" target="_blank">'
             +      '<img src="#image" alt="#title">'
             + '</a>',
 
            3: '<ins class="adsbygoogle" style="display:block" '
             +      'data-ad-client="#client" '
             +      'data-ad-slot="#slot" data-ad-format="#format">'
             + '</ins>',
 
            4: '<div class="fb-ad" data-placementid="#placementid" '
             +      'data-format="#format" data-testmode="true">'
             + '</div>'
        },
        
        hs: function(text){
            return text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        },
        
        init: function(){
            _Friend.refresh();
            
            // facebook stuff
            _Friend.fb.addCB(function(){
                FB.Event.subscribe('ad.loaded', function(id){ console.log('FBAU:'+id+' loaded.'); });
                FB.Event.subscribe('ad.error',  function(c,m,id){ console.log('FBAU:'+id+' not loaded with error '+m); });
            });
            
            _Friend.fb.wait();
        },
 
        refresh: function(){
            var scripts = $('script[type="application/friend"]');
            if(!scripts.length)
                return;
            
            if(!/friend=1/.test(location.search)){
                $.get('/comp/friends', function(res){
                    _Friend.items = res.data || [];
                    for(var i=0; i<scripts.length; i++)
                        _Friend.render(scripts[i]);
                });
            }else{
                var items = {};
                for(var i=0; i<scripts.length; i++){
                    var script = $(scripts[i]);
                    var defSize = script.parent().width() + 'x' + 75;
                    var place = script.data('placement');
                    var count = script.data('example') || 1;
                    var size  = script.data('size') || defSize;
                    if(size == 'AUTO')
                        size = defSize;
                    
                    items[place] = [];
                    
                    for(j=0; j<count; j++){
                        var item = {
                            id: i + '0000' + j,
                            name: 'Item ' + i,
                            type: '1',
                            title: place,
                            image: 'http://placehold.it/' + size + '?text=' + place + '(' + size + ')',
                            link: 'http://google.com/'
                        };
                        
                        items[place].push(item);
                    }
                }
                
                _Friend.items = items;
                for(var i=0; i<scripts.length; i++)
                    _Friend.render(scripts[i]);
            }
        },
 
        template: function(item, tmpl){
            if(!tmpl)
                tmpl = _Friend.templates[item.type];
            
            for(var k in item){
                var re = new RegExp('#'+k, 'g');
                tmpl = tmpl.replace(re, _Friend.hs(item[k]));
            }
            
            return tmpl;
        },
        
        render: function(el){
            var $el = $(el);
            var pman = $el.data('placement');
            
            if(!_Friend.items[pman])
                return;
            
            var gExists = false;
            for(var i=0; i<_Friend.items[pman].length; i++){
                var item = _Friend.items[pman][i];
                
                switch(item.type){
                    
                    case '1':   // Banner
                        var tmpl = $el.html().trim();
                        $el.before(_Friend.template(item,tmpl));
                        break;
                    
                    case '2':   // Source
                        $el.before(item.script);
                        break;
                    
                    case '3':   // Google ads
                        (window.adsbygoogle = window.adsbygoogle || []).push({});
                        $el.before(_Friend.template(item));
                        gExists = true;
                        break;
                    
                    case '4':   // Facebook Audience Network
                        var $fbad = $(_Friend.template(item));
                        $el.before($fbad);
                        
                        _Friend.fb.addCB(function($fbad){
                            return function(){
                                FB.XFBML.parse($fbad);
                            }
                        }($fbad.get(0)));
                        
                        break;
                }
            }
            
            if(gExists)
                _Friend.ga.init();
        }
    };
    
    $(window._Friend.init);
    
})(window);