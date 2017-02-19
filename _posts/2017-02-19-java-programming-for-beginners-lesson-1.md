---
layout: post
title: 'Java Programming for Beginners - Lesson 1'
author:
  display_name: Miguel Obregon
  first_name: Miguel
  last_name: Obregon
---

If this is your first time coming please follow the intructions here before
catching up on the lessons.

## HelloWorld.java - Running a Java program

In Eclipse create a new project by following `File > New > Java Project`. Name
the project JavaBeginners and press `Finish`. JavaBeginners should now appear in
the package explorer. Right click JavaBeginners and follow `New > Class`. Name
the class HelloWorld and press `Finish`. You should see the following.

```java
public class HelloWorld {

}
```

Copy the following into the editor.

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Java");
        System.out.println();
        System.out.print("Hello");
        System.out.println(" World!");
    }
}
```

Now run the code by clicking on the green play button or following `Run > Run`.
You should see the following below the code.

```
Java

Hello World!
```

You have succesfully ran you first Java program!

## HelloWorld.java - Understanding the code

The code you just ran has three main parts: the class, a main method,
and your code. These are as follows.

The class

```java
public class HelloWorld {}
```

The class is always named the same as its file. The main method lies inside the
class.

The main method

```java
public static void main(String[] args) {}
```

The main method contains the code you write.

Your code

```java
System.out.println("Java");
System.out.println();
System.out.print("Hello");
System.out.println(" World!");
```

The code we told you to copy. This can be anything you want it to be.

The first two parts will always be the same for any program you write. At the
moment you do not need to understand what method and class mean. The part
that you write is always inside the main method.

Note: from here on all code snippets are assumed to be inside the main method.

In this case we are printing messages to the console. To print a String you 
use the following method.

```java
System.out.print("<text goes here>");
```
String is Java's name for text. Strings are created by putting text within `""`.
This method will not print an `<Enter>` at the end of the text. If you make two
succesive calls to the method like so.

```java
System.out.print("First");
System.out.print("Second");
```

You will get the following output.

```
FirstSecond
```

If you wanted it the two Strings to appear on seperate lines you need to use the
`println()` method.

```java
System.out.print("First");
System.out.println();
System.out.print("Second");
```

The above will print.

```
First
Second
```

You can also pass a String to `println()` like so.

```java
System.out.println("There is an <Enter> at the end of this line");
```

You should now understand the first program you ran. Try printing other things
out.

## HelloWorld.java - Commenting the program

Before we move on to more of the basics of Java we need to hook you up with the
programmers best friend: Documentation. Say you wrote the HelloWorld program a
decade ago and you have since forgetten what the program does wouldn't it be
great if you could read the code with your own thoughts next to it. That's what
comments are for. Comments are ignored by Java and allow you to explain the code
you write. They are created like so.

```java
// This is a single line comment
// This is a another single line comment
System.out.println("Hi"); // This a comment on the same line as code
/*
 Welcome to the mult-line comment.
 You can write as many lines as you want
 Just make sure to end it.
*/
System.out.println("Bye");
```

Try commenting the HelloWorld program. Once you're done we can do some math.

## HelloWorld.java - Basic Operations
