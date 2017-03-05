---
layout: post
title: 'Python Programming for Beginners - Lesson 4’
author:
  display_name: Mark Metzger
  first_name: Mark
  last_name: Metzger
---

## Review

We started class by reviewing the things we covered previously. First we mentioned the five type of data that can be stored in a variable

```python
a = 24 # Integer
b = 3.14159265 # Float (number with decimal)
c = 'Hello world' #String (text)
d = False # Boolean (True or False)
e = [1, 3, 5, True, 'aaa'] # List (collection of data)
```

We also talked about the functions you can use in python

```python
a = 24 # Integer
b = '24.8'
c = 24.8
L = [a, b, c]
print(a, b, c) #prints things to the screen
str(a) # returns '24', converts some data into text
int(c) # returns 24, rounds down a number or converts text into a integer
float(b) # returns 24.8, converts a string into a floating point number
len(L) # returns 3 whiich is the length of the list

# if you are curious, see a complete list at https://docs.python.org/3/library/functions.html
```

We talked about if statements and operators you can use within them

```python
# not and or > < ==, the six important operators you should know
print(not True) # prints False
print(5 > 3 and 3 > 2) # prints True
print(0 == 1 or 100+50 < 125 or 5 > 2) # prints True

age = 75
if (age > 50):
	print('you are old') # prints 'you are old'
    if age > 80:
    	print('you are very old') # does not print anything
```

We talked about while loops which repeat some code over and over again until some condition stops being met

```python
cubedNumber = 1
x = 1
while cubedNumber < 10000:
	cubedNumber = x**3 # '**' operator raises to the power
    print(x, cubedNumber)
    x = x + 1
```

And that is basically what we learned up to this point! With this information you can basically do anything with code. Most of what we will learn from now on will be to make your code simpler and better organized.

## List Functions

We talked in the last class about how to make a list and access items within a list. Those are the most important things. However, what if you want remove an item from a list or sort a list? You can write the code to do those things, but it is much easier to simply use a built in list funtion. 

```python
# see more list functions here: https://docs.python.org/3/tutorial/datastructures.html

L = [1,2,3]
L.append(4) #adds 4 to the end of the list
print(L) # L = [1,2,3,4]
L.remove(2) # removes the first 2 that it finds
print(L) # L = [1,3,4]
L.insert(1, 10) # inserts the number 10 and index 1
print(L) # L = [1,10,3,4]
L.pop(0) # #removes the item at index 0
print(L) # L = [10,3,4]
L.sort() # sorts the list in ascending order
print(L) # L = [3,4,10]
L.clear() # removes every item from the list
print(L) # L = []
```

## For loops

We have talked about while loops. You may have noticed that many of the examples that we have covered use a counter variable and increment the counter every time we go through the code. For example:

```python
counter = 0
while counter < 10:
    print(counter)
    counter += 1
```

We can actually reduce the amount of code by using a for loop. Its important to note that all for loops can be replaced with an equivalent while loops but sometimes you can't replace a for loop with a while loop. Anyway, Here is some code that replaces the above while loop.

```python
for counter in range(10):
	print(counter)
```
We have encountered a new function called range() which is almost always used with a for loop. It tells the for loops what numbers to iterate through (in that case 0-9). It actually takes in three numbers but it will still work if you just input 1 or 2. If you input 1 number, it iterates from 0 to that number minus 1. If you input 2 numbers, it will iterate from the first number to the second number minus 1. If you input 3 numbers, it will do the same as the two number case, except it will increment by the third number.

Here is an example showing how a for loop with the range() function can be translated into while loop code.

```python
a = 3 
b = 20
c = 2

counter = a
while counter < b:
    print(counter)
    counter += c
    
# is equivalent to...

for counter in range(a, b, c):
	print(counter)
      
# both print out 3, 5, 7, 9, 11, 13, 15, 17, 19
```

For loops can also be used to iterate over lists without even using the the range() function making your code even cleaner.

```python
L = [1, 2, 3]

counter = 0
while counter < len(L):
	item = L[counter]
    print(item)
    counter += 1
    
# is equivalent to ...

for counter in range(len(L)):
	item = L[counter]
    print(item)
    
# is equivalent to ...

for item in L:
	print(item)
```

As you can see, the third loop is very clean! However, for some problems, you will need iterate over the list in the 1st or 2nd way. So, if you choose to always use a while loop, you will be fine, your code will just be a bit longer sometimes.

## Examples

We covered many examples in class. I recommend you practice these before you look at the solutions. And make sure you understand what the code is doing.


What is the smallest value in the list L = [6,4,9,212,72,4].

```python
L = [6,4,9,212,72,4]

currentMin = L[0]
for i in range(1, len(L)):
	if L[i] < currentMin:
    	currentMin = L[i]
print(currentMin)
```

Print out a new list that if formed by concatenating two other lists a = [1,2,3] and b = [4,5,6]

```python
a = [1,2,3]
b = [4,5,6]

c = [] #initial make c an empty list

# We will use the most simplified version of the for loop
for item in a:
	c.append(item) # put the 3 items in a and puts them in c
for item in b:
	c.append(item) # put the 3 items in b and puts them in c
print(c) # prints "[1,2,3,4,5,6]"
```

Print out how many even numbers are in the list L = [3,9,8,4,1,2]

```python
L = [3,9,8,4,1,2]

count = 0
for num in L:
	if num % 2 == 0: # if even
    	count += 1
print(count) # prints 3
```

Print out a new list with all the even numbers removed from L = [3,9,8,4,1,2]

```python
L = [3,9,8,4,1,2]

odds = []
for num in L:
	if num % 2 == 1: # if odd
    	odds.append(num)
print(odds) # prints [3, 9, 1]
```

Print out how many times two numbers appear next to each other in the list L = [2,3,2,2,5,65,98,34,21,2,3,2,2,1,2]

```python
L = [2,3,2,2,5,65,98,34,21,2,3,2,2,1,2]

count = 0
for i in range(1, len(L)): 
# if items at the current index and the previous index are equal
	if L[i-1] == L[i]: 
    	count += 1
print(count) # prints 2
# notice that the loop starts at 1 so i-1 is always greater than 0
```

Given two lists a = [1,2,4,3] and b = [5,2,3,1], count how many times an item in a appears in b as well.

```python
a = [1,2,4,3]
b = [5,2,3,1]

count = 0
for itemA in a:
	for itemB in b:
    	if itemA == itemB:
        	count += 1
            break # stops searching for item in b once match is found
print(count)
```

## Practice

* Given a list L = [2,5,7,4.6] print out a new list with every item increased by one. Answer: "[3,6,8,5.6]". Hint: make a new list and append numbers to it.
* Given the list [5,9,1,33], calculate the lowest number in it without a for loop with the help of the sort function. Answer: "1".
* Given a list [3,9,4,6,8,1], print out a list with the first even number removed. Answer: [3,9,6,8,1]
* Given a list [3,9,4,6,8,1], print out a list with every item at an odd numbered index removed. Answer: [3,4,8]
