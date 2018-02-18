# JSON.parse()与JSON.stringify()方法简介


### JSON.parse()

### JSON.parse()

The JSON.parse() method parses a JSON string, constructing the JavaScript value or object described by the string. An optional reviver function can be provided to perform a transformation on the resulting object before it is returned.

JSON.parse()方法解析JSON字符串,构建JavaScript值或对象所描述的字符串.可以提供一个可选的兴奋剂函数生成的对象上执行转换之前返回。

```
var json = '{"result":true, "count":42}';
obj = JSON.parse(json);

console.log(obj.count);
// expected output: 42

console.log(obj.result);
// expected output: true

```



Syntax

语法

```
JSON.parse(text[, reviver])
```



Parameters

参数

text

文本

The string to parse as JSON. See the JSON object for a description of JSON syntax.

字符串解析为JSON。看到JSON对象的JSON的语法的描述。

reviver Optional

兴奋剂可选

If a function, this prescribes how the value originally produced by parsing is transformed, before being returned.

如果一个函数,这个规定产生的最初价值如何解析转换,之前返回。

Return value

返回值

The Object corresponding to the given JSON text.

对象对应于给定的JSON文本。

Exceptions

异常

Throws a SyntaxError exception if the string to parse is not valid JSON.

抛出一个SyntaxError异常如果字符串解析JSON是无效的。

Examples

例子

Using JSON.parse()

使用JSON.parse()

```
JSON.parse('{}');              // {}
JSON.parse('true');            // true
JSON.parse('"foo"');           // "foo"
JSON.parse('[1, 5, "false"]'); // [1, 5, "false"]
JSON.parse('null');            // null
```



Using the reviver parameter

使用兴奋剂参数

If a reviver is specified, the value computed by parsing is transformed before being returned. Specifically, the computed value and all its properties (beginning with the most nested properties and proceeding to the original value itself) are individually run through the reviver. Then it is called, with the object containing the property being processed as this, and with the property name as a string, and the property value as arguments. If the reviver function returns undefined (or returns no value, for example, if execution falls off the end of the function), the property is deleted from the object. Otherwise, the property is redefined to be the return value.

如果指定一个刺激性饮料,通过解析计算的值被改变之前返回.具体来说,计算值及其所有属性(从最开始嵌套属性和原始值本身进行)通过兴奋剂单独运行.然后,正在处理的对象包含属性,属性名称作为一个字符串,和属性值作为参数.如果兴奋剂函数返回定义(或不返回任何值,例如,如果执行脱落的函数),房地产从对象中删除.否则,属性定义返回值。

If the reviver only transforms some values and not others, be certain to return all untransformed values as-is, otherwise they will be deleted from the resulting object.

如果兴奋剂只变换一些值而不是别人,一定会按原样返回所有untransformed值,否则他们将被删除从生成的对象。

```
JSON.parse('{"p": 5}', (key, value) =>
  typeof value === 'number'
    ? value * 2 // return value * 2 for numbers
    : value     // return everything else unchanged
);

// { p: 10 }

JSON.parse('{"1": 1, "2": 2, "3": {"4": 4, "5": {"6": 6}}}', (key, value) => {
  console.log(key); // log the current property name, the last is "".
  return value;     // return the unchanged property value.
});

// 1
// 2
// 4
// 6
// 5
// 3 
// ""
```



JSON.parse() does not allow trailing commas

JSON.parse()不允许后面的逗号

```
// both will throw a SyntaxError
JSON.parse('[1, 2, 3, 4, ]');
JSON.parse('{"foo" : 1, }');
```



### JSON.stringify()

### JSON.stringify()

The `JSON.stringify()` method converts a JavaScript value to a JSON string, optionally replacing values if a replacer function is specified, or optionally including only the specified properties if a replacer array is specified.

的`JSON.stringify()`方法将JavaScript值转换为一个JSON字符串,如果指定一个替代者函数选择替换值,或可选地包括只有如果指定一个替代者数组指定的属性。

Syntax

语法

```
JSON.stringify(value[, replacer[, space]])
```



Parameters

参数

value

价值

The value to convert to a JSON string.

值转换为一个JSON字符串。

replacer Optional

代用品可选

A function that alters the behavior of the stringification process, or an array of String and Number objects that serve as a whitelist for selecting/filtering the properties of the value object to be included in the JSON string. If this value is null or not provided, all properties of the object are included in the resulting JSON string.

一个函数,改变stringification的行为过程,或一个字符串和数字对象数组作为白名单选择/过滤值对象的属性被包括在JSON字符串.如果这个值是null或不提供,对象的所有属性都包含在生成的JSON字符串。

space Optional

空间可选

A String or Number object that's used to insert white space into the output JSON string for readability purposes. If this is a Number, it indicates the number of space characters to use as white space; this number is capped at 10 (if it is greater, the value is just 10). Values less than 1 indicate that no space should be used. If this is a String, the string (or the first 10 characters of the string, if it's longer than that) is used as white space. If this parameter is not provided (or is null), no white space is used.

一个字符串或数字对象,用来插入空白便于阅读的JSON字符串输出.如果这是一个数字,它指示空格字符的数量作为空白;这个数字是限制在10(如果它是更大的,价值是10).值小于1表明,不应该使用空间。如果这是一个字符串,字符串(或第一个10个字符的字符串,如果是超过)用作空白.如果没有提供这个参数(或者为空),不使用空格。

Return value

返回值

A JSON string representing the given value.

一个JSON字符串代表给定的值。

Description

描述

JSON.stringify() converts a value to JSON notation representing it:

JSON.stringify()将一个值转换为JSON符号表示:

Boolean, Number, and String objects are converted to the corresponding primitive values during stringification, in accord with the traditional conversion semantics.

布尔值、数字和字符串对象转换为相应的原始值stringification期间,符合传统的语义转换。

If undefined, a function, or a symbol is encountered during conversion it is either omitted (when it is found in an object) or censored to null (when it is found in an array). JSON.stringify can also just return undefined when passing in "pure" values like JSON.stringify(function(){}) or JSON.stringify(undefined).

如果未定义,一个函数,或者遇到一个符号在转换是省略了(当它存在于一个对象)或审查为null(当它存在于一个数组)。JSON.stringify也可以返回传递“纯”时未定义值像JSON.stringify(函数(){ })或JSON.stringify(定义)。

All Symbol-keyed properties will be completely ignored, even when using the replacer function.

所有Symbol-keyed属性将被完全忽略,即使使用代用品函数。

Non-enumerable properties will be ignored

不可数的属性将被忽略

```
JSON.stringify({});                  // '{}'
JSON.stringify(true);                // 'true'
JSON.stringify('foo');               // '"foo"'
JSON.stringify([1, 'false', false]); // '[1,"false",false]'
JSON.stringify({ x: 5 });            // '{"x":5}'

JSON.stringify(new Date(2006, 0, 2, 15, 4, 5)) 
// '"2006-01-02T15:04:05.000Z"'

JSON.stringify({ x: 5, y: 6 });
// '{"x":5,"y":6}'
JSON.stringify([new Number(3), new String('false'), new Boolean(false)]);
// '[3,"false",false]'

JSON.stringify({ x: [10, undefined, function(){}, Symbol('')] }); 
// '{"x":[10,null,null,null]}' 
 
// Symbols:
JSON.stringify({ x: undefined, y: Object, z: Symbol('') });
// '{}'
JSON.stringify({ [Symbol('foo')]: 'foo' });
// '{}'
JSON.stringify({ [Symbol.for('foo')]: 'foo' }, [Symbol.for('foo')]);
// '{}'
JSON.stringify({ [Symbol.for('foo')]: 'foo' }, function(k, v) {
  if (typeof k === 'symbol') {
    return 'a symbol';
  }
});
// '{}'

// Non-enumerable properties:
JSON.stringify( Object.create(null, { x: { value: 'x', enumerable: false }, y: { value: 'y', enumerable: true } }) );
// '{"y":"y"}'
```



The replacer parameter

替代者参数

The replacer parameter can be either a function or an array. As a function, it takes two parameters, the key and the value being stringified. The object in which the key was found is provided as the replacer's this parameter. Initially it gets called with an empty key representing the object being stringified, and it then gets called for each property on the object or array being stringified. It should return the value that should be added to the JSON string, as follows:

替代者参数可以是一个函数或一个数组。作为一个函数,它接受两个参数,stringified的键和值.的对象被发现的关键是提供代用品的这个参数.最初它被称为空着关键代表被stringified的对象,然后它被调用每个属性的对象或数组stringified.它应该返回的值应该被添加到JSON字符串,如下:

If you return a Number, the string corresponding to that number is used as the value for the property when added to the JSON string.

如果你返回一个数字,这个数字对应的字符串作为属性的值添加到JSON字符串。

If you return a String, that string is used as the property's value when adding it to the JSON string.

如果你返回一个字符串,该字符串用作房产价值当添加JSON字符串。

If you return a Boolean, "true" or "false" is used as the property's value, as appropriate, when adding it to the JSON string.

如果你返回一个布尔值,使用“true”或“false”为属性的值,如合适,当添加JSON字符串。

If you return any other object, the object is recursively stringified into the JSON string, calling the replacer function on each property, unless the object is a function, in which case nothing is added to the JSON string.

如果你返回任何其他对象,对象是递归地stringified JSON字符串,调用代用品函数在每个属性,除非是一个函数对象,在这种情况下,没有添加到JSON字符串。

If you return undefined, the property is not included (i.e., filtered out) in the output JSON string.

如果你返回未定义,属性(即不包括。过滤掉),输出JSON字符串。

Note: You cannot use the replacer function to remove values from an array. If you return undefined or a function then null is used instead.

注意:您不能使用代用品函数将值从一个数组中。如果你返回未定义或一个函数,那么使用null代替。

Example with a function

一个函数的示例

```
function replacer(key, value) {
  // Filtering out properties
  if (typeof value === 'string') {
    return undefined;
  }
  return value;
}

var foo = {foundation: 'Mozilla', model: 'box', week: 45, transport: 'car', month: 7};
JSON.stringify(foo, replacer);
// '{"week":45,"month":7}'
```



Example with an array

例子,一个数组

If replacer is an array, the array's values indicate the names of the properties in the object that should be included in the resulting JSON string.

如果代用品是一个数组,数组的值属性的对象的名称表明应该被包括在生成的JSON字符串。

```
JSON.stringify(foo, ['week', 'month']);  
// '{"week":45,"month":7}', only keep "week" and "month" properties
```



The space argument

空间参数

The space argument may be used to control spacing in the final string. If it is a number, successive levels in the stringification will each be indented by this many space characters (up to 10). If it is a string, successive levels will be indented by this string (or the first ten characters of it).

空间参数可以用来控制间距在最后的字符串。如果它是一个数字,连续水平stringification将各自被这么多空格字符缩进(10).如果它是一个字符串,将缩进连续水平这个字符串(或它的前10个字符)。

```
JSON.stringify({ a: 2 }, null, ' ');
// '{
//  "a": 2
// }'
```



Using a tab character mimics standard pretty-print appearance:

使用制表符模仿标准的外观形式打印:

```
JSON.stringify({ uno: 1, dos: 2 }, null, '\t');
// returns the string:
// '{
//     "uno": 1,
//     "dos": 2
// }'
```



toJSON() behavior

toJSON()行为

If an object being stringified has a property named toJSON whose value is a function, then the toJSON() method customizes JSON stringification behavior: instead of the object being serialized, the value returned by the toJSON() method when called will be serialized. JSON.stringify() calls toJSON with one parameter:

如果一个对象被stringified toJSON属性的值是一个函数,然后toJSON()方法定制JSON stringification行为:要序列化的对象,而是toJSON()方法调用时返回的值将被序列化。JSON.stringify()调用toJSON一个参数:

if this object is a property value, the property name

如果这个对象属性值,属性名

if it is in an array, the index in the array, as a string

如果是在一个数组,数组中的索引,作为一个字符串

an empty string if JSON.stringify() was directly called on this object

一个空字符串如果JSON.stringify()直接呼吁这个对象

For example:

例如:

```
const bonnie = {
  name: 'Bonnie Washington',
  age: 17,
  class: 'Year 5 Wisdom',
  isMonitor: false,
  toJSON: function(key) {
    // Clone object to prevent accidentally performing modification on the original object
    const cloneObj = { ...this };

    delete cloneObj.age;
    delete cloneObj.isMonitor;
    cloneObj.year = 5;
    cloneObj.class = 'Wisdom';

    if (key) {
      cloneObj.code = key;
    }

    return cloneObj;
  }
}

JSON.stringify(bonnie);
// Returns '{"name":"Bonnie Washington","class":"Wisdom","year":5}'

const students = {bonnie};
JSON.stringify(students);
// Returns '{"bonnie":{"name":"Bonnie Washington","class":"Wisdom","year":5,"code":"bonnie"}}'

const monitorCandidate = [bonnie];
JSON.stringify(monitorCandidate)
// Returns '[{"name":"Bonnie Washington","class":"Wisdom","year":5,"code":"0"}]'
```



Issue with plain JSON.stringify for use as JavaScript

问题简单的JSON。stringify用作JavaScript

Note that JSON is not a completely strict subset of JavaScript, with two line terminators (Line separator and Paragraph separator) not needing to be escaped in JSON but needing to be escaped in JavaScript. Therefore, if the JSON is meant to be evaluated or directly utilized within JSONP, the following utility can be used:

注意,JSON是JavaScript的完全不是一个严格的子集,有两行结束符(行分隔符和段落分隔符)不需要JSON逃脱,但需要在JavaScript中逃走了.因此,如果JSON是评估或直接使用JSONP内,可以使用以下工具:

```
function jsFriendlyJSONStringify (s) {
    return JSON.stringify(s).
        replace(/\u2028/g, '\\u2028').
        replace(/\u2029/g, '\\u2029');
}

var s = {
    a: String.fromCharCode(0x2028),
    b: String.fromCharCode(0x2029)
};
try {
    eval('(' + JSON.stringify(s) + ')');
} catch (e) {
    console.log(e); // "SyntaxError: unterminated string literal"
}

// No need for a catch
eval('(' + jsFriendlyJSONStringify(s) + ')');

// console.log in Firefox unescapes the Unicode if
//   logged to console, so we use alert
alert(jsFriendlyJSONStringify(s)); // {"a":"\u2028","b":"\u2029"}
```



Example of using JSON.stringify() with localStorage

与localStorage使用JSON.stringify()的例子

In a case where you want to store an object created by your user and allowing it to be restored even after the browser has been closed, the following example is a model for the applicability of JSON.stringify():

在一个情况下你想要存储一个对象创建的用户,甚至让它恢复浏览器已经关闭后,下面的例子是一个模型的适用性JSON.stringify():

Functions are not a valid JSON data type so they will not work. However, they can be displayed if first converted to a string (e.g. in the replacer), via the function's toString method. Also, some objects like Date will be a string after JSON.parse().

函数并不是一个有效的JSON数据类型,这样他们不会工作。然而,他们可以显示如果首先转换成字符串(例如代用品),通过函数的toString方法.此外,一些物品,例如日期后将一个字符串JSON.parse()。

```
// Creating an example of JSON
var session = {
  'screens': [],
  'state': true
};
session.screens.push({ 'name': 'screenA', 'width': 450, 'height': 250 });
session.screens.push({ 'name': 'screenB', 'width': 650, 'height': 350 });
session.screens.push({ 'name': 'screenC', 'width': 750, 'height': 120 });
session.screens.push({ 'name': 'screenD', 'width': 250, 'height': 60 });
session.screens.push({ 'name': 'screenE', 'width': 390, 'height': 120 });
session.screens.push({ 'name': 'screenF', 'width': 1240, 'height': 650 });

// Converting the JSON string with JSON.stringify()
// then saving with localStorage in the name of session
localStorage.setItem('session', JSON.stringify(session));

// Example of how to transform the String generated through 
// JSON.stringify() and saved in localStorage in JSON object again
var restoredSession = JSON.parse(localStorage.getItem('session'));

// Now restoredSession variable contains the object that was saved
// in localStorage
console.log(restoredSession);
```




相关链接:

<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse>

<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify>


