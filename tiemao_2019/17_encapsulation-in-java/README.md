# Encapsulation in Java



Encapsulation is defined as the wrapping up of data under a single unit. It is the mechanism that binds together code and the data it manipulates.Other way to think about encapsulation is, it is a protective shield that prevents the data from being accessed by the code outside this shield.

- Technically in encapsulation, the variables or data of a class is hidden from any other class and can be accessed only through any member function of own class in which they are declared.
- As in encapsulation, the data in a class is hidden from other classes, so it is also known as **data-hiding**.
- Encapsulation can be achieved by: Declaring all the variables in the class as private and writing public methods in the class to set and get the values of variables.



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

The program to access variables of the class EncapsulateDemo is shown below:


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

```
Geek's name: Harsh
Geek's age: 19
Geek's roll: 51
```

**Advantages of Encapsulation**:

- **Data Hiding:** The user will have no idea about the inner implementation of the class. It will not be visible to the user that how the class is storing values in the variables. He only knows that we are passing the values to a setter method and variables are getting initialized with that value.
- **Increased Flexibility:** We can make the variables of the class as read-only or write-only depending on our requirement. If we wish to make the variables as read-only then we have to omit the setter methods like setName(), setAge() etc. from the above program or if we wish to make the variables as write-only then we have to omit the get methods like getName(), getAge() etc. from the above program
- **Reusability:** Encapsulation also improves the re-usability and easy to change with new requirements.
- **Testing code is easy:** Encapsulated code is easy to test for unit testing.

This article is contributed by [**Harsh Agarwal**](https://www.facebook.com/harsh.agarwal.16752). If you like GeeksforGeeks and would like to contribute, you can also write an article using [contribute.geeksforgeeks.org](http://www.contribute.geeksforgeeks.org/) or mail your article to contribute@geeksforgeeks.org. See your article appearing on the GeeksforGeeks main page and help other Geeks.

Please write comments if you find anything incorrect, or you want to share more information about the topic discussed above.


- Java工程师成神之路: <https://github.com/hollischuang/toBeTopJavaer>

<https://www.geeksforgeeks.org/encapsulation-in-java/>
