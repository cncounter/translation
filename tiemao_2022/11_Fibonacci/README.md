# Fibonacci 数列的一种优化算法

> 说明1: 因为Java线程调用栈深度的限制, 最好不使用递归;


最终代码:

```java
package com.cncounter.demo.math;

import java.math.BigDecimal;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/*
费波那契数列 意大利语：Successione di Fibonacci
又译为费波拿契数、斐波那契数列、费氏数列、黄金分割数列。
 */
public class Fibonacci {
    // 说明: 因为数列是固定的, 所以可以进行一定量的优化, 在全局变量中缓存结果, 加速计算;
    private static final int MAX_CACHE_SIZE = 10_0000;
    private static final Map<Integer, BigDecimal> FibonacciCache
            = new ConcurrentHashMap<Integer, BigDecimal>(MAX_CACHE_SIZE);

    // 封装为对象和值的方式
    private int index;
    public Fibonacci(int index) {
        this.index = index;
    }

    // 计算long类型的 Fibonacci 数列;
    public long fibonacciLong() {
        // 特殊情况
        if (index < 0) {
            throw new IllegalArgumentException("所计算的数列index需要 >= 0");
        } else if (index <= 1) {
            return index;
        }
        // x-2
        long fib_x_minus_2 = 0;
        // x-1
        long fib_x_minus_1 = 1;
        // 循环 - 叠加
        for (int i = 2; i < index; i++) {
            long fib_i = fib_x_minus_2 + fib_x_minus_1;
            fib_x_minus_2 = fib_x_minus_1;
            fib_x_minus_1 = fib_i;
        }
        long fib_x = fib_x_minus_2 + fib_x_minus_1;
        if (fib_x < 0L) {
            throw new IllegalStateException("结果超出long类型的范围! index=" + index);
        }
        return fib_x;
    }

    // 不使用递归, 计算 BigDecimal 返回值的 Fibonacci 数列;
    public BigDecimal fibonacciBigDecimal() {
        // 特殊情况
        if (index < 0) {
            throw new IllegalArgumentException("所计算的数列index需要 >= 0");
        } else if (index <= 1) {
            return BigDecimal.valueOf(index);
        }
        // 优化: 尝试使用缓存;
        BigDecimal cacheResult = tryFibonacciCache(index);
        if (null != cacheResult) {
            return cacheResult;
        }
        // x-2
        BigDecimal fib_x_minus_2 = BigDecimal.ZERO;
        // x-1
        BigDecimal fib_x_minus_1 = BigDecimal.ONE;
        // 循环 - 叠加
        for (int i = 2; i < index; i++) {
            BigDecimal fib_i = fib_x_minus_2.add(fib_x_minus_1);
            fib_x_minus_2 = fib_x_minus_1;
            fib_x_minus_1 = fib_i;
        }
        BigDecimal fib_x = fib_x_minus_2.add(fib_x_minus_1);
        if (fib_x.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalStateException("结果超出BigDecimal类型的范围! index=" + index);
        }
        return fib_x;
    }

    // 优化: 尝试使用缓存;
    private static BigDecimal tryFibonacciCache(int index) {
        // 1. 有缓存直接返回缓存;
        Integer n = Integer.valueOf(index);
        BigDecimal cache_n = FibonacciCache.get(n);
        if (null != cache_n) {
            return cache_n;
        }
        // 2. 处理特殊值: 这里也可以使用初始化; 私有函数不管负数;
        if (index < 2) {
            FibonacciCache.putIfAbsent(0, BigDecimal.valueOf(0));
            FibonacciCache.putIfAbsent(1, BigDecimal.valueOf(1));
            return FibonacciCache.get(n);
        }
        // 3. 需要根据缓存计算的情况
        Integer n_2 = Integer.valueOf(index - 2);
        Integer n_1 = Integer.valueOf(index - 1);
        BigDecimal cache_n_2 = FibonacciCache.get(n_2);
        BigDecimal cache_n_1 = FibonacciCache.get(n_1);
        if (null == cache_n_2 || null == cache_n_1) {
            return null;
        }
        // 3.1 根据缓存累加
        cache_n = cache_n_2.add(cache_n_1);
        if (FibonacciCache.size() < MAX_CACHE_SIZE) {
            FibonacciCache.put(n, cache_n);
        }
        return cache_n;
    }

    public static void testFibLong() {
        int max = 93;
        long fib_n_1 = 1;
        for (int n = 0; n <= max; n++) {
            Fibonacci model = new Fibonacci(n);
            long fib_n = model.fibonacciLong();
            // 计算黄金分割比例
            double golden_section = fib_n / (fib_n_1 + 0.0d);
            //
            fib_n_1 = fib_n;
            System.out.println("n=" + n + "; fib_n=" + fib_n +
                    "; golden_section=" + golden_section);
        }
    }

    public static void testFibBigDecimal() {
        // 最多计算的数列
        final int max = 3600;
        BigDecimal fib_n_1 = BigDecimal.ONE;
        for (int n = 0; n <= max; n++) {
            // 使用面向对象的方式
            Fibonacci model = new Fibonacci(n);
            BigDecimal fib_n = model.fibonacciBigDecimal();
            // BigDecimal除法计算必须指定小数精度
            final int scale = 20;
            // 计算黄金分割比例;
            // 必须指定四舍五入模式;
            BigDecimal golden_section = fib_n.divide(fib_n_1, scale, BigDecimal.ROUND_HALF_DOWN);
            if (fib_n.compareTo(fib_n_1) > 0) {
                fib_n_1 = fib_n;
            }
            System.out.println("n=" + n + "; fib_n=" + fib_n +
                    "; golden_section=" + golden_section);
        }
    }

    public static void main(String[] args) {
        try {
            testFibLong();
        } catch (Throwable ex) {
            ex.printStackTrace();
        }
        try {
            testFibBigDecimal();
        } catch (Throwable ex) {
            ex.printStackTrace();
        }
    }

}

```
