# JFrame#dispose()方法与JNI简介


A JNI global reference is a reference from "native" code to a Java object managed by the Java garbage collector. Its purpose is to prevent collection of an object that is still in use by native code, but doesn't appear to have any live references in the Java code.

A JFrame is a java.awt.Window, and is associated with a "native" Window object. When you are completely finished with a particular JFrame instance, you should invoke its dispose() method to clean up.

I am not sure if any native code is creating a global reference to the JFrame, but it seems likely. If it does, this will prevent the JFrame from being garbage collected. If you are creating many Windows (or subclasses) and seeing that they are never collected, make sure that they are disposed.




参考:  [stackoverflow: What is 'JNI Global reference'](http://stackoverflow.com/questions/112603/what-is-jni-global-reference/112720#112720)

