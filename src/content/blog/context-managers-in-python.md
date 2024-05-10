---
title: Context Managers In Python
description: Context Manager in Python is very useful feature for clean coding
pubDatetime: 2024-05-09T09:41:58+05:30
postSlug: context-managers-in-python
featured: false
draft: false
tags:
  - python
---

![tp.web.random_picture](https://images.unsplash.com/photo-1649180556628-9ba704115795?q=80&w=2062&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218MHx8dHJlZSxsYW5kc2NhcGUsd2F0ZXJ8fHx8fHwxNzE1MjI3OTE5&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=900)

## Table of Content

## TL;DR

Context managers in Python, often used with the `with` keyword, automate setup and tear-down tasks. Custom context managers can be created by defining `__enter__()` and `__exit__()` methods. For example, a custom context manager can measure execution time, enhancing code readability and maintenance.

**File handling** built-in function `open()` can be used

```python
with open("hello.txt", mode="w") as file:
    file.write("Hello, World!")
```

**Custom Context Manager**

```python
import time

class BlockTimer:
    def __init__(self):
        self.started_at = None
        self.stopped_at = None
        self.total_time = None
    def __enter__(self):
        self.started_at = time.time()
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.stopped_at = time.time()
        self.total_time = self.stopped_at - self.started_at
        print(f"Total time: {self.total_time}")

def add(x, y):
    time.sleep(1) # To mock a time consuming operation
    z = x + y
    print(z)

with BlockTimer() as block_timer:
    add(7, 5)

```

## Introduction

Managing resources in any programming language is a very common operation. The resources are limited. So, the main problem is to ensure we release the resources after usage when it's dispensable. If it is not done correctly, there might be issues like memory leakage.

It would be handy if the users (developers) had the mechanism to automatically set up and tear down the resources.

For example, we want to open the file and write to it. In this case, we need to make sure the file is open before writing to it and once done we need to close the file.
Almost all the languages provide a try-catch-finally block for handling exceptions and managing the resources. Python also provides the ability to handle the exceptions using `try...except`.

```python
file_descriptors = []
for x in range(100000):
    file_descriptors.append(open('test.txt', 'w'))
```

The above code will give an error like the following

```bash
Traceback (most recent call last):
  File "context.py", line 3, in
OSError: [Errno 24] Too many open files: 'test.txt'
```

However, we have Context Manager to handle this scenario in Python, They are used using the `with` keyword.

## What are Context Managers in Python?

Context managers in Python provide a convenient way for managing resources and defining setup and tear-down actions.

Context Manager can be used using the `with` keyword to ensure that certain operations are properly handled, such as file opening and closing, acquiring and releasing locks, and setting up and tearing down database connections.

The `with` statement in Python is used to wrap the execution of a block of code within methods defined by a context manager.

### **Basic Syntax**

```python
with context_manager as variable:
	# code block
```

Here, `context_manager` refers to an object that serves as a context manager, and the variable is an optional variable to which the context manager’s result (if any) is assigned.

## Context manager for opening files using built-in open

we can use a built-in `open` function that can be used with the `with` keyword.

```python
with open("hello.txt", mode="w") as file:
    file.write("Hello, World!")
```

In this case, since the context manager closes the file after leaving the `with` code block, a common mistake might be the following:

```python
>>> file = open("hello.txt", mode="w")

>>> with file:
...     file.write("Hello, World!")
...
13

>>> with file:
...     file.write("Welcome to Real Python!")
...
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ValueError: I/O operation on closed file.
```

## Custom Context Manager

To write a custom context manager, define a class with `__enter__()` and `__exit__()` methods.

`__enter__()`: sets up the resources or an environment

`__exit__()`: cleans up after a code block is executed.

For instance, let’s write a context manager that measures the execution time of a block of code that is wrapped inside of it.

```python
import time

class BlockTimer:
    def __init__(self):
        self.started_at = None
        self.stopped_at = None
        self.total_time = None
    def __enter__(self):
        self.started_at = time.time()
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.stopped_at = time.time()
        self.total_time = self.stopped_at - self.started_at
        print(f"Total time: {self.total_time}")
```

Once the `BlockTimer` initializes it will create three variables with None values as initial values.

As soon as it's used with the `with` keyword it will execute the `__enter__()` function to set the value of `started_at`

at the end of the code block while leaving the context of the BlockTimer block marked using `with`, it will call the `__exit__()` function. This will set `stopped_at` and `total_time`.

Let’s say we define a function add() as follows:

```python
def add(x, y):
    time.sleep(1) # To mock a time consuming operation
    z = x + y
    print(z)
```

Here’s how we will use our custom context manager to measure the execution time:

```python
with BlockTimer() as block_timer:
    add(21, 6)
```

This gives an output:

```bash
27
Total time: 1.0050549507141113
```

## Conclusion

Context managers in Python are objects that manage the allocation and release of resources within a specific code block. They are used with the `with` statement, **ensuring the proper cleanup of resources even if the exception occurs**. Using context manager in Python can be very helpful in managing resources while executing the application. Also, as the application grows it will come very handy in handling the errors and the flow of execution in the application.
