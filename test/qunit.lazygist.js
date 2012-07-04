
module("lazygist");

var originwrite = document.write,
    originScript = jQuery.getScript;
    
// stub getScript, to not bother github.com
var getScriptStub = function(src) {
    console.log(src);
};
jQuery.getScript = getScriptStub;

test("no parameters set", function() {
    expect(3);
    
    try {
        jQuery("#qunit").lazygist();
        ok(true, "empty option parameter will not throw exception");
    } catch(e) {}
    
    try {
        jQuery().lazygist();
        ok(true, "empty jQuery set will not throw exception");
    } catch(e) {}
    
    try {
        jQuery("#qunit").lazygist({});
        ok(true, "empty object parameter will not throw exception");
    } catch(e) {}
});

test("wrong parameters", function() {
    expect(3);
    
    raises(function() {
        jQuery().lazygist({
            id: function() {}
        });
        
    }, "id option should be forced to be a string");
    
    raises(function() {
        jQuery().lazygist({
            file: function() {}
        });
        
    }, "file option should be forced to be a string");

    raises(function() {
        jQuery().lazygist({
            url_template: function() {}
        });
        
    }, "url_template option should be forced to be a string");
});

test("plugin method calling", function() {
    expect(3);
    
    try {
        jQuery().lazygist("init");
        ok(true, "init is a valid method");
    } catch(e) {}
    
    raises(function() {
        jQuery().lazygist("invalid");
        
    }, "must throw error if method is invalid");
});

test("chainability", function() {
    expect(4);
    
    var markup = jQuery("<div data-id='1'></div>");
    var list = markup.lazygist();
    
    ok(list.is(markup), "should return same elements");
    
    //-------
    
    markup = jQuery("<div data-id='1'></div><p></p>");
    list = markup.lazygist();
    
    equal(list.length, 1, "should return one element");
    
    //-------
    
    markup = jQuery("<div></div><p></p>");
    list = markup.lazygist();
    
    equal(list.length, 0, "should return no element");
    
    //-------
    
    markup = jQuery("<div data-id='1'></div><div data-id='1'></div><div data-id='1'></div><div data-id='1'></div>");
    list = markup.lazygist();
    
    equal(list.length, 4, "should return four elements");
    
    markup.remove();
});

asyncTest("chainability 2", function() {
    expect(2);
    
    var markup = jQuery("<div data-id='4698'></div><p></p><a></a>");
    markup.lazygist();
    var result = markup.lazygist('reset_write');
    
    ok(result.jquery !== undefined, "after reset, resulting object should be jQuery set");
    equal(result.length, 3, "result should have 3 elements");
    
    markup.remove();
    start();
});

asyncTest("attribute reading", function() {
    expect(2);
    
    // stub getScript, to check url values
    jQuery.getScript = function(src) {
        getScriptStub(src);
        
        var expression = /.*github\.com\/(.*)\.js\?file=(.*)/g.exec(src);
        
        equal(expression[1], "1472", "id should be 1472");
        equal(expression[2], "my file", "file should be 'my file'");
        
        start();
    };
    
    var markup = jQuery("<div data-id='1472' data-file='my file'></div>");
    markup.lazygist();
    
    markup.remove();
    jQuery.getScript = originScript;
});

asyncTest("attribute reading 2", function() {
    expect(2);
    
    // stub getScript, to check url values
    jQuery.getScript = function(src) {
        getScriptStub(src);
        
        var expression = /.*github\.com\/(.*)\.js\?file=(.*)/g.exec(src);
        
        equal(expression[1], "1472a!", "id should be 1472a!");
        equal(expression[2], "my%20file%", "file should be 'my%20file%'");
        
        start();
    };
    
    var markup = jQuery("<div data-id='1472a!' data-file='my%20file%'></div>");
    markup.lazygist();
    
    markup.remove();
    jQuery.getScript = originScript;
});

asyncTest("attribute reading 3", function() {
    expect(2);
    
    // stub getScript, to check url values
    jQuery.getScript = function(src) {
        getScriptStub(src);
        
        var expression = /.*github\.com\/(.*)\.js\?file=(.*)/g.exec(src);
        
        equal(expression[1], "14725", "id should be 14725");
        equal(expression[2], "undefined", "file should be undefined");
        
        start();
    };
    
    var markup = jQuery("<div data-id='14725'></div>");
    markup.lazygist();
    
    markup.remove();
    jQuery.getScript = originScript;
});

test("stylesheet append", function() {
    expect(1);
    
    // stub getScript, to check url values
    jQuery.getScript = function(src) {
        getScriptStub(src);
        
        document.write('<link rel="stylesheet" href="https://gist.github.com/stylesheets/gist/embed.css"/>');
    };
    
    var markup = jQuery("<div data-id='123'></div>");
    markup.lazygist();
    
    equal($("head link[rel=stylesheet]").length, 2, "there should be 2 stylesheets");
    
    markup.remove();
    jQuery.getScript = originScript;
});

test("html append", function() {
    expect(1);
    
    // stub getScript, to check url values
    jQuery.getScript = function(src) {
        getScriptStub(src);
        
        document.write('<div id=\"gist-2942256\" class=\"gist\">\n\n    ');
    };
    
    var markup = jQuery("<div class='gist_here' data-id='2942256'></div>"),
        body = jQuery("body").append(markup);
    
    var expected = jQuery(".gist_here").lazygist(),
        result = jQuery('#gist-2942256');
    
    equal(result.length, 1, "should insert one gist html");
    
    jQuery('.gist_here').remove();
    jQuery.getScript = originScript;
});
    
test("html append 2", function() {
    expect(1);
    
    // stub getScript, to check url values
    jQuery.getScript = function(src) {
        getScriptStub(src);
        
        document.write('<div id=\"gist-294\" class=\"gist\">\n\n    ');
    };
    
    var markup = jQuery("<div class='gist_here' data-id='294'></div>"),
        markup2 = jQuery("<div class='gist_here' data-id='294'></div>"),
        body = jQuery("body").append(markup).append(markup2);
    
    var expected = jQuery(".gist_here").lazygist(),
        result = jQuery('[id^="gist-"]');
        
    equal(result.length, 2, "should insert two gist html");
    
    jQuery('.gist_here').remove();
    jQuery.getScript = originScript;
});

test("html append 3", function() {
    expect(1);
    
    var count = 0;
    
    // stub getScript, to check url values
    jQuery.getScript = function(src) {
        getScriptStub(src);
        
        count++;
    };
    
    var markup = jQuery("<div class='gist_here' data-id='42256'></div>"),
        markup2 = jQuery("<div class='gist_here' data-id='42256'></div>"),
        body = jQuery("body").append(markup).append(markup2);
    
    var expected = jQuery(".gist_here").lazygist();
    
    equal(count, 1, "for one gist-id there should be one ajax call");
    
    jQuery('.gist_here').remove();
    jQuery.getScript = originScript;
});

test("already loaded", function() {
    expect(1);
    
    var count = 0;
    
    // stub getScript, to count calls
    jQuery.getScript = function(src) {
        getScriptStub(src);
        
        count++;
    };
    
    var markup = jQuery("<div data-id='47'></div>");
    markup.lazygist();
    markup.lazygist();
    markup.lazygist();
    markup.lazygist();
    
    equal(count, 1, "load gist from same element only once");
    
    markup.remove();
});

asyncTest("restoring of original write function", function() {
    expect(1);
    
    var markup = jQuery("<div data-id='4698'></div>");
    markup.lazygist();
    markup.lazygist('reset_write');
    
    strictEqual(document.write, originwrite);
    
    markup.remove();
    start();
});

test("jQuery method calls", function() {
    expect(1);

    // stub getScript, to count calls
    jQuery.getScript = function(src) {
        getScriptStub(src);
        
        ok(true, "plugin should use jQuery getScript function");
    };
    
    var markup = jQuery('<div data-id="486"></div><p></p>');
    
    markup.lazygist();
    
    markup.remove();
    jQuery.getScript = originScript;
});
