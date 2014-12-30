/**
 * 走马灯
 * author herbert
 *
 * usage:
 * var myMarquee = new Marquee(hotCourseListBox, {
        startSlide: 2,
        auto: 3000,
        deceleration: 1, //降速比例，默认5
        continuous: true,
        disableScroll: false,
        stopPropagation: false,
        callback: function (index, elem) {
        },
        transitionEnd: function (index, elem) {
        }
    });
 *
 */

function Marquee(container, opts) {
    opts = opts || {};
    this.container = $(container) || $(opts.container || '#js-marquee');//获取content
    if (!this.container) return;
    if (opts.children) {
        this.children = this.container.find(opts.children);
    }

    if (!this.children || !this.children.length) {
        //没有找到子节点
        this.children = this.container.children();//获取子节点
    }

    this.length = this.children.length || 0;
    if (!this.length) return;
    this.margin = opts.margin || {}; //元素之间的间距
    this.lefts = [];//存储每个子元素宽度（包含margin），用来移动位置
    this.speed = opts.speed || 0;//滑动速度，默认0ms
    this.index = opts.startSlide || 0;//当前展示的位置
    //this.isMoving = false;//是否正在移动
    this.deceleration = opts.deceleration || 5;//降速比例
    this.opts = opts;

    this._initialize();//在初始化DOM
}

function translate(style, dist, speed) {

    //console.log(arguments , '==========');

    if (!style) return;

    style.webkitTransitionDuration =
        style.MozTransitionDuration =
            style.msTransitionDuration =
                style.OTransitionDuration =
                    style.transitionDuration = speed ? speed + 'ms' : '';

    style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
    style.msTransform =
        style.MozTransform =
            style.OTransform = 'translateX(' + dist + 'px)';

	return true;

}

//Marquee属性
Marquee.prototype = {
    _bind: function () {
        //绑定事件
    },
    _initialize: function () {
        var _this = this;

        this.container.addClass("marquee");
        this.children.addClass("marquee-wrap");

        var margin = this.margin.left || 0
            , left = 0;

        _this.lefts.push(0);
        this.children.children().each(function (i, n) {
            var $n = $(n)
                , _width = $n.width();
            //$n.css({left:left + 'px'});//设置位置
            left += _width + margin;
            _this.lefts.push(left);
        });

        this.children.css({width: left + 'px'});//添加transition动画

        //this.width = this.children.width();//获取宽度
        var MAX_POSITION = {
            x: {MAX: 0, MIN: -Math.max(_this.children.width() - _this.container.width(), 0)}
        }

        //console.log(MAX_POSITION.x);

        // check browser capabilities
        var browser = {
            addEventListener: !!window.addEventListener,
            touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
            transitions: (function (temp) {
                var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
                for (var i in props) if (temp.style[props[i]] !== undefined) return true;
                return false;
            })(document.createElement('swipe'))
        };

        //节点初始位置
        var position = {
            x: 0
            /*,	y : 0*/
        }

        // setup initial vars
        var start = {},
            delta = {},
	        lastDelta = {},
            isScrolling,
            moveSpeed;

	    function inertiaScroll(v, a, cb) {
		    var start = {
			    v: v,
			    time: +new Date
		    };
		    function scroll() {
			    var t = new Date - start.time,
				    v = start.v + a * t,
				    s = (start.v + v) * t / 2;
			    if ((a = cb(s, t, v, a))!==false) {     //cb决定是否停下，cb也同时决定加速度，没办法
				    window.requestAnimationFrame
				        ? window.requestAnimationFrame(scroll)
					    : setTimeout(scroll, 10);
			    }
		    }
		    scroll();
	    }

        var events = {

            handleEvent: function (event) {

                switch (event.type) {
                    case 'touchstart':
                        this.start(event);
                        break;
                    case 'touchmove':
                        this.move(event);
                        break;
                    case 'touchend':
                        this.end(event);
                        break;
                    case 'webkitTransitionEnd':
                    case 'msTransitionEnd':
                    case 'oTransitionEnd':
                    case 'otransitionend':
                    case 'transitionend':
                        break;
                    case 'resize':
                        break;
                }
                if (_this.opts.stopPropagation) event.stopPropagation();
            },
            start: function (event) {

                var touches = event.touches[0];

                // measure start values
                start = {

                    // get initial touch coords
                    x: touches.pageX,
                    y: touches.pageY,

                    // store time to determine touch duration
                    time: +new Date

                };

                // used for testing first move event
                isScrolling = undefined;

                // reset delta and end measurements
                delta = {};

                // attach touchmove and touchend listeners
                element.addEventListener('touchmove', this, false);
                element.addEventListener('touchend', this, false);

            },
            move: function (event) {

                // ensure swiping with one touch and not pinching
                if (event.touches.length > 1 || event.scale && event.scale !== 1) return

                if (_this.opts.disableScroll) event.preventDefault();

                var touches = event.touches[0];


                // measure change in x and y
                var _delta = {
                    x: touches.pageX - start.x
                    , y: touches.pageY - start.y
	                , t: +new Date - start.time
                }

                // determine if scrolling test has run - one time test
                if (typeof isScrolling == 'undefined') {
                    isScrolling = !!( isScrolling || Math.abs(_delta.x) < Math.abs(_delta.y));
                }

                if (!isScrolling) {
                    // prevent native scrolling
                    event.preventDefault();

                    var positionX = position.x + Math.round((_delta.x - delta.x) / _this.deceleration);


                    if (positionX <= MAX_POSITION.x.MAX && positionX >= MAX_POSITION.x.MIN) {
                        position = {
                            x: positionX
                            /*,	y : position.y + Math.round((_delta.y - delta.y)/ _this.deceleration)*/
                        }
                        _this.children && _this.children[0] && translate(_this.children[0].style, position.x, _this.speed);
                    }
                }

	            lastDelta = {
		            x: (_delta.x - delta.x)
		            , t: _delta.t - delta.t
	            };
                delta = _delta;
            },
            end: function (event) {
                // measure duration
                var duration = +new Date - start.time,
	                aveV = delta.x / duration,  //平均速度
	                insV = lastDelta.x / lastDelta.t,  //瞬时速度
	                velocity = Math.abs(aveV) > Math.abs(insV) ? aveV : insV,   //取两者大的
	                absV = Math.abs(velocity);
//	            if (absV > 1.2) velocity = (velocity/absV)*1.2; //速度封顶

	            console.log(velocity);
	            // kill touchmove and touchend event listeners until touchstart called again
	            element.removeEventListener('touchmove', events, false)
	            element.removeEventListener('touchend', events, false)

	            if (absV > 0.5) {   //惯性滑动
		            element.removeEventListener('touchstart', events, false)
//		            var a = -velocity / 400;    //固定时间
		            var a = (-velocity/absV)*0.003;     //固定加速度

		            //下面是惯性滑动回滚的实现，但是很难控制...弃用
//		            inertiaScroll(velocity, a, function(s, t, v) {
//			            var x = position.x + s;
//			            if (v * velocity < 0) {     //速度方向改变标明已经到达0
//				            if (x <= MAX_POSITION.x.MAX && x >= MAX_POSITION.x.MIN) {   //没有超过范围
//					            _this.children && _this.children[0] && translate(_this.children[0].style, position.x+s, _this.speed);
//					            position.x = x;
//					            return false;    //停下
//				            } else {    //超过范围需要降速
//					            _this.children && _this.children[0] && translate(_this.children[0].style, position.x+s, _this.speed);
//					            return 1.5*a;
//				            }
//			            }
//			            _this.children && _this.children[0] && translate(_this.children[0].style, position.x+s, _this.speed);
//			            return a;
//		            });

		            //只有惯性滑动
		            inertiaScroll(velocity, a, function(s, t, v) {
			            var x = position.x + s, ret = false;
			            if (x > MAX_POSITION.x.MAX) {
				            x = MAX_POSITION.x.MAX;
				            ret = true;
			            } else if (x < MAX_POSITION.x.MIN) {
				            x = MAX_POSITION.x.MIN;
				            ret = true;
			            }
			            _this.children && _this.children[0] && translate(_this.children[0].style, x, _this.speed);
			            if (ret || v * velocity < 0) {     //速度方向改变标明已经到达0
				            position.x = x;
				            return false;
			            }
			            return a;
		            });
		            element.addEventListener('touchstart', events, false)
	            }
            }
        }

        var element = this.children[0];
        if (browser.addEventListener) {

            // set touchstart event on element
            if (browser.touch) element.addEventListener('touchstart', events, false);

            /*if (browser.transitions) {
             element.addEventListener('webkitTransitionEnd', events, false);
             element.addEventListener('msTransitionEnd', events, false);
             element.addEventListener('oTransitionEnd', events, false);
             element.addEventListener('otransitionend', events, false);
             element.addEventListener('transitionend', events, false);
             }*/
        } else {

        }
    }
};

module.exports = Marquee;
