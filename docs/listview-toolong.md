#Listview 太长引起的手机性能问题

### 问题表现
内存中存留的DOM结构太多，导致滚动的 Listview 后面，点击响应会延迟，甚至无响应。

===

### 解决方法是:
1. 在 li 外面包裹一层，将前面页码的 dom 移除，同时设置外层容器的高度（这样不至于影响滚动条）
![2015-06-14 10 15 53](https://cloud.githubusercontent.com/assets/3880323/8146779/7e02e9a0-127e-11e5-979b-b3decd74fa5e.png)
2. 下拉滚动翻页过程中，对之前页码的数据进行隐藏。
![qq 20150618095357](https://cloud.githubusercontent.com/assets/3880323/8222619/4d3921d4-15a0-11e5-9184-7f1b693a4e26.png)
向上滚动时，采取一定的策略将隐藏的数据显示

                var $lastHidden = $teacherList.find('li[data-show="hidden"]').last(),
                    lastHiddenPage = $lastHidden.data('page');
                var $midle = $teacherList.find('li[data-page="' + (lastHiddenPage + 2) + '"]').eq(4);
                if($midle && $midle.offset() && $midle.offset().top > $(document.body).scrollTop()){
                    // 页面中最后一个元素显示在屏幕中
                    // problem: 向上滑动过快，这里有卡顿
                    $teacherList.find('li[data-page="' + lastHiddenPage + '"]').css('visibility', 'visible').data('show', 'visible');
                }

获取最后一个隐藏的元素，得到隐藏的页码，判断后2页中的第5条数据是否在屏幕中。
