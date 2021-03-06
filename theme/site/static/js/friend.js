$(function(){
    if(/friend=0/.test(location.search))
        return;
    
    var hs = function(text){
        return (''+text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };
    
    window._Friend = {
        items: [],
        device: [1,4,6,7],
        templates: {
            1: '<a href="#link" title="#title" target="_blank"><img src="#image" alt="#title" class="img-responsive"></a>',
 
            2: '#script',
            
            3: '#script',
            
            4: '<iframe src="#src" style="border:0 none;width:100%;height:100%;"></iframe>',
  
            5: '<div id="SC_TBlock_#id" class="SC_TBlock">...</div>'
        },
  
        an: {
            initialized: false,
            domains: [],
            init: function(){
                if(_Friend.an.initialized)
                    return;
                _Friend.an.initialized = true;
                for(var i=0; i<_Friend.an.domains.length; i++)
                    $('body').append('<script src="//st-'+_Friend.an.domains[i]+'/js/adv_out.js"></script>');
            }
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
            
            if(screen.width >= 992)
                _Friend.device = [1,2,3,4];
            else if(screen.width >= 768)
                _Friend.device = [1,3,5,6];
            
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
                            type: 1,
                            title: place,
                            device: 1,
                            image: 'http://placehold.it/' + size + '?text=' + size,
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
            var anExists= false;
            
            for(var i=0; i<_Friend.items[pman].length; i++){
                var item = _Friend.items[pman][i];
                var tmpl = $el.html().trim();
                var html = _Friend.template(item, tmpl);
                
                // should we render this?
                if(!~_Friend.device.indexOf(item.device))
                    continue;
                
                switch(item.type){
                    
                    case 1:   // Banner
                        $el.before(html);
                        break;
                    
                    case 2:   // Source
                        $el.before(html);
                        break;
                    
                    case 3:   // Google ads
                        if(/<ins/.test(html))
                            (window.adsbygoogle = window.adsbygoogle || []).push({});
                        $el.before(html);
                        gExists = true;
                        break;
                    
                    case 4:   // iFrame
                        $el.before(html);
                        break;
                    
                    case 5:   // AdNow
                        $el.before(html);
                            (sc_adv_out=window.sc_adv_out||[]).push({id:item.id,domain:item.domain});
                        anExists = true;
                        if(!~_Friend.an.domains.indexOf(item.domain))
                            _Friend.an.domains.push(item.domain);
                        break;
                }
                
                if(cb && window[cb])
                    window[cb]();
            }
            
            $el.remove();
            if(gExists)
                _Friend.ga.init();
            if(anExists)
                _Friend.an.init();
        },
        
        template: function(item, tmpl){
            if(!tmpl)
                tmpl = '#template';
            
            // change #template to the original template
            tmpl = tmpl.replace('#template', _Friend.templates[item.type]);
            
            for(var k in item){
                var re = new RegExp('#'+k, 'g');
                if(item[k]){
                    var rep = k == 'script' ? item[k] : hs(item[k]);
                    tmpl = tmpl.replace(re, rep);
                }
            }
            
            return tmpl;
        },
    }
    
    $(window._Friend.init);
});