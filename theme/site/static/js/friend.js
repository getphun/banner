(function(window, undefined){
    
    if(!window.$)
        throw new Error('Friend module need for jQuery to be installed.');
    
    window._Friend = {
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
 
            4: '<iframe src="#src" style="border:0 none;width:100%;height:100%;">'
             + '</iframe>'
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
 
        template: function(item, tmpl){
            if(!tmpl)
                tmpl = _Friend.templates[item.type];
            
            for(var k in item){
                var re = new RegExp('#'+k, 'g');
                if(item[k])
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
                    
                    case '4':   // iFrame with timer?
                        var tmpl = $el.html().trim();
                        var $ban = $(_Friend.template(item,tmpl));
                        $el.before($ban);
                        if(item.time)
                            setTimeout(function(el){ el.remove(); }, item.time * 1000, $ban);
                        break;
                }
            }
            
            if(gExists)
                _Friend.ga.init();
        }
    };
    
    $(window._Friend.init);
    
})(window);