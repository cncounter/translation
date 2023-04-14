# 浅谈 InterruptedException


```java

    private void sleep(long millis) {
        try {
            TimeUnit.MILLISECONDS.sleep(millis);
        } catch (InterruptedException e) {
            // 此处可以干一些补救措施, 比如清理工作之类的;
            throw new RuntimeException("线程睡眠被打断, 别干活了, 赶紧退出!", e);
        }
    }

```
