---
layout: post
title: 'Java Programming for Beginners - Lesson 2'
author:
  display_name: Miguel Obregon
  first_name: Miguel
  last_name: Obregon
---

## GuessingGame - Overview

```java
import java.util.Scanner;

public class GuessingGame {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.println("Guess the number!");

        int secret_number = (int)(Math.random() * 100 + 1);
        
        while(true) {
            System.out.println("Please input your guess.");

            int guess = input.nextInt();

            System.out.printf("You guessed: %d%n", guess);

            if(guess < secret_number) {
                System.out.println("Too small!");
            } 
            else if(guess > secret_number) {
                System.out.println("Too big!");
            }
            else {
                System.out.println("You win!");
                break;
            }
        }
        
    }
}
```

If you run this in your IDE you can try to guess a number 1 to 100. It will
keep asking you until you guess it correctly. Let's go over this line by line.

```java
import java.util.Scanner;
```

Since we are asking the user for input we need to be able to grab that data for
use in our program. The `Scanner` class from the java.util package allows us to
read from the keyboard. So we import it via the above statement.

```java
public class GuessingGame {
    public static void main(String[] args) {
```

As we learned last time we always need these two line to be able to run our
code. The first is always named the same as the file in this case `GuessingGame`.
The second line is the entry point to our program or where our code starts.

```java
Scanner input = new Scanner(System.in);
```

As we just went over the `Scanner` class allows to read from the keyboard. To do
so we create a variable of type `Scanner` with some name like input or keyboard.
On the right hand side of the statement we create a new instance of `Scanner`
and we pass `System.in`. `System.in` is what we consider to be the keyboard. So
we are creating a `Scanner` that reads from the keyboard. Later on we can create
Scanners that read files or Strings so in general they are more versatile than
just reading from the keyboard.

```java
System.out.println("Guess the number!");
```

Hopefully you understand what this line does, if not I recommend going over
[Lesson 1]
(http://texaspse.org/blog/2017/02/19/java-programming-for-beginners-lesson-1/)
. Briefly it prints "Guess the number!" to the screen with an `<Enter>` after it

```java
int secret_number = (int)(Math.random() * 100 + 1);
```

Here we create a random number between 1 and 100. We know `Math.random()` 
returns a `double` from 0.0 to 1.0 exclusive. We can multiply this by a range in
our case 100 and add it by the starting number in our case 1. This gives us a
number between 1.0 and 101.0 exclusive but we want a whole number so we cast it
to an `int`. Casting it truncates the decimal part giving us a whole number
giving us 1 to 100. Say we did not add 1 we would instead get a number between
0 and 99.

*Exercise 2.1*: Create a random number between 34 and 78. Answers at the bottom
of the page.

```java
while(true) {
```

Now that we have everything we need for the game we need to start asking for
guesses. It would be boring if the player could only guess once especially for a
number from 1 to 100. So we need a way to have the program do something over and
over again. Luckily we have loops, specifically `while` and `for`. In this case
we are using a `while` loop. For now lets assume this line causes everything in
the curly braces to loop forever.

```java
int guess = input.nextInt();
```

So we know we can loop forever but how do we use `Scanner` to read from the
keyboard? The method call `input.nextInt()` grabs a whole number from the
keyboard and returns it to us. We then put that value in to a new variable named
guess.

```java
if(guess < secret_number) {
    System.out.println("Too small!");
}
else if(guess > secret_number) {
    System.out.println("Too big!");
}
else {
    System.out.println("You win!");
    break;
}
```

Now the we have the user's guess we need to figure it out if they have won or
we need to give them feedback. This decision making is embodied in `if`, `else`,
and `else if` statements. So briefly `if(<conditional>) {<code>}` says that if
the conditional is true we should do what's inside the curly braces.

## GuessingGame - Conditionals

Conditionals are expressions that evaluate to either `true` or `false`. They
allow you to making decisions by determining if things are well true or false.
There are several expressions can be used as conditionals but we will focus on
comparsion expressions.

In Java if you want to compare two things for example is 10 greater than 0, you
can use one of the many comparsion operators. All these take two operands and
give you either a `true` or `false`. In Java `true` and `false` are of the data
type `boolean` so you can say that conditionals are expressions that evalaute to
a `boolean`.

These operators are `>`, `<`, `>=`, `<=`, `==` which are greater than, less
than, greater than or equal, less than or equal, and equal. You can use these
like any other operator so with variables and numbers.

Conditionals can also be combined using `&&` and `||`. Say you want to check if
a number is within 90 and 80, mathematically you would check `80 < x < 90`.
Unfortunately we can't do that in Java. We can, however, check both `x > 80`
and `x < 90` by typing this `x > 80 && x < 90`. `&&` says that we want both
operands to evaluate to `true` for the whole thing to be `true`. There is also
`||` which says that only one of them has to be `true` for the whole thing to be
true.

## GuessingGame - `if`, `else`, and `else if`

Now that we know what conditionals are we can explain `if` statements. If the
condition in the `if` evaluates to `true` we do what is inside the curly braces.
If we want to do something if the condition is false we use `else`. `else` is
always attached to an `if` and will run the code inside the `else` curly braces
if the attached `if` was false.

```java
if(<condition>) {

} else if(<condition>) {

} else if(<condition>) {

}
```

We can chain `if` and `else` statements by adding an additional `if` statement
after `else`. If the first `if` is false it will go to the `else if` and check
that condition. If that condition is false it will go to the next else and so
on.

*Exercise 2.2*: Create a program that prints out the letter grade for a number
grade. The number grade would be in a variable named grade.

## GuessingGame - `while`

Earlier we decided to just assume that `while(true)` loops forever. Hopefully
you understand why it does now. `while` checks its condition every time it loops
so if the condition is always true we will loop forever. Obviously we can put
something else there instead of `true` and it will check it every time it loops.

So since we loop forever you are probably wondering why the program stops we
when we give the right number. If you look back at the code you will see that
when we find out that the guess is right we use the statement `break;`. `break`
will stop the current loop and continue on to the next line of code after the
loop. This let's us loop until we decide we're done.

There is also another control statement like `break` called `continue`. While
`break` stops the loop entirely `continue` stops the current iteration. So
everything after a `continue` will not be executed for that iteration and it
will go back to the top of loop, check the condition, and if true continue the
loop. 

## GuessingGame - `Scanner`

As we explained early `Scanner` lets us read input from the keyboard. To be able
use `Scanner` in our programs we always need to import it. We put this at the
top of the file.

```java
import java.util.Scanner;
```

Now we need to create our own instance or copy of `Scanner` that reads from
`System.in`. `System.in` is the keyboard. We put this in the main method.

```java
Scanner input = new Scanner(System.in);
```

After we set up our `Scanner` we use it by calling one of its methods. Below
are some examples of how you would read different things from the keyboard.

```java
int num = input.nextInt(); // Reads in a whole number like "2"
double deci = input.nextDouble(); // Reads in a decimal number like "3.14"
String word = input.next(); // Reads in a single word like "Java"
String line = input.nextLine(); // Reads in a whole line like "Java is awesome!"
```

You can see the all the ways to read in things from the keyboard by going to the
Java API Docs for the
[Scanner](http://docs.oracle.com/javase/8/docs/api/java/util/Scanner.html?is-external=true)
class.

*Exercise 2.3*: Modify 2.2 to read the number grade from the keyboard instead of
it being pre-set by the programmer.

## GuessingGame - `printf`

We will be going over this in detail in the next lesson. `printf` lets you
format your output. Basically you can make things look nicer.

## Homework

- Being able to do the exercises in this write-up.
- Try Warmup-1's sleepIn, monkeyTrouble, sumDouble from 
[CodingBat](http://codingbat.com/)
- You can also try other problems from Logic-1 and Warmup-1

## Solutions

### Exercise 2.1
```java
int random = (int)(Math.random() * 45 + 1);
```

### Exercise 2.2
```java
int grade = 75;

if(grade >= 90) {
    System.out.println("A");
} else if(grade >= 80) {
    System.out.println("B");
} else if(grade >= 70) {
    System.out.println("C");
} else {
    System.out.println("F");
}
```


### Exercise 2.3
```java
// Top of file
import java.util.Scanner;

// Inside main method
Scanner input = new Scanner(System.in);
int grade = input.nextInt();

if(grade >= 90) {
    System.out.println("A");
} else if(grade >= 80) {
    System.out.println("B");
} else if(grade >= 70) {
    System.out.println("C");
} else {
    System.out.println("F");
}
```
