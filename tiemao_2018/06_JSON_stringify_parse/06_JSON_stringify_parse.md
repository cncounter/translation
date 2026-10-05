# JSON.parse()与JSON.stringify()简介

- [`reviver`, 转换,更新,重生]


## JSON.parse()简介

The JSON.parse() method parses a JSON string, constructing the JavaScript value or object described by the string. An optional reviver function can be provided to perform a transformation on the resulting object before it is returned.

`JSON.parse()`方法, 用来将字符串解析为对应的JavaScript对象/值。

使用时, 可选传入一个function, 作为转换函数(reviver function), 会在`JSON.parse()`返回之前调用, 可以对解析生成的 object, 进行某些转换操作。

```
var json = '{"result":true, "count":42}';
obj = JSON.parse(json);

// 输出: 42
console.log(obj.count);

// 输出: true
console.log(obj.result);

```



Syntax

### JSON.parse()语法声明

```
JSON.parse(text[, reviver])
```



Parameters

#### 参数说明


- `text` 参数

  The string to parse as JSON. See the JSON object for a description of JSON syntax.
  需要解析的JSON格式字符串。关于JSON的语法, 请参考: [JSON](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON)。

- reviver Optional

- `reviver`, 可选参数, 转换器

If a function, this prescribes how the value originally produced by parsing is transformed, before being returned.

可以传入一个转换函数, 将最初生成的对象, 进行某些转换, 然后再返回。

#### Return value

#### 返回值

The Object corresponding to the given JSON text.

返回给定字符串对应的 [Object](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)。

#### Exceptions

#### 异常说明

Throws a SyntaxError exception if the string to parse is not valid JSON.

如果传入的JSON字符串无效, 则会抛出 [SyntaxError](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError) 异常。

### Examples

### JSON.parse()示例

Using JSON.parse()

#### 简单示例

`JSON.parse()` 使用示例如下:

```
JSON.parse('{}');              // {}
JSON.parse('true');            // true
JSON.parse('"foo"');           // "foo"
JSON.parse('[1, 5, "false"]'); // [1, 5, "false"]
JSON.parse('null');            // null
```



Using the reviver parameter

#### 使用转换函数

If a reviver is specified, the value computed by parsing is transformed before being returned. Specifically, the computed value and all its properties (beginning with the most nested properties and proceeding to the original value itself) are individually run through the reviver. Then it is called, with the object containing the property being processed as this, and with the property name as a string, and the property value as arguments. If the reviver function returns undefined (or returns no value, for example, if execution falls off the end of the function), the property is deleted from the object. Otherwise, the property is redefined to be the return value.

如果指定了转换函数(reviver), 那么, 在返回解析出来的值之前, 会先调用转换函数, 在其中可以执行某些转换/修改(transform)。具体来说, 解析得到的值及其所有属性(从最嵌套的属性开始, 逐层向外, 直到原始值本身)会逐一经过转换函数处理。调用时, 以当前正在处理的属性所在的对象作为 `this`, 以属性名(字符串形式)和属性值作为参数。如果转换函数返回 `undefined`(或者不返回任何值, 例如函数执行到结尾自然结束), 则该属性会从对象中删除; 否则, 该属性会被重新定义为返回值。

If the reviver only transforms some values and not others, be certain to return all untransformed values as-is, otherwise they will be deleted from the resulting object.

如果转换函数只转换部分值而不转换其他值, 请务必将未转换的值按原样返回, 否则它们会从最终生成的对象中被删除。

```
JSON.parse('{"p": 5}', (key, value) =>
  typeof value === 'number'
    ? value * 2 // 如果是数字, 则返回 value * 2
    : value     // 其他情况不进行修改
);

// 返回值: {p: 10}
```

上面使用了箭头函数, 传统的等价代码为:


```
JSON.parse('{"p": 5}', function(key, value){
  if(typeof value === 'number'){
    return value * 2; // 如果是数字, 则返回 value * 2
  } else {
    return value;     // 其他情况不进行修改
  }
});

// 返回值也是: {p: 10}
```

再看个复杂点的示例:

```

JSON.parse('{"1": "v1", "2": "v2", "3": {"4": "v4", "5": {"6": "v6"}}}', (key, value) => {
  // 输出对应的属性名称,
  // 最后一个是整个对象/值自身, key则是空字符串"".
  console.log(key, '-->', JSON.stringify(value)); 
  return value;     // return the unchanged property value.
});

/*输出为:
================================================
1 --> "v1"
2 --> "v2"
4 --> "v4"
6 --> "v6"
5 --> {"6":"v6"}
3 --> {"4":"v4","5":{"6":"v6"}}
 --> {"1":"v1","2":"v2","3":{"4":"v4","5":{"6":"v6"}}}
================================================
*/
```



JSON.parse() does not allow trailing commas

`JSON.parse()`函数不允许在最后面出现逗号, 因为JSON规范就是这样规定的。

```
// 下面两种方式都会抛出 SyntaxError 异常
JSON.parse('[1, 2, 3, 4, ]');
JSON.parse('{"foo" : 1, }');
```



## JSON.stringify()简介

The `JSON.stringify()` method converts a JavaScript value to a JSON string, optionally replacing values if a replacer function is specified, or optionally including only the specified properties if a replacer array is specified.

`JSON.stringify()`方法, 用来将 JavaScript对象/值 转换为对应的JSON字符串。 如果指定替换函数(replacer function), 则可以替换某些值; 如果指定了替换属性数组(replacer array), 则输出结果中只包含指定的属性。

### Syntax

### JSON.stringify()语法声明

```
JSON.stringify(value[, replacer[, space]])
```

#### 示例

如果想要简单的换行输出和2个空格缩进, 可以使用：

```
// '  ' 表示2个空格
JSON.stringify(valueObject, null, '  ');
// 2表示2个空格
JSON.stringify(valueObject, null, 2);
```

如果想要简单的拷贝到剪贴板, 可以在Chrome控制台使用`copy()`方法, 注意`copy()`方法是不能在代码中直接使用的, 只准在开发者工具里面使用, 避免各种安全问题。

```
// 拷贝到剪贴板
copy( JSON.stringify(valueObject, null, 2) );
// 如果增加一个中间变量, 则可读性更好。
var tempStr = JSON.stringify(valueObject, null, 2);
copy(tempStr);
```


#### Parameters

#### 参数说明

- `value` 参数


The value to convert to a JSON string.

要转换为JSON字符串的值/对象。

- replacer Optional

- `replacer`, 可选参数, 替换器


A function that alters the behavior of the stringification process, or an array of String and Number objects that serve as a whitelist for selecting/filtering the properties of the value object to be included in the JSON string. If this value is null or not provided, all properties of the object are included in the resulting JSON string.

一个函数, 用来改变字符串化(stringification)过程的行为; 或者一个由 String 和 Number 组成的数组, 作为白名单(whitelist), 用来筛选值对象中哪些属性要包含到 JSON 字符串里。如果这个参数为 `null` 或者未提供, 则对象的所有属性都会包含在生成的 JSON 字符串中。

- `space`, 可选参数, 缩进


A String or Number object that's used to insert white space into the output JSON string for readability purposes. If this is a Number, it indicates the number of space characters to use as white space; this number is capped at 10 (if it is greater, the value is just 10). Values less than 1 indicate that no space should be used. If this is a String, the string (or the first 10 characters of the string, if it's longer than that) is used as white space. If this parameter is not provided (or is null), no white space is used.

一个字符串或数字, 用来在输出的 JSON 字符串中插入空白, 以便于阅读。如果是数字, 则表示每级缩进使用的空格数量, 上限为 10(超过 10 则按 10 处理); 小于 1 表示不使用空白。如果是字符串, 则使用该字符串(超过 10 个字符时取前 10 个字符)作为空白。如果没有提供这个参数(或者为 `null`), 则不使用空白。

Return value

返回值

A JSON string representing the given value.

一个JSON字符串代表给定的值。

Description

描述

JSON.stringify() converts a value to JSON notation representing it:

JSON.stringify()将一个值转换为JSON符号表示:

Boolean, Number, and String objects are converted to the corresponding primitive values during stringification, in accord with the traditional conversion semantics.

布尔值、数字和字符串对象, 在字符串化(stringification)过程中会被转换为对应的原始值, 符合传统的转换语义。

If undefined, a function, or a symbol is encountered during conversion it is either omitted (when it is found in an object) or censored to null (when it is found in an array). JSON.stringify can also just return undefined when passing in "pure" values like JSON.stringify(function(){}) or JSON.stringify(undefined).

如果在转换过程中遇到 `undefined`、函数或 Symbol 值, 会被忽略(当它出现在对象中时), 或者被转换为 `null`(当它出现在数组中时)。当传入"纯"值时, 比如 `JSON.stringify(function(){})` 或 `JSON.stringify(undefined)`, `JSON.stringify()` 也会直接返回 `undefined`。

All Symbol-keyed properties will be completely ignored, even when using the replacer function.

所有以 Symbol 作为键的属性会被完全忽略, 即使使用了替换函数(replacer)也一样。

Non-enumerable properties will be ignored

不可枚举的(Non-enumerable)属性会被忽略。

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

替换器(replacer)参数

The replacer parameter can be either a function or an array. As a function, it takes two parameters, the key and the value being stringified. The object in which the key was found is provided as the replacer's this parameter. Initially it gets called with an empty key representing the object being stringified, and it then gets called for each property on the object or array being stringified. It should return the value that should be added to the JSON string, as follows:

replacer 参数可以是一个函数, 也可以是一个数组。作为函数时, 它接收两个参数: 键(key)和正在被字符串化的值(value)。包含该键的对象会作为 `this` 传给替换函数。最开始调用时会传入一个空键, 代表正在被字符串化的对象本身; 之后对被字符串化的对象或数组的每个属性都会各调用一次。它应该返回要添加到 JSON 字符串中的值, 规则如下:

If you return a Number, the string corresponding to that number is used as the value for the property when added to the JSON string.

如果返回一个数字, 则将该数字对应的字符串作为属性的值, 添加到 JSON 字符串中。

If you return a String, that string is used as the property's value when adding it to the JSON string.

如果返回一个字符串, 则将该字符串作为属性的值, 添加到 JSON 字符串中。

If you return a Boolean, "true" or "false" is used as the property's value, as appropriate, when adding it to the JSON string.

如果返回一个布尔值, 则根据情况使用“true”或“false”作为属性的值, 添加到 JSON 字符串中。

If you return any other object, the object is recursively stringified into the JSON string, calling the replacer function on each property, unless the object is a function, in which case nothing is added to the JSON string.

如果返回其他任何对象, 则该对象会被递归地进行字符串化, 写入 JSON 字符串, 并且对其中每个属性都会调用替换函数; 除非该对象是函数, 这种情况下不会向 JSON 字符串中添加任何内容。

If you return undefined, the property is not included (i.e., filtered out) in the output JSON string.

如果返回 `undefined`, 则该属性不会包含在输出的 JSON 字符串中(即被过滤掉)。

Note: You cannot use the replacer function to remove values from an array. If you return undefined or a function then null is used instead.

注意: 不能使用替换函数从数组中删除值。如果返回 `undefined` 或者一个函数, 则会以 `null` 代替。

Example with a function

使用函数的示例

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

使用数组的示例

If replacer is an array, the array's values indicate the names of the properties in the object that should be included in the resulting JSON string.

如果 replacer 是一个数组, 则数组的元素表示对象中哪些属性名要包含在生成的 JSON 字符串中。

```
JSON.stringify(foo, ['week', 'month']);  
// '{"week":45,"month":7}', only keep "week" and "month" properties
```



The space argument

缩进(space)参数

The space argument may be used to control spacing in the final string. If it is a number, successive levels in the stringification will each be indented by this many space characters (up to 10). If it is a string, successive levels will be indented by this string (or the first ten characters of it).

space 参数可以用来控制最终字符串中的缩进。如果是数字, 则字符串化时的每一级缩进都使用这么多空格(上限 10); 如果是字符串, 则每一级缩进使用这个字符串(或其前 10 个字符)。

```
JSON.stringify({ a: 2 }, null, ' ');
// '{
//  "a": 2
// }'
```



Using a tab character mimics standard pretty-print appearance:

使用制表符可以模仿标准的美化输出(pretty-print)外观:

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

如果被字符串化的对象有一个名为 `toJSON` 的属性, 且其值是一个函数, 那么 `toJSON()` 方法可以定制 JSON 字符串化的行为: 不再序列化对象本身, 而是序列化调用 `toJSON()` 方法后返回的值。`JSON.stringify()` 调用 `toJSON` 时会传入一个参数:

if this object is a property value, the property name

如果这个对象是一个属性值, 则参数为属性名

if it is in an array, the index in the array, as a string

如果它在数组中, 则参数为它在数组中的下标, 以字符串形式表示

an empty string if JSON.stringify() was directly called on this object

如果 `JSON.stringify()` 是直接在这个对象上调用的, 则参数为空字符串

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

直接把 JSON.stringify() 的结果当作 JavaScript 使用的问题

Note that JSON is not a completely strict subset of JavaScript, with two line terminators (Line separator and Paragraph separator) not needing to be escaped in JSON but needing to be escaped in JavaScript. Therefore, if the JSON is meant to be evaluated or directly utilized within JSONP, the following utility can be used:

注意, JSON 并不是 JavaScript 的一个完全严格的子集: 有两种行终止符(行分隔符 Line separator 和段落分隔符 Paragraph separator)在 JSON 中不需要转义, 但在 JavaScript 中需要转义。因此, 如果 JSON 要在 JSONP 中求值或直接使用, 可以使用下面的工具函数:

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

配合 localStorage 使用 JSON.stringify() 的示例

In a case where you want to store an object created by your user and allowing it to be restored even after the browser has been closed, the following example is a model for the applicability of JSON.stringify():

在需要存储用户创建的对象, 并且即使在浏览器关闭之后也能恢复它的场景下, 下面的示例演示了 JSON.stringify() 的一种典型用法:

Functions are not a valid JSON data type so they will not work. However, they can be displayed if first converted to a string (e.g. in the replacer), via the function's toString method. Also, some objects like Date will be a string after JSON.parse().

函数并不是有效的 JSON 数据类型, 所以它们无法直接处理。不过, 可以先通过函数的 toString 方法将其转换为字符串(例如在 replacer 中), 这样就能显示出来了。另外, 有些对象(比如 Date)经过 JSON.parse() 之后会变成字符串。

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

<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON>

<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse>

<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify>


