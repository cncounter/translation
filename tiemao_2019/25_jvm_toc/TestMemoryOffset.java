package com.cnc;

import sun.misc.Unsafe;

import java.lang.reflect.Field;
import java.util.Random;

/**
 * Created by renfufei on 2019/8/14.
 */
public class TestMemoryOffset {
    public static void main(String[] args){
        long num1 = new Random().nextInt()+1L;
        //
        LongWrapper wrapper = new LongWrapper();
        wrapper.setNum(num1);

        //
        long num2 = getUnsafe().getLong(wrapper, 16L);
        //
        System.out.println("num1="+num1);
        System.out.println("num2="+num2);


    }

    public static Unsafe getUnsafe(){
        Unsafe unsafe =null;
        try{
            Class<?> clazz = Unsafe.class;
            Field f;

            f = clazz.getDeclaredField("theUnsafe");

            f.setAccessible(true);
            unsafe = (Unsafe) f.get(clazz);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return unsafe;
    }

    public static class LongWrapper{
        // long 字段的offset应该是16
        private long num;

        public long getNum() {
            return num;
        }

        public void setNum(long num) {
            this.num = num;
        }
    }
}
