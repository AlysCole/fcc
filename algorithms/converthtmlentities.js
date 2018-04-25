function convert(str) {
  var entities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&ldquo;",
    "'": "&#39;",
  };
  str = str.replace(/[&<>"']/g, function(match) {
    return entities[match];
  });
  return str;
}

convert('Dolce & Gabbana');
