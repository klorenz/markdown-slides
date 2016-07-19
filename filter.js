graphviz = require('graphviz2svg')
pic2svg = require('pic2svg').pic2svg
plantuml = require('node-plantuml')

mermaid = function(source, config) {
  return source;
}

uml2svg = function(source, config) {
  plantuml = spawnSync("plantuml", ['-pipe', '-tsvg'], {'input': source});
  if (plantuml.error) {
    if (plantuml.error.errno === 'ENOENT') {
      throw new Error("You have to install plantuml: http://plantuml.com/")
    }
  }
  return result.stdout;
}

module.exports = function(data) {
  var content = data.content;
  var config  = data.config;

  if (data.stage === 'filterMarkdown') {
    var re_template = /\n([ \t]*)(\\?)(<HANDLER\s*([^>]*)>([\s\S]*?[^\\])<\/HANDLER>)/;
    var re_esc_template = /\\(<\/?HANDLER>)/;

    var preprocessors = {
      'graph': graphviz.graph2svg,
      'digraph': graphviz.digraph2svg,
      'mermaid': mermaid,
      'pic': pic2svg,
      'puml': uml2svg
    }

    for (handler in preprocessors) {
      var re = new RegExp(re_template.source.replace(/HANDLER/g, handler), "g");
      content = content.replace(re, function(match, ws, bs, block, attr, source){
        if (bs) {
            return "\n" + ws + block;
        } else {

            var preprocessed = preprocessors[handler](source, config)
              .replace(/^<\?xml.*?\?>\s*/, '')
              .replace(/^<!DOCTYPE[^>]*?>\s*/, '');
            return "\n" + ws + '<div class="figure"><span class="'+handler+'"'+ ' ' + (attr || '') + '>'+ preprocessed + "</span></div>";
        }
      });
      re = new RegExp(re_esc_template.source.replace(/HANDLER/g, handler), "g");
      content = content.replace(re, function(match, tag) { return tag });
    }
  }

  if (content) {
    return content
  } else {
    return true
  }
}
