/**
 * 微信小程序适配器
 * 让 Phaser 能在小程序环境运行
 */

// 获取系统信息
const systemInfo = wx.getSystemInfoSync();
const isDevTool = systemInfo.platform === 'devtools';

// Canvas 适配
function Canvas() {
  const canvas = wx.createCanvas();
  canvas.type = 'canvas';
  
  // 适配 bindingContext
  canvas.bindingContext = canvas.bindingContext || canvas._bindbindbindingContext;
  
  // 兼容 style
  canvas.style = canvas.style || {};
  canvas.style.width = systemInfo.windowWidth + 'px';
  canvas.style.height = systemInfo.windowHeight + 'px';
  
  // 兼容方法
  canvas.getBoundingClientRect = function() {
    return {
      top: 0,
      left: 0,
      width: systemInfo.windowWidth,
      height: systemInfo.windowHeight,
      x: 0,
      y: 0,
    };
  };
  
  // 禁用全屏方法
  canvas.requestFullscreen = function() {};
  canvas.exitFullscreen = function() {};
  
  return canvas;
}

// Image 适配
function Image() {
  const img = wx.createImage();
  return img;
}

// 事件适配
class TouchEvent {
  constructor(type) {
    this.type = type;
    this.target = null;
    this.currentTarget = null;
    this.touches = [];
    this.changedTouches = [];
    this.timeStamp = Date.now();
    this.preventDefault = function() {};
    this.stopPropagation = function() {};
  }
}

// Document 适配
const document = {
  readyState: 'complete',
  visibilityState: 'visible',
  hidden: false,
  fullscreen: false,
  
  documentElement: {
    style: {},
    classList: {
      add: function() {},
      remove: function() {},
    },
  },
  
  head: {
    appendChild: function() {},
    removeChild: function() {},
  },
  
  body: {
    appendChild: function() {},
    removeChild: function() {},
    style: {},
  },
  
  createElement: function(tagName) {
    tagName = tagName.toLowerCase();
    if (tagName === 'canvas') {
      return Canvas();
    } else if (tagName === 'img') {
      return Image();
    } else if (tagName === 'audio') {
      return wx.createInnerAudioContext();
    }
    return {
      style: {},
      classList: { add: function(){}, remove: function(){} },
      appendChild: function() {},
      removeChild: function() {},
      setAttribute: function() {},
      getAttribute: function() {},
    };
  },
  
  getElementById: function() {
    return null;
  },
  
  getElementsByTagName: function() {
    return [];
  },
  
  querySelector: function() {
    return null;
  },
  
  querySelectorAll: function() {
    return [];
  },
  
  addEventListener: function(type, listener) {
    if (type === 'visibilitychange') {
      wx.onShow(function() {
        document.visibilityState = 'visible';
        document.hidden = false;
        listener();
      });
      wx.onHide(function() {
        document.visibilityState = 'hidden';
        document.hidden = true;
        listener();
      });
    }
  },
  
  removeEventListener: function() {},
  
  createEvent: function() {
    return {
      initEvent: function() {},
    };
  },
};

// Window 适配
const _window = {
  innerWidth: systemInfo.windowWidth,
  innerHeight: systemInfo.windowHeight,
  devicePixelRatio: systemInfo.pixelRatio,
  
  screen: {
    availWidth: systemInfo.screenWidth,
    availHeight: systemInfo.screenHeight,
    width: systemInfo.screenWidth,
    height: systemInfo.screenHeight,
  },
  
  navigator: {
    userAgent: 'wechat-miniprogram',
    platform: systemInfo.platform,
    language: systemInfo.language,
  },
  
  location: {
    href: 'game.js',
    protocol: 'https:',
    host: '',
    hostname: '',
    port: '',
    pathname: '/game.js',
    search: '',
    hash: '',
  },
  
  localStorage: {
    getItem: function(key) {
      return wx.getStorageSync(key) || null;
    },
    setItem: function(key, value) {
      wx.setStorageSync(key, value);
    },
    removeItem: function(key) {
      wx.removeStorageSync(key);
    },
    clear: function() {
      wx.clearStorageSync();
    },
  },
  
  performance: {
    now: function() {
      return Date.now();
    },
  },
  
  requestAnimationFrame: function(callback) {
    return wx.requestAnimationFrame ? wx.requestAnimationFrame(callback) : setTimeout(callback, 16);
  },
  
  cancelAnimationFrame: function(id) {
    return wx.cancelAnimationFrame ? wx.cancelAnimationFrame(id) : clearTimeout(id);
  },
  
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  
  addEventListener: function(type, listener) {
    if (type === 'resize') {
      wx.onWindowResize && wx.onWindowResize(function(res) {
        _window.innerWidth = res.windowWidth;
        _window.innerHeight = res.windowHeight;
        listener({
          target: _window,
          type: 'resize',
        });
      });
    }
  },
  
  removeEventListener: function() {},
  
  Image: Image,
  Canvas: Canvas,
  TouchEvent: TouchEvent,
  HTMLCanvasElement: Canvas,
  HTMLImageElement: Image,
  
  // Fullscreen API 禁用
  requestFullscreen: function() {},
  exitFullscreen: function() {},
  
  document: document,
};

// 设置全局对象
if (typeof window === 'undefined') {
  GameGlobal.window = _window;
  GameGlobal.document = document;
  GameGlobal.Image = Image;
  GameGlobal.Canvas = Canvas;
  GameGlobal.HTMLCanvasElement = Canvas;
  GameGlobal.HTMLImageElement = Image;
  GameGlobal.TouchEvent = TouchEvent;
  GameGlobal.navigator = _window.navigator;
  GameGlobal.localStorage = _window.localStorage;
  GameGlobal.location = _window.location;
  GameGlobal.requestAnimationFrame = _window.requestAnimationFrame;
  GameGlobal.cancelAnimationFrame = _window.cancelAnimationFrame;
  GameGlobal.performance = _window.performance;
  GameGlobal.screen = _window.screen;
}

// 导出
module.exports = {
  window: _window,
  document: document,
  Image: Image,
  Canvas: Canvas,
};
