# Java实现BCH与BTC的地址相互转换

[toc]

## 1. 背景

接上篇:

> [Java实现LTC以3和M开头的地址相互转换](https://blog.csdn.net/renfufei/article/details/152406986)

BCH和LTC有点类似， 用户输入的可能是 BTC 类型的地址, 也可能是专有的地址。
上链前，需要统一转换为 BTC 类型的地址。

这样就有一个问题，比对的时候，两者可能需要相互转换，以确定是否等价。

## 2. 踩坑

这次没有问AI，根据相关的链接，进行转换。

结果死活对应不上。

换言之，也就是网上没有现成的Java版本的地址转换工具类。
## 3. 解决思路

参考和比对的页面， 可以进行转换:

> `https://cashaddr.bitcoincash.org/`

扒开页面一看，里面是使用了 JS 实现，但是却调用了一个后端接口来进行转换。

然后，又找到了一个看着比较靠谱的github仓库:

> `https://github.com/Electron-Cash/Electron-Cash-Java/blob/master/CashAddr.java`

里面有一些基础的Base32的转换逻辑，以及校验和等处理方式。

但是用着还是有点不顺手。

## 4. 实现原理


BCH和LTC有类似的问题。 

实际上各种地址格式之间，不管怎么变，唯一不变的就是 `hash` 部分。

LTC地址和BCH、BTC地址, 实际上就是一串 21 byte 的数据, 然后序列化为Base58格式的字符串。
第一个 byte 是版本号。

而 `bitcoincash` 前缀的地址，使用的 Base32 编码，具体的原理则参考上面的部分， 因为官方提供了二维码转换，所以这个前缀的地址使用较多。


了解了实现原理，转换步骤很简单:

- 将Base58格式转换为byte数组
- 转换为  `bitcoincash` 前缀格式的地址(Base32)

或者反过来:
- 解析 `bitcoincash` 前缀或者该格式的地址(Base32)
- 再转换为Base58格式的地址


## 5. 实现代码

实现的逻辑如下:

```java

import lombok.extern.slf4j.Slf4j;
import org.bitcoinj.core.CashAddr;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import static org.bitcoinj.core.CashAddr.MAIN_NET_PREFIX;
import static org.bitcoinj.core.CashAddr.SEPARATOR;

// see: https://github.com/zquestz/cashaddr-converter
// see: https://cashaddr.bitcoincash.org/?utm

@Slf4j
public class BCHAddressUtil {

    public static String toAnoAddr(String bchAddr) {
        // 判断地址类型
        boolean isValidCashAddress = CashAddr.isValidCashAddress(bchAddr);
        try {
            if (!isValidCashAddress) {
                // 转换base58, 并提取 hash
                LTCAddressUtil.BtcAddr btcAddr = LTCAddressUtil.BtcAddr.from(bchAddr);
                byte[] hash = btcAddr.getHash();
                // 转换地址
                CashAddr.BitcoinCashAddressType targetType = CashAddr.BitcoinCashAddressType.P2PKH;
                String other = CashAddr.toCashAddress(targetType, hash);
                return trimPrefix(other);
            } else {
                // 解析
                CashAddr.BitcoinCashAddressDecodedParts decoded = CashAddr.decodeCashAddress(bchAddr);
                byte[] hash = decoded.getHash();
                byte version = CashAddr.BitcoinCashAddressType.P2PKH.getVersionByte();
                // 转换地址
                LTCAddressUtil.BtcAddr btcAddr = new LTCAddressUtil.BtcAddr();
                btcAddr.setHash(hash);
                btcAddr.setVersion(version);
                String other = btcAddr.getAddrStr();
                return other;
            }
        } catch (Exception e) {
            log.warn("转换BCH地址失败, 返回原地址: {}", bchAddr, e);
            return bchAddr; // 返回原地址
        }
    }

    public static String trimPrefix(String address) {
        if (Objects.nonNull(address) && address.startsWith(MAIN_NET_PREFIX + SEPARATOR)) {
            address = address.substring((MAIN_NET_PREFIX + SEPARATOR).length());
        }
        return address;
    }
}
```

这里在工具类里面提供了一个 `static` 方法, 简化操作.

## 6. 测试代码

这里直接用 `main` 方法进行简单的测试.

```java
// import com.google.common.base.Preconditions;

    // 测试方法
    public static void main(String[] args) {
        System.out.println("=== BCH 地址转换测试 ===");

        Map<String, String> addrPair = new HashMap<>();
        addrPair.put("12PJEWwWtdhg4HoHA9GHfVpMegan9BLkAJ", "bitcoincash:qq8jl2vst9vc806d83aj2px3mv2uwn620q5neyc2h7");
        addrPair.put("1DWWAECwYtLY8haDbC3TG3fK97q1vQ33xT", "bitcoincash:qzynt6wqpy6m3f2ykr7h7l7tvh2g9dkmgqfhqwe6t8");
        addrPair.put("1DPhegLSDwDFJnHkLNsNBJK8LoGEdvXyLZ", "qzr7e97ewejw3vzneuej4w74ldwgw5y9ay8m0ylk24");

        //
        for (String legacy : addrPair.keySet()) {
            String cashAddr = addrPair.get(legacy);
            System.out.println("==============");
            System.out.println("legacy=" + legacy);
            System.out.println("cashed=" + cashAddr);
            Preconditions.checkArgument(!legacy.equalsIgnoreCase(cashAddr));
            System.out.println("legacy.isValidCashAddress: " + CashAddr.isValidCashAddress(legacy));
            System.out.println("cashAddr.isValidCashAddress: " + CashAddr.isValidCashAddress(cashAddr));

            String cach2 = toAnoAddr(legacy);
            System.out.println("从legacy转换得到的cach2=" + cach2);
            Preconditions.checkArgument(!legacy.equalsIgnoreCase(cach2));
            Preconditions.checkArgument(trimPrefix(cashAddr).equalsIgnoreCase(trimPrefix(cach2)));

            String anoBtcAddr = toAnoAddr(cashAddr);
            System.out.println("从cashAddr转换得到的another=" + anoBtcAddr);
            // 判断
            Preconditions.checkArgument(!cashAddr.equalsIgnoreCase(anoBtcAddr));
            Preconditions.checkArgument(legacy.equalsIgnoreCase(anoBtcAddr));
            //
            String btcAddr2 = toAnoAddr(trimPrefix(cashAddr));
            System.out.println("从cashAddr.trim转换得到的btcAddr2=" + btcAddr2);
            // 判断相等
            Preconditions.checkArgument(legacy.equalsIgnoreCase(btcAddr2));

        }

    }
```

这里使用了一个 Preconditions 来进行检查, 如果比对不通过的话，则会抛出异常。
如果使用单测的话，可以用Assert相关类来验证转换前后的地址是否一致。


## 7. 类库依赖

当然，也包含上文的 LTC 相关的逻辑，此处不再列出。

本文参考的代码为:


> `https://github.com/Electron-Cash/Electron-Cash-Java/blob/master/CashAddr.java`


如果不想引入依赖，可以将这个类抽到自己的项目中，稍微定制一下即可。

对应的 `CashAddr` 代码修改后变成:

```java


import java.math.BigInteger;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

// see: https://github.com/Electron-Cash/Electron-Cash-Java/blob/master/CashAddr.java

public class CashAddr {


    public static final String SEPARATOR = ":";

    public static final String MAIN_NET_PREFIX = "bitcoincash";

    private static final BigInteger[] POLYMOD_GENERATORS = new BigInteger[]{new BigInteger("98f2bc8e61", 16),
            new BigInteger("79b76d99e2", 16), new BigInteger("f33e5fb3c4", 16), new BigInteger("ae2eabe2a8", 16),
            new BigInteger("1e4f43e470", 16)};

    private static final BigInteger POLYMOD_AND_CONSTANT = new BigInteger("07ffffffff", 16);


    public static final String CHARSET_BASE32 = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";

    private static final char[] CHARS_BASE32 = CHARSET_BASE32.toCharArray();

    private static Map<Character, Integer> char_Base32_PositionMap;

    static {
        char_Base32_PositionMap = new HashMap<>();
        for (int i = 0; i < CHARS_BASE32.length; i++) {
            char_Base32_PositionMap.put(CHARS_BASE32[i], i);
        }
        if (char_Base32_PositionMap.size() != 32) {
            throw new RuntimeException("The charset must contain 32 unique characters.");
        }
    }

    // 解析 bch 前缀地址
    public static BitcoinCashAddressDecodedParts decodeCashAddress(String bitcoinCashAddress) {
        if (!isValidCashAddress(bitcoinCashAddress)) {
            throw new RuntimeException("Address wasn't valid: " + bitcoinCashAddress);
        }
        String addrPart = bitcoinCashAddress;
        String prefix = MAIN_NET_PREFIX;

        BitcoinCashAddressDecodedParts decoded = new BitcoinCashAddressDecodedParts();
        String[] addressParts = bitcoinCashAddress.split(SEPARATOR);
        if (addressParts.length == 2) {
            prefix = addressParts[0];
            addrPart = addressParts[1];
        }
        decoded.setPrefix(prefix);

        byte[] addressData = decodeBase32(addrPart);
        addressData = Arrays.copyOfRange(addressData, 0, addressData.length - 8);
        addressData = convertBits(addressData, 5, 8, true);
        byte versionByte = addressData[0];
        byte[] hash = Arrays.copyOfRange(addressData, 1, addressData.length);

        decoded.setAddressType(getAddressTypeFromVersionByte(versionByte));
        decoded.setHash(hash);

        return decoded;
    }

    // 转换为 bch 前缀地址
    public static String toCashAddress(BitcoinCashAddressType addressType, byte[] hash) {
        String prefixString = MAIN_NET_PREFIX;
        byte[] prefixBytes = getPrefixBytes(prefixString);
        byte[] payloadBytes = concatenateByteArrays(new byte[]{addressType.getVersionByte()}, hash);
        payloadBytes = convertBits(payloadBytes, 8, 5, false);
        byte[] allChecksumInput = concatenateByteArrays(
                concatenateByteArrays(concatenateByteArrays(prefixBytes, new byte[]{0}), payloadBytes),
                new byte[]{0, 0, 0, 0, 0, 0, 0, 0});
        byte[] checksumBytes = calculateChecksumBytesPolymod(allChecksumInput);
        checksumBytes = convertBits(checksumBytes, 8, 5, true);
        String cashAddress = encodeBase32(concatenateByteArrays(payloadBytes, checksumBytes));
        return prefixString + SEPARATOR + cashAddress;
    }

    private static BitcoinCashAddressType getAddressTypeFromVersionByte(byte versionByte) {
        for (BitcoinCashAddressType addressType : BitcoinCashAddressType.values()) {
            if (addressType.getVersionByte() == versionByte) {
                return addressType;
            }
        }

        throw new RuntimeException("Unknown version byte: " + versionByte);
    }

    // 判断是否是 bch 前缀类型的地址
    public static boolean isValidCashAddress(String bitcoinCashAddress) {
        try {
            String prefix;
            if (bitcoinCashAddress.contains(SEPARATOR)) {
                String[] split = bitcoinCashAddress.split(SEPARATOR);
                prefix = split[0];
                bitcoinCashAddress = split[1];
            } else {
                prefix = MAIN_NET_PREFIX;
            }

            if (!isSingleCase(bitcoinCashAddress))
                return false;

            bitcoinCashAddress = bitcoinCashAddress.toLowerCase();

            byte[] checksumData = concatenateByteArrays(
                    concatenateByteArrays(getPrefixBytes(prefix), new byte[]{0x00}),
                    decodeBase32(bitcoinCashAddress));

            byte[] calculateChecksumBytesPolymod = calculateChecksumBytesPolymod(checksumData);
            return new BigInteger(calculateChecksumBytesPolymod).compareTo(BigInteger.ZERO) == 0;
        } catch (RuntimeException re) {
            return false;
        }
    }


    private static boolean isSingleCase(String bitcoinCashAddress) {
        if (bitcoinCashAddress.equals(bitcoinCashAddress.toLowerCase())) {
            return true;
        }
        if (bitcoinCashAddress.equals(bitcoinCashAddress.toUpperCase())) {
            return true;
        }

        return false;
    }

    // 计算校验和
    private static byte[] calculateChecksumBytesPolymod(byte[] checksumInput) {
        BigInteger c = BigInteger.ONE;

        for (int i = 0; i < checksumInput.length; i++) {
            byte c0 = c.shiftRight(35).byteValue();
            c = c.and(POLYMOD_AND_CONSTANT).shiftLeft(5)
                    .xor(new BigInteger(String.format("%02x", checksumInput[i]), 16));

            if ((c0 & 0x01) != 0)
                c = c.xor(POLYMOD_GENERATORS[0]);
            if ((c0 & 0x02) != 0)
                c = c.xor(POLYMOD_GENERATORS[1]);
            if ((c0 & 0x04) != 0)
                c = c.xor(POLYMOD_GENERATORS[2]);
            if ((c0 & 0x08) != 0)
                c = c.xor(POLYMOD_GENERATORS[3]);
            if ((c0 & 0x10) != 0)
                c = c.xor(POLYMOD_GENERATORS[4]);
        }

        byte[] checksum = c.xor(BigInteger.ONE).toByteArray();
        if (checksum.length == 5) {
            return checksum;
        } else {
            byte[] newChecksumArray = new byte[5];

            System.arraycopy(checksum, Math.max(0, checksum.length - 5), newChecksumArray,
                    Math.max(0, 5 - checksum.length), Math.min(5, checksum.length));

            return newChecksumArray;
        }

    }

    private static byte[] getPrefixBytes(String prefixString) {
        byte[] prefixBytes = new byte[prefixString.length()];

        char[] charArray = prefixString.toCharArray();
        for (int i = 0; i < charArray.length; i++) {
            prefixBytes[i] = (byte) (charArray[i] & 0x1f);
        }

        return prefixBytes;
    }

    private static byte[] concatenateByteArrays(byte[] first, byte[] second) {
        byte[] concatenatedBytes = new byte[first.length + second.length];

        System.arraycopy(first, 0, concatenatedBytes, 0, first.length);
        System.arraycopy(second, 0, concatenatedBytes, first.length, second.length);

        return concatenatedBytes;
    }

    private static byte[] convertBits(byte[] bytes8Bits, int from, int to, boolean strictMode) {
        //Copyright (c) 2017 Pieter Wuille

        int length = (int) (strictMode ? Math.floor((double) bytes8Bits.length * from / to)
                : Math.ceil((double) bytes8Bits.length * from / to));
        int mask = ((1 << to) - 1) & 0xff;
        byte[] result = new byte[length];
        int index = 0;
        int accumulator = 0;
        int bits = 0;
        for (int i = 0; i < bytes8Bits.length; i++) {
            byte value = bytes8Bits[i];
            accumulator = (((accumulator & 0xff) << from) | (value & 0xff));
            bits += from;
            while (bits >= to) {
                bits -= to;
                result[index] = (byte) ((accumulator >> bits) & mask);
                ++index;
            }
        }
        if (!strictMode) {
            if (bits > 0) {
                result[index] = (byte) ((accumulator << (to - bits)) & mask);
                ++index;
            }
        } else {
            if (!(bits < from && ((accumulator << (to - bits)) & mask) == 0)) {
                throw new RuntimeException("Strict mode was used but input couldn't be converted without padding");
            }
        }

        return result;
    }

    // 转换为Base32
    private static String encodeBase32(byte[] byteArray) {
        StringBuffer sb = new StringBuffer();

        for (int i = 0; i < byteArray.length; i++) {
            int val = (int) byteArray[i];

            if (val < 0 || val > 31) {
                throw new RuntimeException("This method assumes that all bytes are only from 0-31. Was: " + val);
            }

            sb.append(CHARS_BASE32[val]);
        }

        return sb.toString();
    }

    // Base32解码
    private static byte[] decodeBase32(String base32String) {
        byte[] bytes = new byte[base32String.length()];

        char[] charArray = base32String.toCharArray();
        for (int i = 0; i < charArray.length; i++) {
            Integer position = char_Base32_PositionMap.get(charArray[i]);
            if (position == null) {
                throw new RuntimeException("There seems to be an invalid char: " + charArray[i]);
            }
            bytes[i] = (byte) ((int) position);
        }

        return bytes;
    }


    public enum BitcoinCashAddressType {

        P2PKH((byte) 0), P2SH((byte) 8);

        private final byte versionByte;

        BitcoinCashAddressType(byte versionByte) {
            this.versionByte = versionByte;
        }

        public byte getVersionByte() {
            return versionByte;
        }
    }


    @Data
    // Helper class for CashAddr
    public static class BitcoinCashAddressDecodedParts {

        String prefix;

        BitcoinCashAddressType addressType;

        byte[] hash;

    }


}
```




## 8. 小结

AI出现以后，设计和算法思想的价值体现就更明显了， 因为AI已经可以很高效地执行代码编写，编码不再是纯粹苦力的搬砖活动了。

