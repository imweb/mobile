### Android2.3下transform失效
Android 2.3某些页面的transform失效, 导致rotate等属性无效, 可以通过user-scale=yes部分解决.

### 腾讯播放器使用时遇到的坑
1. iOS下单页面里初始化多个video, 会出现神奇的bug. 因此不要初始化多个video
2. 使用播放器+poster覆盖掉原来的图片(例如课程详情页), 会有一段时间的白屏. 解决方法是oninit并且延时100ms才把播放器展示出来.
