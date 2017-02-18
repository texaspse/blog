---
layout: post
title: 'Python Programming for Beginners - Lesson 2'
author:
  display_name: Mark Metzger
  first_name: Mark
  last_name: Metzger
---

# Python Lesson 2

## Input Function

We began the class by discussing a new way to accept input from the person using your python script. You can simply use the input() function. As input, it takes in string that is simply some text to display to the user and has no real effect. Its output is what the user inputs (represented as text).

```python
age = input('What is your age? ')
# The program will hault until the user inputs a value
age = int(age)
#now age is represented as an integer. If the input was not an integer, the program will crash when it failed to convert.
print(age)
```

## If Statements


We then continued our discussion of if statements. Specifically, how to use elif and else. Notice that  if in following example, if we had simply had 4 if - statements (no elif or else), There would have been 4 (incorrect) messages if your age was below 16. The elif and else prevents more than one statement being executed.

```python
age = input('What is your age? ')
age = int(age) # must convert to number, so it can be compared to other numbers

if age < 16:
	print('You cannot do anything')
elif age < 18:
	print('You can drive')
elif age < 21:
	print('you can drive and join the military')
else:
	print('you can do everything')
```

Next we discussed the use of 'and' and 'or' within if statements. Should be pretty self-explanatory.

```python
age = input('What is your age? ')
age = int(age)

if age < 35 or age > 45:
	print('You are good')
if age >= 35 and age <= 45:
	print('midlife crisis!')
```
 
## While Loops
 
 The next concept we discussed was while loops. This is extremely important and when they are combined with if statemtents, there is very little that you cannot program. However, actually learning to apply them to difficult problems will take a lot of practice.
 
 While loops simply repeat some code over and over again until some condition evaluates to False. That is all you have to know. Their syntax is quite similar to if statements. 

```python
counter = 1
while counter <= 100:
	# constantly executes this code until counter is greater than 100
	print(counter)
    counter = counter + 1
#prints out every number between 1 and 100
```

You can even include while and if statements within other while loops and if statements as much as you want. Try to understand the following pieces of code. It prints out every combination of i and j whose sum is greater than 10. 

```python
i = 1
while i <= 10:
	j = 1
	while j <= 10:
    	if i + j > 10:
    		print(i, j)
        j = j + 1
    i = i + 1
```

As you can see, understanding while loops is quite simple, but actually using them can get quite complex in some cases. 

One example we looked at in class was the factorial function. factorial(5) = 5 * 4 * 3 * 2 * 1 = 120

```python
number = 5 # value to find factorial of

product = 1
n = 1
while n <= number:
	product = product * n
    n = n + 1
print('The factorial of', number, 'is', product)
```

Another example we covered was the the collatz conjecture. It states that any number following a simple rule will eventually go to 1. The rule is to divide even numbers by 2 and multiply odd numbers by 3 and add 1. Google it for more fascinating info.



```python
n = 73 # starting point can be any number
while n != 1: # '!=' means not equal
	print(n)
	if n % 2 == 1: # if odd number
    	n = 3*n + 1
    else:
    	n = n/2
```

Another example we covered was the fibonacci sequence (each number is the sum of the previous 2. 1, 1, 2, 3, 5, 8, 13, 21, 34 ...

```python
a = 1
b = 1
while a + b < 100000: # arbitrary stopping point to prevent infinite loop
	c = a + b
    print(c)
    a = b
    b = c
```

Be sure to try to understand each of these examples. Specifically what python is doing line by line. There is no magic going on, just a few simple rules.

We will discuss more loop examples next class. To be prepared you should definitely pratice writing code on your own.

## Practice

* Understand all these example, line by line
* Ask the user to input two ages of two people. Print out whether they can date based on the rule that neither person can be more than twice the age of the other. (Hint: use two input functions)
* Ask the user to input 3 grades. Print out the letter grade their average represents. (Example: 100, 80, 92 -> 'A')
* Use a while loop to print the sum of every number between 1 and 1000 inclusive. Answer is 500,500.
* Given two integer numbers,  i and j, Find every combination of i and j whose product is 542. Try to write it in a way so that the desired product can be changed to any number easily. Answer: (1, 542), (2, 271), (271, 2), (542, 1).
* Given a number N, print out if it is prime or not. Remember a prime number cannot be obtained by multiplying any two integers (besides 1 and itself). Bonus: Have your code work efficiently enough to work for very large numbers like 1000000007. Example: (N = 22 -> 'Not Prime'), (N = 1000000007 => 'Prime!'). Hint: to exit a while loop prematurely (to not print mutltiple times), the python key word 'break' is useful. Google it for more info.