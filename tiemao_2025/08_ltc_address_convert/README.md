# Java实现LTC以3和M开头的地址相互转换

[toc]

## 1. 背景

LTC， 输入的可能是以 `3` 开头的 P2PKH 地址, 也可能是以 `M` 开头的 p2sh 地址。
上链前，需要统一转换为 M 开头的地址。

这样就有一个问题，比对的时候，两者可能需要相互转换，以确定是否等价。

## 2. AI解答

问了AI，给了一堆看起来很好的代码。

但是，跑不起来， Java的加解密体系本来就有点绕，然后AI给的代码可能是出了幻觉，前后总是对不上，或者是给的依赖库是私有库，调试了一个下午，放弃了。

## 3. 解决思路

后来找到了一个页面， 可以进行转换:

> `https://litecoin-project.github.io/p2sh-convert/`

扒开页面一看，里面是使用 JS 实现的， 看到里面的 `fromBase58Check` 函数。

## 4. 实现原理

LTC地址, 实际上就是一串 21 byte 的数据, 然后序列化为Base58格式的字符串。
第一个 byte 是版本号。

了解了实现原理，其实转换步骤很简单:

- 将Base58格式转换为byte数组
- 转换版本号
- 再转换为Base58格式的地址


## 5. 实现代码

实现的逻辑如下:

```java

import lombok.Data;
import org.bitcoinj.core.Base58;

import java.util.Arrays;

// see: https://litecoin-project.github.io/p2sh-convert/

public class LTCAddressUtil {

    // 这个注解是生成 getter-setter 的
    @Data
    public static class LtcAddr {
        private byte version; // 版本号
        private byte[] hash; // hash


        public static LtcAddr from(String p2shAddr) {
            //
            byte[] payload = Base58.decodeChecked(p2shAddr);
            if (payload.length != 21) {
                throw new IllegalStateException("不支持的地址: " + p2shAddr);
            }
            byte version = payload[0];
            byte[] hash = Arrays.copyOfRange(payload, 1, payload.length);
            //
            LtcAddr instance = new LtcAddr();
            instance.setHash(hash);
            instance.setVersion(version);

            return instance;
        }

        public LtcAddr toAnotherAddr() {
            byte version = this.version;

            // 5 <-> 50
            // 196 <-> 58
            if (version == 5) {
                version = 50; // 0x32
            } else if (version == 50) {
                version = 5; // 0x05
            } else if (version == Integer.valueOf(196).byteValue()) {
                version = 58; // 这个是测试网的
            } else if (version == 58) {
                // 这个是测试网的
                version = Integer.valueOf(196).byteValue();
            } else {
                throw new IllegalStateException("不支持的地址: " + this.toString());
            }
            //
            LtcAddr instance = new LtcAddr();
            instance.setHash(hash); // hash 不变
            instance.setVersion(version);
            return instance;

        }

        public String getAddrStr() {
            String target = Base58.encodeChecked(version, hash);
            return target;
        }

    }
}
```

实际上这里可以在工具类里面提供一些 `static` 方法, 再包装一下, 简化操作.

## 6. 测试代码

这里直接用 `main` 方法进行简单的测试.

```java

    // 测试方法
    public static void main(String[] args) {
        System.out.println("=== LTC 地址转换测试 ===");
        //
        String p2sh_3 = "339PsHuCRkhk6fzE2gRcCLuVJVPA1GcUNM";
        String p2sh_m = "M9MYBBKANsZAuBG88ZQx1z9tdByc1aJ7AZ";
        {
            System.out.println("==============");
            LtcAddr btcAddr = LtcAddr.from(p2sh_3);
            String addr3 = btcAddr.getAddrStr();
            System.out.println("addr_o=" + addr3);
            LtcAddr anotherAddr = btcAddr.toAnotherAddr();
            String anotherM = anotherAddr.getAddrStr();
            System.out.println("anotherM=" + anotherM);
        }
        {
            System.out.println("==============");
            LtcAddr btcAddr = LtcAddr.from(p2sh_m);
            String addr3 = btcAddr.getAddrStr();
            System.out.println("addr_o=" + addr3);
            LtcAddr anotherAddr = btcAddr.toAnotherAddr();
            String anotherM = anotherAddr.getAddrStr();
            System.out.println("anotherM=" + anotherM);
        }


        // Bitcoin P2PKH prefix (starts with "3")
        // p2pkh: 339PsHuCRkhk6fzE2gRcCLuVJVPA1GcUNM
        // <======>
        // Litecoin address with 0x32
        // p2sh: M9MYBBKANsZAuBG88ZQx1z9tdByc1aJ7AZ
    }
```

如果使用单测的话，可以验证转换前后的地址是否一致，
以及多增加一批地址进行比对测试。


## 7. 类库依赖

> https://mvnrepository.com/artifact/org.bitcoinj/bitcoinj-core

依赖的类主要是: `org.bitcoinj.core.Base58`

新版本的包名换了一下: `org.bitcoinj.base.Base58`

如果不想引入依赖，可以将这个类抽到自己的项目中:

> https://github.com/bitcoinj/bitcoinj/blob/master/base/src/main/java/org/bitcoinj/base/Base58.java

顺带再抽取需要依赖的 `Sha256Hash.hashTwice` 方法即可。


## 8. 类似的BCH地址转换

类似的有地址转换的链, 还有 `BCH`。

参考地址为:

> `https://cashaddr.bitcoincash.org/?utm`

Java的实现，请参考: 

> `https://github.com/Electron-Cash/Electron-Cash-Java/blob/master/CashAddr.java`

后续已经实现了一版, 请转到:

> [Java实现BCH与BTC的地址相互转换](https://blog.csdn.net/renfufei/article/details/152463810)
## 9. 小结

AI在处理复杂的算法时, 就看喂的资料怎么样了。
