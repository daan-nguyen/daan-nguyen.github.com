conditionizr({
  debug: false,
  ieLessThan: {
    active: true,
    version: '9',
    scripts: false,
    styles: false,
    classes: true,
    // keep customScript on 1 line for IE when not mini
    customScript: '//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.6.1/html5shiv.js, //cdnjs.cloudflare.com/ajax/libs/respond.js/1.1.0/respond.min.js'
  }
});