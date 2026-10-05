# Java 封装(Encapsulation in Java)

Encapsulation is defined as the wrapping up of data under a single unit. It is the mechanism that binds together code and the data it manipulates.Other way to think about encapsulation is, it is a protective shield that prevents the data from being accessed by the code outside this shield.

封装(Encapsulation)被定义为将数据包装到一个单一单元中。它是把代码和其所操作的数据绑定在一起的机制。换一种方式来理解封装：它就像一层保护屏障，防止数据被这层屏障之外的代码访问。

- Technically in encapsulation, the variables or data of a class is hidden from any other class and can be accessed only through any member function of own class in which they are declared.
- As in encapsulation, the data in a class is hidden from other classes, so it is also known as **data-hiding**.
- Encapsulation can be achieved by: Declaring all the variables in the class as private and writing public methods in the class to set and get the values of variables.

- 从技术上讲，在封装中，类的变量或数据对其他任何类都是隐藏的，只能通过声明它们的类自身的成员函数来访问。
- 由于封装把类中的数据对其他类隐藏起来，因此它也被称为**数据隐藏(data-hiding)**。
- 实现封装的方式是：把类中的所有变量声明为 private，并在类中编写 public 方法来设置和获取这些变量的值。



[![Encapsulation](http://cdncontribute.geeksforgeeks.org/wp-content/uploads/Encapsulation.jpg)](http://cdncontribute.geeksforgeeks.org/wp-content/uploads/Encapsulation.jpg)

```
// Java program to demonstrate encapsulation 
public class Encapsulate 
{ 
    // private variables declared  
    // these can only be accessed by  
    // public methods of class 
    private String geekName; 
    private int geekRoll; 
    private int geekAge; 
  
    // get method for age to access  
    // private variable geekAge 
    public int getAge()  
    { 
      return geekAge; 
    } 
   
    // get method for name to access  
    // private variable geekName 
    public String getName()  
    { 
      return geekName; 
    } 
      
    // get method for roll to access  
    // private variable geekRoll 
    public int getRoll()  
    { 
       return geekRoll; 
    } 
   
    // set method for age to access  
    // private variable geekage 
    public void setAge( int newAge) 
    { 
      geekAge = newAge; 
    } 
   
    // set method for name to access  
    // private variable geekName 
    public void setName(String newName) 
    { 
      geekName = newName; 
    } 
      
    // set method for roll to access  
    // private variable geekRoll 
    public void setRoll( int newRoll)  
    { 
      geekRoll = newRoll; 
    } 
} 
```

In the above program the class EncapsulateDemo is encapsulated as the variables are declared as private. The get methods like getAge() , getName() , getRoll() are set as public, these methods are used to access these variables. The setter methods like setName(), setAge(), setRoll() are also declared as public and are used to set the values of the variables.

在上面的程序中，EncapsulateDemo 类实现了封装，因为变量都被声明为 private。getAge()、getName()、getRoll() 这些 get 方法被设为 public，用于访问这些变量。setName()、setAge()、setRoll() 这些 setter 方法也被声明为 public，用于设置这些变量的值。

The program to access variables of the class EncapsulateDemo is shown below:

访问 EncapsulateDemo 类中变量的程序如下所示：


```
public class TestEncapsulation 
{     
    public static void main (String[] args)  
    { 
        Encapsulate obj = new Encapsulate(); 
          
        // setting values of the variables  
        obj.setName("Harsh"); 
        obj.setAge(19); 
        obj.setRoll(51); 
          
        // Displaying values of the variables 
        System.out.println("Geek's name: " + obj.getName()); 
        System.out.println("Geek's age: " + obj.getAge()); 
        System.out.println("Geek's roll: " + obj.getRoll()); 
          
        // Direct access of geekRoll is not possible 
        // due to encapsulation 
        // System.out.println("Geek's roll: " + obj.geekName);         
    } 
} 
```

Output:

输出结果：

```
Geek's name: Harsh
Geek's age: 19
Geek's roll: 51
```

**Advantages of Encapsulation**:

**封装的优点**：

- **Data Hiding:** The user will have no idea about the inner implementation of the class. It will not be visible to the user that how the class is storing values in the variables. He only knows that we are passing the values to a setter method and variables are getting initialized with that value.
- **Increased Flexibility:** We can make the variables of the class as read-only or write-only depending on our requirement. If we wish to make the variables as read-only then we have to omit the setter methods like setName(), setAge() etc. from the above program or if we wish to make the variables as write-only then we have to omit the get methods like getName(), getAge() etc. from the above program
- **Reusability:** Encapsulation also improves the re-usability and easy to change with new requirements.
- **Testing code is easy:** Encapsulated code is easy to test for unit testing.

- **数据隐藏(Data Hiding):** 用户对类的内部实现一无所知。用户看不到类是如何在变量中存储值的。他只知道我们把值传给 setter 方法，变量就会被初始化为该值。
- **更高的灵活性(Increased Flexibility):** 可以根据需求把类的变量设为只读或只写。如果想把变量设为只读，就必须省略上面程序中的 setName()、setAge() 等 setter 方法；如果想把变量设为只写，则必须省略 getName()、getAge() 等 get 方法。
- **可重用性(Reusability):** 封装还提高了可重用性，并且便于根据新需求进行修改。
- **易于测试(Testing code is easy):** 封装后的代码很容易进行单元测试。

This article is contributed by [**Harsh Agarwal**](https://www.facebook.com/harsh.agarwal.16752). If you like GeeksforGeeks and would like to contribute, you can also write an article using [contribute.geeksforgeeks.org](http://www.contribute.geeksforgeeks.org/) or mail your article to contribute@geeksforgeeks.org. See your article appearing on the GeeksforGeeks main page and help other Geeks.

本文由 [**Harsh Agarwal**](https://www.facebook.com/harsh.agarwal.16752) 投稿。如果你喜欢 GeeksforGeeks 并且愿意投稿，也可以使用 [contribute.geeksforgeeks.org](http://www.contribute.geeksforgeeks.org/) 撰写文章，或将文章发送到 contribute@geeksforgeeks.org。让你的文章出现在 GeeksforGeeks 主页上，帮助其他 Geeks。

Please write comments if you find anything incorrect, or you want to share more information about the topic discussed above.

如果你发现任何不正确之处，或者想分享更多与上述主题相关的信息，请在评论区留言。


- Java工程师成神之路: <https://github.com/hollischuang/toBeTopJavaer>

<https://www.geeksforgeeks.org/encapsulation-in-java/>
