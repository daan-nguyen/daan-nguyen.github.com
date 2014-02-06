(function(window, document) {
  "use strict";

  var _smoothy = window.smoothy = {};

  // easing formulas
  // http://www.gizma.com/easing/
  var _easing = {
    easeInOutCubic: function (t, b, c, d) {
                      t /= d/2;
                      if (t < 1) return c/2*t*t*t + b;
                      t -= 2;
                      return c/2*(t*t*t + 2) + b;
                    }
  };

  // default options
  var _options = {
    duration: 1500,
    easing: _easing.easeInOutCubic,
    headerOffset: 0
  };

  // animation functions
  var _animationId;
  var _startTime;

  var _animateScroll = function(startOffset, deltaOffset, duration) {
    var nowTime = (new Date()).getTime();
    if (!_startTime) _startTime = nowTime;
    var animationTime = nowTime - _startTime;

    if (animationTime <= duration) {
      _animationId = window.requestAnimationFrame(_animateScroll.bind(null, startOffset, deltaOffset, duration));
    } else {
      _stopScrollTo();
    }

    document.documentElement.scrollTop = _easing.easeInOutCubic(animationTime, startOffset, deltaOffset, duration);
  };

  // stop function
  var _stopScrollTo = function() {
    _startTime = false;
    window.cancelAnimationFrame(_animationId);
  };

  smoothy.scrollTo = function(targetOffset) {
    var startOffset = window.pageYOffset;
    var deltaOffset = targetOffset - startOffset;

    _animateScroll(startOffset, deltaOffset, _options.duration);
  };

  smoothy.initOptions = function(options) {
    for (var key in options) {
      if (_options.hasOwnProperty(key) && options[key]) {
        _options[key] = options[key];
      }
    }
  };

  smoothy.initAnchors = function(options) {
    if (options) smoothy.initOptions(options);

    document.body.addEventListener('click', function(event) {
      if (event.target.tagName.toLowerCase() === 'a') {
        var href = event.target.attributes.href.value;

        if (href && href.indexOf('#') === 0 && href.substring(1).length > 0) {
          event.preventDefault();

          var targetEl = document.querySelector(href) || document.querySelector('a[name=' + href.substring(1) + ']');
          smoothy.scrollTo(targetEl.offsetTop);

        }
      }
    }, false);
  };

})(window, document);