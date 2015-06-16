#tap点透问题
### 产生条件
如果绑定tap方法的dom元素在tap方法触发后会被干掉（隐藏，移走，删掉），则它底下同一位置的dom元素会触发click事件、或者有浏览器认为可以被点击有交互反应的dom元素（例如input的focus事件），这个称为“点透”现象。
### 产生原因
1. click事件在移动端会有延迟（因为需要检测双击事件，[移动端click300毫秒延迟的原因](http://blogs.telerik.com/appbuilder/posts/13-11-21/what-exactly-is.....-the-300ms-click-delay)）
2. zepto的tap事件是绑定在document.body上的，tap事件执行（冒泡之后）之前，click事件已经被"执行"，只是被延迟了而已，所以在tap事件用preventDefault也无济于事

### 解决方案
1. 底下的元素也使用tap事件，即上下两个元素使用同一种事件（tap/click）
2. 不要使用tap事件，使用touchend事件处理，并preventDefault掉（不优雅，而且暴力）
3. 使用fastclick库，其实现原理就是把click的300ms延迟干掉
