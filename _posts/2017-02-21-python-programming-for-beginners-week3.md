---
layout: post
title: 'Python Programming for Beginners - Week 3'
author:
  login: quynhnguyen
  email: quynhnguyen895@utexas.edu
  display_name: Mark Metzger
  first_name: Mark
  last_name: Metzger
---

# Python Lesson 3

## More on while loops

As a reminder, a while loop runs some block of code until some condition is no longer met. The block of code that is run can be anything like functions, arithmetic, or more while loops. See lesson 2 for more examples.
```python
counter = 0
while counter <= 100:
counter = counter + 1
print(counter)
# Prints numbers from 1 to 101
```

We also briefly talked about a equivalent, slightly easier way to increase a counter by one using the "+=" syntax.

```python
counter = 0
while counter <= 100:
counter += 1 # This is equivalent to "counter = counter + 1"
print(counter)
```

Another thing we talked about was the "break" keyword in python. What it does is simple: When a break statement is executed, the while loop that the break statement is within is emmediately exited. For example:

```python
counter = 0
while counter <= 100:
if counter == 50:
break 
counter += 1
print(counter)
print('done') # as soon as counter = 50, this line of code is executed as the python intepreter hits the break statement and exits the while loop
```

Another occasionally useful bit of python syntax is the "continue" statement. It is similar to the break statement except it immediately jumps to the next iteration of the while loop, skipping any code beneath it. For example:

```python
counter = 0
while counter <= 100:
if counter == 50:
counter += 1
continue 
counter += 1
print(counter) 
# as soon as counter = 50, the code beneath it is skipped resulting in every number being printed except for 51.
```

Neither "break" nor "continue" nor "+=" are essential to know, but they can frequently make your code simpler and easier to understand. But don't stress over memorizing them.

One example that is commonly covered is how to find a prime number with code. A prime number is number that is only evenly divisible by 1 and itself. For example, 11 is prime while 10 is not. The most logical way to check if a number is prime or not is by checking if it is divisible by every number less than it. This is the code:

```python
number = 11 # number to check if prime

counter = 2
isPrime = True # a third type of data that can be stored in a variable is a "boolean" meaning a True or False value. (It is different from a string)
while counter < number:
if number % counter == 0: # if evenly divisible by counter
isPrime = False # Then we know it is not prime
counter += 1
print(number, isPrime) # prints 11 followed by "True" if prime, False if not.
```

We can actually do a powerful optimization that will allow us to do the calculation much more efficiently. First of all, we should break out of the while loop as soon as the number is found to not be prime. And more importantly, we only have to check for divisors up to the square root of the number. The reason why can be seen by looking at the divisor pairs for 100: (2,50), (4,25), (10,10), (25,4), (50,2). As you can see, numbers after 10 are redundant. The optimized code:

```python
number = 1000000007 # Very large number

counter = 2
isPrime = True
while counter <= number**0.5: # "number**0.5" raises to the 0.5 power (square root)
if number % counter == 0:
isPrime = False
break # no more calculations are needed once it is found to not be prime
counter += 1
print(number, isPrime)
```

## Lists

The next thing we talked about was lists. Lists are extremely important because they allow you to store and perform calculations on large sets of data. For example, you could store a list of every person in PSE within a list, check if they have paid their membership fees, and if they haven't, send them an email. The syntax for lists is very simple. Simply type the data separated by commas and exclosed within brackets. For example:

```python
L = [1, 2, 3, 'a', 'b', 'c']
print(L)
```

But what if we want to access an individual element within the list? We can get access an element by putting its index in brackets. The best way to see is with an example.

```python
L = [1, 2, 3, 'a', 'b', 'c']
print(L[0]) # prints 1
print(L[1]) # prints 2
print(L[2]) # prints 3
print(L[3]) # prints a
print(L[4]) # prints b
print(L[5]) # prints c
# note: if you tried print(L[6]), you would crash the program as that element does not exist
```

A very important bit of information you need to access about a list is how many elements are within it. You can get that with the len() function as shown:

```python
L = [1, 2, 3, 'a', 'b', 'c']
size = len(L)
print(size) # prints 6
```

With both of those pieces of information, you can do calculations on a list. For example if you wanted to print out every element:

```python
L = [1, 2, 3, 'a', 'b', 'c']
counter = 0
while counter < len(L):
print(L[counter])
counter += 1
```

One useful thing you can do with list is to get a sublist with the ':' syntax. You can see an example here.

```python
L = [1, 2, 3, 'a', 'b', 'c']
print(L[1:3]) # prints [2, 3]
print(L[0:1]) # prints [1]
print(L[3:6]) # prints ['a', 'b', 'c']
```

Another useful things you can do with a list is add an element to the end with the append() function. We will see more function like this in the next class.

```python
L = [1, 2, 3, 'a', 'b', 'c']
L.append('d')
print(L) # prints [1, 2, 3, 'a', 'b', 'c', 'd']
```

Now, there is a whole world of possibilities of operations you can perform on a list. For example, here is some code to find the sum of all the elements of any list.

```python
L = [1, 2, 3, 4]
counter = 0
sum = 0
while counter < len(L):
sum = sum + L[counter]
counter = counter + 1
print(sum) # prints 10
```

An example we covered in class was how to find the sum of the squared differences between two lists. This is a normal statistical measure of how different two sets of data are.

```python
List1 = [1, 2, 3, 4]
List2 = [3, 1, 3, 9]
#answer is (1-3)^2 + (2-1)^2 + (3-3)^2 + (4-9)^2 = 30

counter = 0
sum = 0
while counter < len(List1):
difference = List1[counter] - List2[counter]
squared_difference = difference * difference
sum = sum + squared_difference
counter = counter + 1
print(sum) # prints 30
```

## Practice

* Print out every EVEN number between 1 and 100 using a while loop.
* Practice using the "break" statement by printing out every item in the fibonacci sequence (every item is sum of previous two: 1, 1, 2, 3, 5, 8, 13, 21, 34). But, make the while loop run forever (while True: ) and instead include a break statement to exit out of the while loop so you don't print out numbers over 1 million.
* One common thing to do with code is to integrate a function whose exact antiderivative is not known. Given a lower lower bound i, and an upper bound j, calculate the area under the curve f(x) = x^2 between those two x coordinates by finding the area of many thin rectangles under it. For example, for i = 0 and j = 3, print out '9' (or a close approximation)
* A very common (and cool) thing to do with code is to perform physics simulations on things too complicated to be easily solved analytically. Try and use the basic equations of kinematics and gravity to find how long it will take for an object dropped from rest to hit Earth when dropped from 10 million meters above Earth's surface. Slice up the interval into many small space or time steps (your choice) and constantly update position, speed, and acceleration. The answer should be around 3250 seconds.
* Given the list [1,3,5,7], find the product of all its terms. Answer: 105.
* Given the list [2,3,5,7], print out the list representing its RUNNING product. Answer: [2,6,30,210]
* Ask the user to input 3 things using 3 input() functions. Print them out in list form. Hint: try using the append() function.
* Given a list of numbers, print out a new list with all the odd numbers removed.
