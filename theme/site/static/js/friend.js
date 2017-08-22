(function(window, undefined){
    var hs = function(text){
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };
    
    window._Friend = {
        items: [],
        templates: {
            1: '<a href="#link" title="#title" target="_blank"><img src="#image" alt="#title"></a>',
 
            2: '#script',
            
            3: '#script',
            
            4: '<iframe src="#src" style="border:0 none;width:100%;height:100%;"></iframe>'
        },
 
        ga: {
            initialized: false,
            init: function(){
                if(_Friend.ga.initialized)
                    return;
                _Friend.ga.initialized = true;
                $('body').append('<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>');
            }
        },
        
        init: function(){
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
                            link: 'https://www.google.com/'
                        };
                        
                        items[place].push(item);
                    }
                }
                
                _Friend.items = items;
                for(var i=0; i<scripts.length; i++)
                    _Friend.render(scripts[i]);
            }
        },
        
        render: function(el){
            var $el = $(el);
            var pman = $el.data('placement');
            var cb   = $el.data('callback');
            
            if(!_Friend.items[pman])
                return;
            
            var gExists = false;
            
            for(var i=0; i<_Friend.items[pman].length; i++){
                var item = _Friend.items[pman][i];
                var tmpl = $el.html().trim();
                var html = _Friend.template(item, tmpl);
                
                switch(item.type){
                    
                    case '1':   // Banner
                        $el.before(html);
                        break;
                    
                    case '2':   // Source
                        $el.before(html);
                        break;
                    
                    case '3':   // Google ads
                        (window.adsbygoogle = window.adsbygoogle || []).push({});
                        $el.before(html);
                        gExists = true;
                        break;
                    
                    case '4':   // iFrame with timer?
                        $el.before(html);
                        if(item.time)
                            setTimeout(function(el){ el.remove(); }, item.time * 1000, html);
                        break;
                }
                
                if(cb && window[cb])
                    window[cb]();
            }
            
            if(gExists)
                _Friend.ga.init();
        },
        
        template: function(item, tmpl){
            if(!tmpl)
                tmpl = '#template';
            
            // change #template to the original template
            tmpl = tmpl.replace('#template', _Friend.templates[item.type]);
            
            for(var k in item){
                var re = new RegExp('#'+k, 'g');
                if(item[k]){
                    item[k] = k == 'script' ? item[k] : hs(item[k])
                    tmpl = tmpl.replace(re, item[k]);
                }
            }
            
            return tmpl;
        },
    }
    
    $(window._Friend.init);
})(window);