(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.app = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * `app` module
 * ============
 *
 * Provides the game initialization routine.
 */

'use strict';
//
//  Import configuration and game states.
var config = require('./config');
var states = require('./states');

//  Add all required states and boot the game.
exports.init = function () {
  var game = new Phaser.Game(config);

  Object
    .keys(states)
    .forEach(function (key) {
      game.state.add(key, states[key]);
    });

  game.state.start('Boot');

  return game;
};

},{"./config":3,"./states":8}],2:[function(require,module,exports){
/*
 * `assets` module
 * ===============
 *
 * Declares static asset packs to be loaded using the `Phaser.Loader#pack`
 * method. Use this module to declare game assets.
 */

'use strict';
//
//  -- Splash screen assets used by the Preloader.
exports.preloaderAssets = [{
  key: 'splash-screen',
  type: 'image'
}, {
  key: 'progress-bar',
  type: 'image'
}];

//  -- General assets used throughout the game.
exports.gameAssets = [{
  key: 'phaser',
  type: 'image'
}];

},{}],3:[function(require,module,exports){
/*
 * `config` module
 * ===============
 *
 * The game instance settings.
 */
//
//  The game canvas dimensions.
exports.width = 640;
exports.height = 480;

//  Choose the rendering method. Available values are:
//  * WEBGL: Use WebGL rendering;
//  * CANVAS: Use 'context2D' API rendering method;
//  * AUTO: Phaser will choose, based on the device capabilities, the best
//          rendering method to be used.
exports.renderer = Phaser.AUTO;

//  Declare the pixel density of the game graphics.
exports.resolution = 1;

//  Uncomment to disable rendering anti-aliasing. Great for pixel art.
// exports.antialias = false;

//  Uncomment to enable WebGL multi-texture features.
// exports.multiTexture = true;

//  Uncomment to enable canvas transparency.
// exports.transparent = true;

//  Uncomment to disable the Phaser debugging API.
//  TODO: Automate the production build to conditionally enable this flag.
// exports.enableDebug = false;

},{}],4:[function(require,module,exports){
/*
 * Logo
 * ====
 *
 * A simple prefab (extended game object class), displaying a spinning Phaser
 * logo.
 */
//
'use strict';

function Logo(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'phaser');

  this.anchor.set(0.5);
}
Logo.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = Logo.prototype.constructor = Logo;

Logo.prototype.update = function () {
  this.angle += 0.1;
};

},{}],5:[function(require,module,exports){
/*
 * Boot state
 * ==========
 *
 * The first state of the game. Adjust the game appearance, number of input
 * pointers, screen orientation handling etc. using this game state.
 */

'use strict';
//
var assets = require('../assets');

exports.preload = function (game) {
  //  Point Phaser Asset Loader to where your game assets live.
  game.load.path = 'assets/';

  //  Initialize physics engines here. Remember that Phaser builds including
  //  Arcade Physics have it enabled by default.
  // game.physics.startSystem(Phaser.Physics.P2);

  //  Adjust how many pointers Phaser will check for input events.
  game.input.maxPointers = 2;

  //  Set the alignment of the game canvas within the page.
  game.scale.pageAlignHorizontally = true;

  //  Adjust the scaling mode of the game canvas. Example: If you're developing
  //  a pixel-art game, set it to 'USER_SCALE'.
  game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;

  //  When using 'USER_SCALE' scaling mode, use this method to adjust the
  //  scaling factor.
  // game.scale.setUserScale(2);

  //  Uncomment the following line to adjust the rendering of the canvas to
  //  crisp graphics. Great for pixel-art!
  // Phaser.Canvas.setImageRenderingCrisp(game.canvas);

  //  If the game canvas loses focus, keep the game loop running.
  game.stage.disableVisibilityChange = true;

  //  Whether to use frame-based interpolations or not.
  game.tweens.frameBased = false;

  //  Load the graphical assets required to show the splash screen.
  game.load.pack('preloaderAssets', null, assets);
};

exports.create = function (game) {
  //  After applying the first adjustments and loading the splash screen
  //  assets, move to the next game state.
  game.state.start('Preloader');
};

},{"../assets":2}],6:[function(require,module,exports){
/*
 * Game state
 * ==========
 *
 * A sample Game state, displaying the Phaser logo.
 */

'use strict';

var Logo = require('../objects/Logo');
//
exports.create = function (game) {
  //  TODO: Replace this content with really cool game code here :)
  var x = game.world.centerX;
  var y = game.world.centerY;
  game.add.existing(new Logo(game, x, y));
};

},{"../objects/Logo":4}],7:[function(require,module,exports){
/*
 * Preloader state
 * ===============
 *
 * Takes care of loading the main game assets, including graphics and sound
 * effects, while displaying a busy splash screen.
 */

'use strict';
//
var assets = require('../assets');

function showSplashScreen (game) {
  game.add.image(0, 0, 'splash-screen');
  game.load.setPreloadSprite(game.add.image(82, 282, 'progress-bar'));
}

exports.preload = function (game) {
  showSplashScreen(game);
  game.load.pack('gameAssets', null, assets);
};

exports.create = function (game) {
  //  Here is a good place to initialize plugins dependent of any game asset.
  //  Don't forget to `require` them first. Example:
  // game.myPlugin = game.plugins.add(MyPlugin/*, ... parameters ... */);

  game.state.start('Game');
};

},{"../assets":2}],8:[function(require,module,exports){
/*
 * `states` module
 * ===============
 *
 * Declares all present game states.
 * Expose the required game states using this module.
 */

'use strict';
//
exports.Boot = require('./Boot');
exports.Preloader = require('./Preloader');
exports.Game = require('./Game');

},{"./Boot":5,"./Game":6,"./Preloader":7}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2Fzc2V0cy5qcyIsInNyYy9jb25maWcuanMiLCJzcmMvb2JqZWN0cy9Mb2dvLmpzIiwic3JjL3N0YXRlcy9Cb290LmpzIiwic3JjL3N0YXRlcy9HYW1lLmpzIiwic3JjL3N0YXRlcy9QcmVsb2FkZXIuanMiLCJzcmMvc3RhdGVzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcclxuICogYGFwcGAgbW9kdWxlXHJcbiAqID09PT09PT09PT09PVxyXG4gKlxyXG4gKiBQcm92aWRlcyB0aGUgZ2FtZSBpbml0aWFsaXphdGlvbiByb3V0aW5lLlxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuLy9cclxuLy8gIEltcG9ydCBjb25maWd1cmF0aW9uIGFuZCBnYW1lIHN0YXRlcy5cclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJyk7XHJcbnZhciBzdGF0ZXMgPSByZXF1aXJlKCcuL3N0YXRlcycpO1xyXG5cclxuLy8gIEFkZCBhbGwgcmVxdWlyZWQgc3RhdGVzIGFuZCBib290IHRoZSBnYW1lLlxyXG5leHBvcnRzLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoY29uZmlnKTtcclxuXHJcbiAgT2JqZWN0XHJcbiAgICAua2V5cyhzdGF0ZXMpXHJcbiAgICAuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgIGdhbWUuc3RhdGUuYWRkKGtleSwgc3RhdGVzW2tleV0pO1xyXG4gICAgfSk7XHJcblxyXG4gIGdhbWUuc3RhdGUuc3RhcnQoJ0Jvb3QnKTtcclxuXHJcbiAgcmV0dXJuIGdhbWU7XHJcbn07XHJcbiIsIi8qXHJcbiAqIGBhc3NldHNgIG1vZHVsZVxyXG4gKiA9PT09PT09PT09PT09PT1cclxuICpcclxuICogRGVjbGFyZXMgc3RhdGljIGFzc2V0IHBhY2tzIHRvIGJlIGxvYWRlZCB1c2luZyB0aGUgYFBoYXNlci5Mb2FkZXIjcGFja2BcclxuICogbWV0aG9kLiBVc2UgdGhpcyBtb2R1bGUgdG8gZGVjbGFyZSBnYW1lIGFzc2V0cy5cclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcbi8vXHJcbi8vICAtLSBTcGxhc2ggc2NyZWVuIGFzc2V0cyB1c2VkIGJ5IHRoZSBQcmVsb2FkZXIuXHJcbmV4cG9ydHMucHJlbG9hZGVyQXNzZXRzID0gW3tcclxuICBrZXk6ICdzcGxhc2gtc2NyZWVuJyxcclxuICB0eXBlOiAnaW1hZ2UnXHJcbn0sIHtcclxuICBrZXk6ICdwcm9ncmVzcy1iYXInLFxyXG4gIHR5cGU6ICdpbWFnZSdcclxufV07XHJcblxyXG4vLyAgLS0gR2VuZXJhbCBhc3NldHMgdXNlZCB0aHJvdWdob3V0IHRoZSBnYW1lLlxyXG5leHBvcnRzLmdhbWVBc3NldHMgPSBbe1xyXG4gIGtleTogJ3BoYXNlcicsXHJcbiAgdHlwZTogJ2ltYWdlJ1xyXG59XTtcclxuIiwiLypcbiAqIGBjb25maWdgIG1vZHVsZVxuICogPT09PT09PT09PT09PT09XG4gKlxuICogVGhlIGdhbWUgaW5zdGFuY2Ugc2V0dGluZ3MuXG4gKi9cbi8vXG4vLyAgVGhlIGdhbWUgY2FudmFzIGRpbWVuc2lvbnMuXG5leHBvcnRzLndpZHRoID0gNjQwO1xuZXhwb3J0cy5oZWlnaHQgPSA0ODA7XG5cbi8vICBDaG9vc2UgdGhlIHJlbmRlcmluZyBtZXRob2QuIEF2YWlsYWJsZSB2YWx1ZXMgYXJlOlxuLy8gICogV0VCR0w6IFVzZSBXZWJHTCByZW5kZXJpbmc7XG4vLyAgKiBDQU5WQVM6IFVzZSAnY29udGV4dDJEJyBBUEkgcmVuZGVyaW5nIG1ldGhvZDtcbi8vICAqIEFVVE86IFBoYXNlciB3aWxsIGNob29zZSwgYmFzZWQgb24gdGhlIGRldmljZSBjYXBhYmlsaXRpZXMsIHRoZSBiZXN0XG4vLyAgICAgICAgICByZW5kZXJpbmcgbWV0aG9kIHRvIGJlIHVzZWQuXG5leHBvcnRzLnJlbmRlcmVyID0gUGhhc2VyLkFVVE87XG5cbi8vICBEZWNsYXJlIHRoZSBwaXhlbCBkZW5zaXR5IG9mIHRoZSBnYW1lIGdyYXBoaWNzLlxuZXhwb3J0cy5yZXNvbHV0aW9uID0gMTtcblxuLy8gIFVuY29tbWVudCB0byBkaXNhYmxlIHJlbmRlcmluZyBhbnRpLWFsaWFzaW5nLiBHcmVhdCBmb3IgcGl4ZWwgYXJ0LlxuLy8gZXhwb3J0cy5hbnRpYWxpYXMgPSBmYWxzZTtcblxuLy8gIFVuY29tbWVudCB0byBlbmFibGUgV2ViR0wgbXVsdGktdGV4dHVyZSBmZWF0dXJlcy5cbi8vIGV4cG9ydHMubXVsdGlUZXh0dXJlID0gdHJ1ZTtcblxuLy8gIFVuY29tbWVudCB0byBlbmFibGUgY2FudmFzIHRyYW5zcGFyZW5jeS5cbi8vIGV4cG9ydHMudHJhbnNwYXJlbnQgPSB0cnVlO1xuXG4vLyAgVW5jb21tZW50IHRvIGRpc2FibGUgdGhlIFBoYXNlciBkZWJ1Z2dpbmcgQVBJLlxuLy8gIFRPRE86IEF1dG9tYXRlIHRoZSBwcm9kdWN0aW9uIGJ1aWxkIHRvIGNvbmRpdGlvbmFsbHkgZW5hYmxlIHRoaXMgZmxhZy5cbi8vIGV4cG9ydHMuZW5hYmxlRGVidWcgPSBmYWxzZTtcbiIsIi8qXHJcbiAqIExvZ29cclxuICogPT09PVxyXG4gKlxyXG4gKiBBIHNpbXBsZSBwcmVmYWIgKGV4dGVuZGVkIGdhbWUgb2JqZWN0IGNsYXNzKSwgZGlzcGxheWluZyBhIHNwaW5uaW5nIFBoYXNlclxyXG4gKiBsb2dvLlxyXG4gKi9cclxuLy9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuZnVuY3Rpb24gTG9nbyhnYW1lLCB4LCB5KSB7XHJcbiAgUGhhc2VyLlNwcml0ZS5jYWxsKHRoaXMsIGdhbWUsIHgsIHksICdwaGFzZXInKTtcclxuXHJcbiAgdGhpcy5hbmNob3Iuc2V0KDAuNSk7XHJcbn1cclxuTG9nby5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBoYXNlci5TcHJpdGUucHJvdG90eXBlKTtcclxubW9kdWxlLmV4cG9ydHMgPSBMb2dvLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IExvZ287XHJcblxyXG5Mb2dvLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5hbmdsZSArPSAwLjE7XHJcbn07XHJcbiIsIi8qXHJcbiAqIEJvb3Qgc3RhdGVcclxuICogPT09PT09PT09PVxyXG4gKlxyXG4gKiBUaGUgZmlyc3Qgc3RhdGUgb2YgdGhlIGdhbWUuIEFkanVzdCB0aGUgZ2FtZSBhcHBlYXJhbmNlLCBudW1iZXIgb2YgaW5wdXRcclxuICogcG9pbnRlcnMsIHNjcmVlbiBvcmllbnRhdGlvbiBoYW5kbGluZyBldGMuIHVzaW5nIHRoaXMgZ2FtZSBzdGF0ZS5cclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcbi8vXHJcbnZhciBhc3NldHMgPSByZXF1aXJlKCcuLi9hc3NldHMnKTtcclxuXHJcbmV4cG9ydHMucHJlbG9hZCA9IGZ1bmN0aW9uIChnYW1lKSB7XHJcbiAgLy8gIFBvaW50IFBoYXNlciBBc3NldCBMb2FkZXIgdG8gd2hlcmUgeW91ciBnYW1lIGFzc2V0cyBsaXZlLlxyXG4gIGdhbWUubG9hZC5wYXRoID0gJ2Fzc2V0cy8nO1xyXG5cclxuICAvLyAgSW5pdGlhbGl6ZSBwaHlzaWNzIGVuZ2luZXMgaGVyZS4gUmVtZW1iZXIgdGhhdCBQaGFzZXIgYnVpbGRzIGluY2x1ZGluZ1xyXG4gIC8vICBBcmNhZGUgUGh5c2ljcyBoYXZlIGl0IGVuYWJsZWQgYnkgZGVmYXVsdC5cclxuICAvLyBnYW1lLnBoeXNpY3Muc3RhcnRTeXN0ZW0oUGhhc2VyLlBoeXNpY3MuUDIpO1xyXG5cclxuICAvLyAgQWRqdXN0IGhvdyBtYW55IHBvaW50ZXJzIFBoYXNlciB3aWxsIGNoZWNrIGZvciBpbnB1dCBldmVudHMuXHJcbiAgZ2FtZS5pbnB1dC5tYXhQb2ludGVycyA9IDI7XHJcblxyXG4gIC8vICBTZXQgdGhlIGFsaWdubWVudCBvZiB0aGUgZ2FtZSBjYW52YXMgd2l0aGluIHRoZSBwYWdlLlxyXG4gIGdhbWUuc2NhbGUucGFnZUFsaWduSG9yaXpvbnRhbGx5ID0gdHJ1ZTtcclxuXHJcbiAgLy8gIEFkanVzdCB0aGUgc2NhbGluZyBtb2RlIG9mIHRoZSBnYW1lIGNhbnZhcy4gRXhhbXBsZTogSWYgeW91J3JlIGRldmVsb3BpbmdcclxuICAvLyAgYSBwaXhlbC1hcnQgZ2FtZSwgc2V0IGl0IHRvICdVU0VSX1NDQUxFJy5cclxuICBnYW1lLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuTk9fU0NBTEU7XHJcblxyXG4gIC8vICBXaGVuIHVzaW5nICdVU0VSX1NDQUxFJyBzY2FsaW5nIG1vZGUsIHVzZSB0aGlzIG1ldGhvZCB0byBhZGp1c3QgdGhlXHJcbiAgLy8gIHNjYWxpbmcgZmFjdG9yLlxyXG4gIC8vIGdhbWUuc2NhbGUuc2V0VXNlclNjYWxlKDIpO1xyXG5cclxuICAvLyAgVW5jb21tZW50IHRoZSBmb2xsb3dpbmcgbGluZSB0byBhZGp1c3QgdGhlIHJlbmRlcmluZyBvZiB0aGUgY2FudmFzIHRvXHJcbiAgLy8gIGNyaXNwIGdyYXBoaWNzLiBHcmVhdCBmb3IgcGl4ZWwtYXJ0IVxyXG4gIC8vIFBoYXNlci5DYW52YXMuc2V0SW1hZ2VSZW5kZXJpbmdDcmlzcChnYW1lLmNhbnZhcyk7XHJcblxyXG4gIC8vICBJZiB0aGUgZ2FtZSBjYW52YXMgbG9zZXMgZm9jdXMsIGtlZXAgdGhlIGdhbWUgbG9vcCBydW5uaW5nLlxyXG4gIGdhbWUuc3RhZ2UuZGlzYWJsZVZpc2liaWxpdHlDaGFuZ2UgPSB0cnVlO1xyXG5cclxuICAvLyAgV2hldGhlciB0byB1c2UgZnJhbWUtYmFzZWQgaW50ZXJwb2xhdGlvbnMgb3Igbm90LlxyXG4gIGdhbWUudHdlZW5zLmZyYW1lQmFzZWQgPSBmYWxzZTtcclxuXHJcbiAgLy8gIExvYWQgdGhlIGdyYXBoaWNhbCBhc3NldHMgcmVxdWlyZWQgdG8gc2hvdyB0aGUgc3BsYXNoIHNjcmVlbi5cclxuICBnYW1lLmxvYWQucGFjaygncHJlbG9hZGVyQXNzZXRzJywgbnVsbCwgYXNzZXRzKTtcclxufTtcclxuXHJcbmV4cG9ydHMuY3JlYXRlID0gZnVuY3Rpb24gKGdhbWUpIHtcclxuICAvLyAgQWZ0ZXIgYXBwbHlpbmcgdGhlIGZpcnN0IGFkanVzdG1lbnRzIGFuZCBsb2FkaW5nIHRoZSBzcGxhc2ggc2NyZWVuXHJcbiAgLy8gIGFzc2V0cywgbW92ZSB0byB0aGUgbmV4dCBnYW1lIHN0YXRlLlxyXG4gIGdhbWUuc3RhdGUuc3RhcnQoJ1ByZWxvYWRlcicpO1xyXG59O1xyXG4iLCIvKlxyXG4gKiBHYW1lIHN0YXRlXHJcbiAqID09PT09PT09PT1cclxuICpcclxuICogQSBzYW1wbGUgR2FtZSBzdGF0ZSwgZGlzcGxheWluZyB0aGUgUGhhc2VyIGxvZ28uXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIExvZ28gPSByZXF1aXJlKCcuLi9vYmplY3RzL0xvZ28nKTtcclxuLy9cclxuZXhwb3J0cy5jcmVhdGUgPSBmdW5jdGlvbiAoZ2FtZSkge1xyXG4gIC8vICBUT0RPOiBSZXBsYWNlIHRoaXMgY29udGVudCB3aXRoIHJlYWxseSBjb29sIGdhbWUgY29kZSBoZXJlIDopXHJcbiAgdmFyIHggPSBnYW1lLndvcmxkLmNlbnRlclg7XHJcbiAgdmFyIHkgPSBnYW1lLndvcmxkLmNlbnRlclk7XHJcbiAgZ2FtZS5hZGQuZXhpc3RpbmcobmV3IExvZ28oZ2FtZSwgeCwgeSkpO1xyXG59O1xyXG4iLCIvKlxyXG4gKiBQcmVsb2FkZXIgc3RhdGVcclxuICogPT09PT09PT09PT09PT09XHJcbiAqXHJcbiAqIFRha2VzIGNhcmUgb2YgbG9hZGluZyB0aGUgbWFpbiBnYW1lIGFzc2V0cywgaW5jbHVkaW5nIGdyYXBoaWNzIGFuZCBzb3VuZFxyXG4gKiBlZmZlY3RzLCB3aGlsZSBkaXNwbGF5aW5nIGEgYnVzeSBzcGxhc2ggc2NyZWVuLlxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuLy9cclxudmFyIGFzc2V0cyA9IHJlcXVpcmUoJy4uL2Fzc2V0cycpO1xyXG5cclxuZnVuY3Rpb24gc2hvd1NwbGFzaFNjcmVlbiAoZ2FtZSkge1xyXG4gIGdhbWUuYWRkLmltYWdlKDAsIDAsICdzcGxhc2gtc2NyZWVuJyk7XHJcbiAgZ2FtZS5sb2FkLnNldFByZWxvYWRTcHJpdGUoZ2FtZS5hZGQuaW1hZ2UoODIsIDI4MiwgJ3Byb2dyZXNzLWJhcicpKTtcclxufVxyXG5cclxuZXhwb3J0cy5wcmVsb2FkID0gZnVuY3Rpb24gKGdhbWUpIHtcclxuICBzaG93U3BsYXNoU2NyZWVuKGdhbWUpO1xyXG4gIGdhbWUubG9hZC5wYWNrKCdnYW1lQXNzZXRzJywgbnVsbCwgYXNzZXRzKTtcclxufTtcclxuXHJcbmV4cG9ydHMuY3JlYXRlID0gZnVuY3Rpb24gKGdhbWUpIHtcclxuICAvLyAgSGVyZSBpcyBhIGdvb2QgcGxhY2UgdG8gaW5pdGlhbGl6ZSBwbHVnaW5zIGRlcGVuZGVudCBvZiBhbnkgZ2FtZSBhc3NldC5cclxuICAvLyAgRG9uJ3QgZm9yZ2V0IHRvIGByZXF1aXJlYCB0aGVtIGZpcnN0LiBFeGFtcGxlOlxyXG4gIC8vIGdhbWUubXlQbHVnaW4gPSBnYW1lLnBsdWdpbnMuYWRkKE15UGx1Z2luLyosIC4uLiBwYXJhbWV0ZXJzIC4uLiAqLyk7XHJcblxyXG4gIGdhbWUuc3RhdGUuc3RhcnQoJ0dhbWUnKTtcclxufTtcclxuIiwiLypcclxuICogYHN0YXRlc2AgbW9kdWxlXHJcbiAqID09PT09PT09PT09PT09PVxyXG4gKlxyXG4gKiBEZWNsYXJlcyBhbGwgcHJlc2VudCBnYW1lIHN0YXRlcy5cclxuICogRXhwb3NlIHRoZSByZXF1aXJlZCBnYW1lIHN0YXRlcyB1c2luZyB0aGlzIG1vZHVsZS5cclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcbi8vXHJcbmV4cG9ydHMuQm9vdCA9IHJlcXVpcmUoJy4vQm9vdCcpO1xyXG5leHBvcnRzLlByZWxvYWRlciA9IHJlcXVpcmUoJy4vUHJlbG9hZGVyJyk7XHJcbmV4cG9ydHMuR2FtZSA9IHJlcXVpcmUoJy4vR2FtZScpO1xyXG4iXX0=
