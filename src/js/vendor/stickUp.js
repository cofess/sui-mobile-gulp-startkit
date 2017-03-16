/**
 * Sticky in parent zepto.js Plugin
 * (c) 2016 Alexander Flöter
 * stickyInParent.zepto.js may be freely distributed under the MIT license.
 */
;(function ($) {

    var myObject = {

        options: {
            parentSelector: '[data-stick-parent]',
            addCss: true,
            offset:0,
            type:"top"
        },

        /**
         * Init
         * @param options
         * @param elem
         * @returns {myObject}
         */
        init: function (options, elem) {

            // Mix in the passed-in options with the default options
            this.options = $.extend({}, this.options, options);

            // Save the element references
            this.$elem = $(elem);
            this.$parent = this.$elem.closest(this.options.parentSelector);
            // this.$win = $(window);
            if(this.options.root!=false){
                this.$win = $(this.options.root);
            }else{
                this.$win = $(window);
            }
            
            // Initial calculation
            this._calculate(this);
            this._position(this);            

            // Add event handlers
            this._addEventHandlers();

            // return this so that we can chain and use the bridge with less code.
            return this;

        },

        /**
         *
         * @param fn
         * @param threshhold
         * @param scope
         * @returns {Function}
         * @private
         */
        _throttle: function (fn, threshhold, scope) {
            threshhold = threshhold || 250;
            var last,
                deferTimer;
            return function () {
                var context = scope || this;

                var now = +new Date(),
                    args = arguments;
                if (last && now < last + threshhold) {
                    // hold on to it
                    clearTimeout(deferTimer);
                    deferTimer = setTimeout(function () {
                        last = now;
                        fn.apply(context, args);
                    }, threshhold);
                } else {
                    last = now;
                    fn.apply(context, args);
                }
            };
        },

        /**
         * Calculate positions
         * @param $this
         * @private
         */
        _calculate: function ($this) {

            // Remove styles
            $this.$elem.removeAttr('style');

            // Save values to options
            $this.options.pOffset = $this.$parent.offset();
            $this.options.eOffset = $this.$elem.offset();
            $this.options.pPadding = {
                top: $this.options.eOffset.top - $this.options.pOffset.top, //parseInt($this.$parent.css('padding-top')),
                bottom: parseInt($this.$parent.css('padding-bottom'))
            };
            $this.options.wayPoints = {
                from: $this.options.pOffset.top,
                to: $this.options.pOffset.height + $this.options.pOffset.top - $this.options.eOffset.height - $this.options.pPadding.bottom - $this.options.pPadding.top
            };

            // Add base style to element
            if(this.options.addCss!=false){
                $this.$elem.css({
                    width: $this.options.eOffset.width,
                    height: $this.options.eOffset.height
                });
            }
        },


        /**
         * Position sticky element
         * @param that
         * @private
         */
        _position: function (that) {

            // 参数说明
            // that.$win.scrollTop() : 滚动条高度
            // document.documentElement.clientHeight : 视窗高度
            // that.options.pOffset.top ：父级元素距离视窗顶部的高度
            // that.options.pOffset.height ：父级元素的高度

            var sT = that.$win.scrollTop();
            // console.log("scrollTop:"+sT);
            // console.log(document.documentElement.clientHeight,that.options.pOffset.top,that.options.pOffset.height);
            // console.log("wayPoints.from:"+that.options.wayPoints.from);
            // console.log("wayPoints.to:"+that.options.wayPoints.to);
            // console.log(that.options.eOffset.height,that.options.eOffset.top,that.options.pOffset.height,that.options.pOffset.top);
            // console.log(sT,sT-that.options.eOffset.top-that.options.eOffset.height);
            if(that.options.type=="bottom"){
                //判断父级元素是否在视窗内
                if(sT+document.documentElement.clientHeight>=that.options.pOffset.top && sT+document.documentElement.clientHeight<that.options.pOffset.top+that.options.pOffset.height){
                    if(that.options.addCss!=false){
                        that.$elem.css({
                            position: 'fixed',
                            top: 'auto',
                            bottom:that.options.pPadding.bottom+that.options.offset,
                            left: that.options.eOffset.left,
                            width: that.options.eOffset.width
                        })
                    }
                    that.$elem.addClass('stick stick-bottom');
                }else{
                    if(that.options.addCss!=false){
                        that.$elem.removeAttr('style');
                    }
                    that.$elem.removeClass('stick stick-bottom');
                }
            }else{
                // Stick within paren
                if (sT > that.options.pOffset.top && sT+that.options.pOffset.top<that.options.pOffset.top+that.options.pOffset.height) {
                    if(that.options.addCss!=false){
                        that.$elem.css({
                            position: 'fixed',
                            top: that.options.pPadding.top+that.options.offset,
                            bottom:'auto',
                            left: that.options.eOffset.left,
                            width: that.options.eOffset.width
                        })                   
                    }
                    that.$elem.addClass('stick stick-top');            
                }

                // Top of parent
                else {
                    if(that.options.addCss!=false){
                        // that.$elem.css({
                        //     position: 'absolute',
                        //     top: that.options.pPadding.top,
                        //     left: that.options.eOffset.left - that.options.pOffset.left
                        // })
                        that.$elem.removeAttr('style');
                    }
                    that.$elem.removeClass('stick stick-top');
                }
            }

        },

        /**
         * has sticky element
         * @param that
         * @private
         */
        _hasStick: function (that) {

            if(this.$parent.find('.stick').length>0 && that.options.parentClass!=false){
                this.$parent.addClass(that.options.parentClass);
            }else{
                this.$parent.removeClass(that.options.parentClass);
            }
        },


        /**
         * Attach event handlers to $(window)
         * @private
         */
        _addEventHandlers: function () {

            var that = this;

            // Event function
            var fn = function (e) {

                // Recalculate on resize
                if (e.type == 'resize') {
                    that._calculate(that);
                }

                // Position element
                that._position(that);

                // has stick element
                that._hasStick(that);                

            };

            // Attach handler
            this.$win.on('load resize scroll', this._throttle(fn, 25));
            // $(document).on('load resize scroll', this._throttle(fn, 25));
        }
    };

    // Object.create support test, and fallback for browsers without it
    if (typeof Object.create !== "function") {
        Object.create = function (o) {
            function F() {
            }

            F.prototype = o;
            return new F();
        };
    }

    // Create a plugin based on a defined object
    $.plugin = function (name, object) {
        $.fn[name] = function (options) {
            return this.each(function () {
                if (!$.data(this, name)) {
                    $.data(this, name, Object.create(object).init(
                        options, this));
                }
            });
        };
    };

    // Register plugin
    $.plugin('stickUp', myObject);

})(Zepto);
