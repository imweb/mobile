# tip（一级标题，组件名字/文件名）

## Get Start（二级标题，可以多个，比如Install，Usage）
说明文字
``` bash
# 代码
$ lego install tip
```

## Attributes（二级标题，类属性，对象属性，如果有的话）
### pos（属性名，三级标题） `String|Number（类型）` `default:"top"`
说明文字
> 有需要特别注意的内容用这种形式
> <br>可以看到，所有需要说明的字段格式都是：
> <br>字段名 `类型` `其他特性，比如默认值，是否可选，后面可以跟多个特性` 说明文字

### defaults `Object`
+ word `String` `default:"hello"` 说明文字
+ test `Object` 说明文字，用列表形式分字段说明
  + a `Number` 说明文字
  + b `String` 说明文字
+ onClick `Function(events, word)` 说明文字，要完整的函数签名，并且同Object类型一样以列表形式说明参数
  + events `Object` click事件的event
  + word `String` 说明文字
  
说明文字

## Methods（二级标题）
### init(opt[, report]) (方法签名，三级标题，下面以列表形式说明参数)
+ opt `Object` 说明文字
  + word `String` `default:"hello"` 说明文字
  + type: `String` `default:"warn"` 说明文字
+ report `Boolean` `Optional` 说明文字
  
说明文字，这个就自由发挥了，主要的部分是要说明函数签名

``` javascript
//例子代码
tip.init({
  word: 'hello word',
  type: 'error'
})
```

## Contributors（二级标题，作者放在这里）
+ lqlongli `test@abc.com` `12345678901` `作者的说明或联系方式可以多个`

