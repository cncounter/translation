# 写一个Java置顶窗口定时提醒程序

也许可以考虑增加一个按钮或者复选框来控制死循环、以及退出程序。

或者考虑控制台


实现代码如下:


```
package com.cncounter.test.timeout;

import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Created on 2018-06-29.
 */
public class AutoReminder {
    // 自动提醒周期
    public static long period = TimeUnit.MINUTES.toMillis(7);
    //
    public static void main(String[] args) {
        // 死循环
        while(true){
            //
            try {
                remind("请注意保护眼睛!");
            } catch (Exception e) {
                e.printStackTrace();
            }
            // 休眠- 暂停
            try {
                TimeUnit.MILLISECONDS.sleep(period);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        //

    }


    public static void remind(String info) {
        //
        if(ReminderWindow.isExistsWindow.get()){
            return; // 防止打开太多
        }
        //
        ReminderWindow jWindow = new ReminderWindow(info);
        //
        ReminderPanel jPanel = new ReminderPanel(info);
        jPanel.setBounds(10, 10, 100, 100);
        //
        jWindow.add(jPanel);
        jWindow.setVisible(true);
        // 窗口置顶
        jWindow.setAlwaysOnTop(true);
    }


    public static class ReminderPanel extends JPanel{

        private int x = 10;
        private int y = 10;
        //
        private int width = 200;
        private int height = 100;
        //
        private String title = null;
        private Date prevDate = new Date();

        public ReminderPanel(String title) {
            this.title = title;
        }

        @Override
        public void paint(Graphics g) {
            super.paint(g);
            //
            Date curDate = new Date();
            //
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String curTime = "当前时间: "+ format.format(curDate);
            String prevTime = "上次时间: "+ format.format(prevDate);
            //
            prevDate = curDate;
            //
            System.out.println(curTime);
            System.out.println(prevTime);
            //
            g.drawString(title, width / 2, height / 2);
            //
            g.drawString(curTime, width / 2, 30 + height / 2);
            //
            g.drawString(prevTime, width / 2, 60 + height / 2);
        }
    }

    public static class ReminderWindow extends JWindow{
        //
        public static AtomicBoolean isExistsWindow = new AtomicBoolean(false);

        //
        private int x = 360;
        private int y = 200;
        //
        private int width = 400;
        private int height = 200;
        //
        private String title = null;
        //

        public ReminderWindow(String title) {
            //
            this.title = title;
            setBounds(x, y, width, height);
            //
            isExistsWindow.compareAndSet(false, true);


            // Print (X,Y) coordinates on Mouse Click
            addMouseListener(new MouseAdapter() {

                public void mousePressed(MouseEvent e) {
                    // 释放窗口
                    ReminderWindow.this.dispose();
                    isExistsWindow.set(false);
                }
            });
        }

    }
}

```


2018年7月9日

