conditionizr({
  debug: false,
  styleSrc: 'stylesheets/',
  ieLessThan: {
    active: true,
    version: '9',
    scripts: false,
    styles: true,
    classes: true,
    // keep customScript on 1 line for IE when not mini
    customScript: '//cdnjs.cloudflare.com/ajax/libs/respond.js/1.1.0/respond.min.js'
  }
});