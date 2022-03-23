# 填坑日记: Map接口的getOrDefault方法


测试代码:

```java
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class MapTest {
    public static void main(String[] args) {
        Map<String, Object> map = new HashMap<>();
        //
        String key1 = "test1";
        map.put(null, null);
        map.put(key1, null);
        System.out.println("map.get: " + map.get(key1));
        System.out.println("map.containsKey: " + map.containsKey(key1));
        // map.getOrDefault: null
        System.out.println("map.getOrDefault: " + map.getOrDefault(key1, "default1"));
        System.out.println("======");
        //
        String key2 = "test2";
        // map.put(key2, null);
        System.out.println("map.get: " + map.get(key2));
        System.out.println("map.containsKey: " + map.containsKey(key2));
        // map.getOrDefault: default2
        System.out.println("map.getOrDefault: " + map.getOrDefault(key2, "default2"));
        // ConcurrentHashMap的key和value都不能为null
        map = new ConcurrentHashMap<>();
        // java.lang.NullPointerException
        map.put(key1, null);
    }
}
```

注意 getOrDefault 的默认实现:

```java
    default V getOrDefault(Object key, V defaultValue) {
        V v;
        return (((v = get(key)) != null) || containsKey(key))
            ? v
            : defaultValue;
    }
```
