---
layout: post
title: 'Python Programming for Beginners - Lesson 1’
author:
  display_name: Mark Metzger
  first_name: Mark
  last_name: Metzger
---


## Inroduction

For the first python class, we did the initial installation and setup of the python editor called IDLE. I also gave an introduction to python and how it is useful. Python is simple and relatively easy to learn as the syntax is simple and elegant compared to many languages. Python also has some of the best libraries (code other people wrote which you can use). With little code, you can do matrix operations, statistical analysis, scientific computing, artificial computing, web server development, etc, etc. This makes it an excellent first language and a language any programmer should know.

That being said, programming is difficult for everyone at first. It will take a long time, and won't always be fun when you are first learning. Learning to program isn't that different from learning a new language: you have to be patient and stick with it. And most importantly, you have to use the skill in your own time. You cannot learn it by watching someone else do it. That means you should spend about an hour a week practicing what was tought in class. You can find practice problems and example here. There are many sources of practice all over the internet.

* [Coding Bat](http://codingbat.com/python) - Simple programming problems; Great way for beginners to practice coding.
* [YouTube Videos](https://www.youtube.com/results?search_query=Python+tutorial) - There are basically an unlimited number of Python tutorials on Youtube!
* [Project Euler](https://projecteuler.net/archives) - If you are up to a challenge
* [codecademy](https://www.codecademy.com/) - A fun online way to learn to code for someone with no experience

## Python covered in class

The first thing we discussed were variables. A variable is how data is stored. You can choose the name of a variable to be whatever you want, but it cannot start with a number. You can store a variety of types of data but most importantly, you can store numbers and text (called strings).

```python
# This is a comment; You can read it but the text will not be executed
# To add a comment, simply start the line with a hashtag
# copy and paste any code to test it out and play with it

integer = 123
decimal = 3.1415
string = "hello world"
```

You can print out the value strored in a variable by using the print function. For example: 

```python
a = 123
b = 3.1415
c = "hello world"

print(a)
print(b)
print(c)
```

You can easily perform arithmetic with python

```python
a = 5
b = 3

result1 = a + b # addition
print(result1) # prints 8

result2 = a - b # subtraction
print(result2) # prints 2

result3 = a * b # multiplication
print(result3) # prints 15

result4 = a / b # division
print(result4) # prints 1.666666666

result5 = a ** b # exponentiation
print(result5) # prints 125

result6 = a % b # modulus (Find the remainder after division)
print(result6) # prints 2
```

Sometimes numbers are represented as text and sometimes text is represented as a number. You can convert between the two using the int() and str() functions.


```python
string1 = 'Hello '
string2 = 'World'

print(string1 + string2) #prints Hello World - strings were concatenated

string3 = 'Value: '
age = 21

print(string3 + str(age)) #prints "Value: 21"; You can't concatenate a number and text without first converting the number to text with the str() function

a = '13'
b = '26'

print(a + b) #concatenates the strings - prints "1326"
print(int(a) + int(b)) #adds the integers - prints "39"
```

At the end of class, we talk about an important concept in programming: if statements. An if statement is only executed if something is true.

```python
x = 13
y = 12

if x > y:
	print('x is greater than y')
if x < y:
	print('x is less than y')
if x == y:
	print('x equals y')
    
#Notice that each print statement has a tab. Also notice that each if statemnts has a colon after it. This is python syntax.
```


## Practice

* Get practice writing variables and doing arithmetic in python
* Practice converting integers into strings and strings into integers
* Declare a variable called x. If x is even, print x divided by 2. If x is odd, print 3x + 1. Hint: the modulus operator can help determine if a number is even.
* Declare four variables m, b, x, y as arbitrary integers. m and b define the line y = mx + b. x and y define a point on a plane. If the point is above the line, print "above". If the point is below the line, print "below". if the point is on the line, print "on".
* Play around with the input function (not discussed in class). It will take some text as input and will output whatever you type in. Try it out!