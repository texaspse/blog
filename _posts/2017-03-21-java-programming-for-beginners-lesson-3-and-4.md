---
layout: post
title: 'Java Programming for Beginners - Lesson 3 and 4'
author:
  display_name: Miguel Obregon
  first_name: Miguel
  last_name: Obregon
---

## Lesson 3 - Formatting with printf

So far when printing to the screen we have been using print and println to
display our results. When programs become larger in size it is often necessary
to have information displayed in more readable ways or in certain formats. While
you can write your own code to creating different display methods its often
easier to use the printf function provided by Java.

```java
int i = 10;
System.out.println("Answer is " + i + " lines of code");
System.out.printf("Answer is %d lines of code%n", i);
```

Both lines in the above code print out the same thing but the second one has
more flexibility and is usually easier to understand once you learn it.

%d is a marker that tells printf to put in integer there. So "2 + 2 = %d" with a
second argument of 4 will print out "2 + 2 = 4". You can put as many of these as
you want into what is called a format string. For example "%d + %d = %d" and
2,2,4 will print the same as before.

There are also other format specifiers like %f and %s. %f lets you print out
floating point numbers i.e. decimals and %s lets your print other Strings.

```java
System.out.printf("2.5 + 2.2 = %f", 4.7);
System.out.printf("Hello %s", "Bob");
```

The main difference between %f and printing out a double normally is that you
can specifiy the number of decimal values using %f. For example to print only 2
decimal places.

```java
System.out.println("%.2f", 4.23212);
```

## Lesson 4 - Arrays

In most programs eventually you will need to store large amounts of related
data to do work on. With our current skill set to be able to store for example a
list of the students in class we would have to make a variable for every student
in the class. This seems unnecessairly tedious and not very flexible since we
would have to write a unique line for every student in the class.

Luckily Java provides us with a construct to be able to store several of the
same data type in a single variable. This construct is called an array and can
be made like so for any data type.

```java
int size = 10; // Some predefined size
int[] intArray = new int[size];
float[] floatArray = new float[size];
```

Every array has to be declared with the number of locations that the programmer
wants to use. This size does not change throughout the lifetime of the array. So
we created an int array of size 10 lets learn how to access the elements of the
array.

```java
System.out.println(intArray[0]); // Prints the first element
System.out.println(intArray[1]); // Prints the second element
System.out.println(intArray[size]); // Crashes
```

From the above code we can see that to access elements we have to use a zero
based indexing system. That is to say the the first element in an array is at
index 0, second at index 1, and so on. A common mistake programmers make because
of this is attempting to access the SIZEth (10th in our case) element of an
array. Because the array is zero indexed the last element has an index of size-1
not size. The last valid access for us is the 9th element.

We learned how to access elements before being able to modify them so what
happens when you access an element before modifying? From the above example we
can see that we do not crash but instead print out two zeros. These zeros are
the default value for ints. Whenever an array is created all the element are
populated with the default value for that data type. Some defaults are 0 for
int, 0.0 for float and double, and null for String.

```java
System.out.println(intArray[0]);
intArray[0] = 10;
System.out.println(intArray[0]);
```

The above code sets the element at index 0 to 10. You can do the same for any of
the elements in the array.

```java
for(int i = 0; i < intArray.length; i++) {
    intArray[i] = i;
}
```

The above code sets every element in the array to its index. Here we use
intArray.length to know how many elements long the array is.

## Lesson 4 - ArrayList

You may have noticed that we still have a problem if we use arrays to store for
example students in a class. What happens if we have 10 students in an array and
we want to add another? We can't unless we had an array of length 11. We could
make a new larger array, copy the old array into it, and add the new student but
again Java has a cleaner solution.

An ArrayList is a class that acts a lot like an array but has the ability to add
and remove elements rather than only being able to modify them. We create
ArrayLists like this.

```java
ArrayList<Integer> intArrayList = new ArrayList<>();
ArrayList<Double> doubleArrayList = new ArrayList<>();
```

As you can see we did not define as size like arrays, since  ArrayLists are
variable we do not need to give it a predefined size.

```java
System.out.println(intArrayList.get(0));
System.out.println(intArrayList.get(1));
```

ArrayLists are also zero-indexed and also crash your program if you try to
access elements greater than or equal to size

```java
intArrayList.add(10);    // 10
intArrayList.add(5);     // 10, 5
intArrayList.add(0, 1);  // 1, 10, 5
intArrayList.set(1, 2);  // 1, 2, 5
intArrayList.remove(2);  // 1, 2
```

Now we can add and remove elements. Adding elements defaultly adds to end of the
ArrayList as seen in the first two lines. If you want to insert elements you
give the index you want the new number to become and all other elements are
pushed to higher indices. Set also requires an index and is equivalent to
modifying elements in an array. Removes the element at the index provided. Make
sure not confuse this we removing the actual number 2.

```java
for(int i = 0; i < intArrayList.size(); i++) {
    System.out.println(intArrayList.get(i));
}
```
