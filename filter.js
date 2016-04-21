graphviz = require('graphviz2svg')
pic2svg = require('pic2svg').pic2svg

mermaid = function(source, config) {
  return source;
}

module.exports = function(data) {
  var content = data.content;
  var config  = data.config;

  if (data.stage === 'markdown') {
    var re_template = /\n([ \t]*)(\\?)(<HANDLER\s*([^>]*)>([\s\S]*?[^\\])<\/HANDLER>)/;
    var re_esc_template = /\\(<\/?HANDLER>)/;

    var preprocessors = {
      'graph': graphviz.graph2svg,
      'digraph': graphviz.digraph2svg,
      'mermaid': mermaid,
      'pic': pic2svg
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

  return content;
}
