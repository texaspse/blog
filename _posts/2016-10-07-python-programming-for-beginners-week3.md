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

## Goal of Week 3

This week, we:

+ Spent the majority of the lecture discussing while loops and how to apply them.
+ Briefly discussed for loops and how they are very similar to while loops
+ Discussing lists and to access and manipulate data within them

## How to be prepared for Week 4

As always, if you don't practice writing code in your own time, you won't be successful. Coding is something you have to learn by doing. I highly encourage you to go to [CodingBat](http://codingbat.com/python) and do as many problems as you can. We haven't talked about strings yet, but you can still get ahead by trying them (strings are just lists of characters). Also if you can't figure out a problem, you can always google the answer (I won't judge). Please practice!

## Materials Covered

Make sure you understood what we did in class with regards to while loops. Remember that a while will repeatedly execute the code within it until the condition becomes false (its an infinite loop if its always true).

```python
#Understand what this code prints out and why

c = 1
while c < 10:
    print(c)
    c += 3


n = 3
y = 2
while (n < 12):
    print(y, n)
    if (y < 5):
        y = y * 2
    if (n > 1):
        y += 1
        n += 4
print(y, n)


a = 1
b = 1
while b < 100:
    next_number = a + b
    print(next_number)
    a = b
    b = next_number
```

Be sure to understand the basics of lists. Most importantly: get number of items in a list, access an item in a list, get a sublist from a list, add an item to a list with the list.append(item) function. Understand how this code works line by line.

```python
my_list = [345, 789, 345, 345, 2]
length = len(my_list)
print(length)

my_list.append('hello world')
print(my_list)
print(my_list[5])
print(my_list[1:3])
print(my_list[0:-1])
```

Finally, understand for loops and how to write a while loop that is equivalent to a given for loop. Understand how to use the range() function in a for loop.

```python
# Both loops are equivalent

a = 2 #first value
b = 15 #last value
c = 3 #increment

counter = a
while (counter < b):
    print(counter)
    counter += c

for counter in range(a, b, c):
    print(counter)
```

## Additional Material

+ [This YouTube Video]( https://www.youtube.com/watch?v=N4mEzFDjqtA) covers moth of Python in 45 minutes. But don’t be surprised if you don’t understand a lot of it.
+ [This YouTube Video]( ttps://www.youtube.com/watch?v=pTV6bILLP_s) cover python at a much more appropriate pace.
+ Try [codeacedemy] (https://www.codecademy.com/learn/all)
