# Lazygist

a jQuery plugin that will lazy load your gists.

## Your problem

is, that gists are loaded with a script element inside a page. That can interrupt page loading, if the gist-server is too slow. So here you have a plugin, to load a gist e.g. before the </body> ends.

## The solution

Like so many other gist-plugins, this will replace the document.write function to fetch the gist-html code and put at the correct position. It should not affect other javascript code.

## How to

Create some elements to add the gists to, like

    <div class="gist_here" data-id="1621428" data-file="node_inherits.js"></div>

Let the plugin do the work:

    $('.gist_here').lazygist();
	
## Options

There are options, but they are not documented yet...

## PS

Please provide feedback or create issues!