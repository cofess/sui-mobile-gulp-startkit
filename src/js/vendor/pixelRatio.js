/*===========================
Device/OS Detection
===========================*/
;(function ($) {
    "use strict";
    if (navigator.userAgent.toUpperCase().indexOf('IPHONE OS') !== -1) return; // IOS会缩放，不处理
    var classNames = [];
    var pixelRatio = window.devicePixelRatio || 1;
    classNames.push('pixel-ratio-' + Math.floor(pixelRatio));
    if (pixelRatio >= 2) {
        classNames.push('retina');
    }

    var html = document.getElementsByTagName('html')[0];

    classNames.forEach(function (className) {
        html.classList.add(className);
    });
})(Zepto);
