# Lazygist

a jQuery plugin that will lazy load your gists.

## Your problem

is, that gists are loaded with a script element inside a page. That can interrupt page loading, if the gist-server is too slow. So here you have a plugin, to load a gist e.g. before the /body ends.

## The solution

Like so many other gist-plugins, this will replace the document.write function to fetch the gist-html code and put it at the correct position. It should not affect other javascript code.

## How to

Create some elements to add the gists to, like

    <div class="gist_here" data-id="1621428" data-file="node_inherits.js"></div>

Let the plugin do the work:

    $('.gist_here').lazygist();

You can always use the load method (make sure you call 'init' before!):

    $('.one_special_gist').lazygist('load');

If you want to reset the document.write function. Call 'reset_write':

    $().lazygist('reset_write');


	
## Options

Pass an object to the lazygist function to configure. These are the defaults:

    lazygist({
        'url_template': 'https://gist.github.com/{id}.js?file={file}',
        'id': 'data-id',
        'file': 'data-file'
    });

###url_template###
  - _String_
  - _{id}_ to set the gist id...
  - _{file}_ (optional) to set a file name

Is used to set the gist github url to fetch. In that url the parameter {id} and {file} get replaced.
If the {file} tag is ommited, github will set it anyway.

###id###
  - _String_

Here we set the attribute name of the gist-element. The content of the attribute will replace the {id} in the _url_template_.

###file###
  - _String_

Set the attribute name of the gist-element for the filename. The content of the attribute will replace the {file} in the _url_template_. Here you can specify which file of the gist (if there are two ore more) to show. This is a feature from the github api.

## License

Licensed under the MIT (see MIT.txt).

## Tested against

  - Chrome 20.0
  - Firefox 13.0., 12.0
  - Internet Explorer 9,8,7
  - Safari 5.1
  - Opera 9.8

## PS

Please provide feedback or create issues (if there are any)!