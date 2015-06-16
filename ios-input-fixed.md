## IOS position:fixed + input问题


### 问题表现
当input获得焦点并弹出虚拟键盘时，页面上position:fixed的元素的位置会错乱。

=====
### 解决方案
1. 用position:absolute模拟，这个效果不佳，在pc端hack ie6...只能呵呵
2. 当input元素focus时，改成position:absolute，blur的时候再改回来
3. 使用iscroll库
4. 使用div内滚动
