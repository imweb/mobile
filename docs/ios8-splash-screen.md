## IOS8闪屏问题

### 问题表现
大面积的页面内刷新时出现，这种闪屏不是位置错乱的那种闪屏，具体原因不详

===
### 规避方案
1. 提高刷新效率，尽量减少reflow和repaint
2. 刷新之后不要改变页面的scroll状态，即不要从不能scroll刷到可以scroll，反之亦然（利用min-height让页面一直处于scroll状态，在用）
3. 不要刷新图片，利用localstorage缓存图片链接，命中的图片直接使用src，而不要用lazyload（在用）
