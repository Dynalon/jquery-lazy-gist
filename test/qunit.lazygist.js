module("lazygist");

var originScript = jQuery.getScript;
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

test("jQuery method calling", function() {
    expect(2);
    
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
    
    equal(1, list.length, "should return one element");
    
    //-------
    
    markup = jQuery("<div></div><p></p>");
    list = markup.lazygist();
    
    equal(0, list.length, "should return no element");
    
    //-------
    
    markup = jQuery("<div data-id='1'></div><div data-id='1'></div><div data-id='1'></div><div data-id='1'></div>");
    list = markup.lazygist();
    
    equal(4, list.length, "should return four elements");
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
    
    jQuery.getScript = getScriptStub;
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
    
    jQuery.getScript = getScriptStub;
});

asyncTest("attribute reading 3", function() {
    expect(2);
    
    // stub getScript, to check url values
    jQuery.getScript = function(src) {
        getScriptStub(src);
        
        var expression = /.*github\.com\/(.*)\.js\?file=(.*)/g.exec(src);
        
        equal(expression[1], "1472", "id should be 1472a!");
        equal(expression[2], "undefined", "file should be undefined");
        
        start();
    };
    
    var markup = jQuery("<div data-id='1472'></div>");
    markup.lazygist();
    
    jQuery.getScript = getScriptStub;
});

test("stylesheet append", function() {
    expect(1);
    
    // stub getScript, to check url values
    jQuery.getScript = function(src) {
        getScriptStub(src);
        
        document.write('<link rel="stylesheet" href="https://gist.github.com/stylesheets/gist/embed.css"/>');
    };
    
    var markup = jQuery("<div data-id='1'></div>");
    markup.lazygist();
    
    jQuery.getScript = getScriptStub;
    
    equal(jQuery('head link[rel=stylesheet]').length, 2, "there should be two stylesheets");
});
