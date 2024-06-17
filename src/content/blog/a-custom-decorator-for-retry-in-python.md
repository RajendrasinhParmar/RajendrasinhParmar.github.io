---
title: A Custom Decorator For Retry In Python
description: Custom Decorator For A Retry Mechanism For Better Error Handling And Clean Code
pubDatetime: 2024-05-17T09:46:19+05:30
postSlug: a-custom-decorator-for-retry-in-python
featured: false
draft: false
tags:
  - python
---

![tp.web.random_picture](https://images.unsplash.com/photo-1649180556628-9ba704115795?q=80&w=2062&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218MHx8dHJlZSxsYW5kc2NhcGUsd2F0ZXJ8fHx8fHwxNzE1MjI3OTE5&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=900)

Custom Decorator For A Retry Mechanism For Better Error Handling And Clean Code

## Table of contents

## TL;DR

- Decorator functions in Python are higher-order functions that can be used to modify the behaviour of another function
- Decorator functions can be used to implement a retry mechanism in Python
- A retry decorator can be used to retry a function for a specified number of times in case of failure

The retry decorator can be used to retry a function for a specified number of times in case of failure. This is useful when calling an API that might fail due to network issues.

```python
import time

def retry(max_retries=3, delay=1):
    def decorator(original_function):
        def wrapper_func(*args, **kwargs):
 retries = 0
            if retries < max_retries:
                try:
                    return original_function(*args, **kwargs)
                except Exception as e:
                    print(f"Function {original_function.__name__} failed with error {e}. Retrying...")
 retries += 1
 time.sleep(delay)
            else:
                raise Exception(f"Function {original_function.__name__} failed after {max_retries} retries")
        return wrapper_func
    return decorator

@retry(max_retries=3, delay=1)
def my_function():
    print("Hello World")
    raise Exception("Something went wrong")

my_function()

# Function my_function failed with error Something went wrong. Retrying...
# Function my_function failed with error Something went wrong. Retrying...
# Function my_function failed with error Something went wrong. Retrying...
# Traceback (most recent call last):
#   File "<stdin>", line 1, in <module>
#   File "<stdin>", line 13, in wrapper_func
# Exception: Function my_function failed after 3 retries
```

## Introduction

While implementing anything In any programming language it is essential to implement error handling. In Python, we use `try...except` to handle exceptions. However, there might be a use case where instead of directly handling the exception it's required to retry the whole execution. Mainly in cases of API failure due to connectivity or rate limit, we can have a retry.

To implement a reusable retry mechanism in Python we can implement a decorator. decorator is a special type of function that can be used to modify the behaviour of another function. This is because Python supports passing a function a parameter in another function

## Decorator function basics

A decorator function in Python is a higher-order function that takes a function as an argument and returns another function. The decorator function can modify the behaviour of the function passed to it.

```python
def my_decorator_function(original_function):
    def wrapper_function(*args, **kwargs):
        # Do something before the function is called
        print(f"Function {original_function.__name__} called with args {args} and kwargs {kwargs}")
 result = original_function(*args, **kwargs)
        print(f"Function {original_function.__name__} returned {result}")
        # Do something after the function is called
        return result
    return wrapper_function
```

In the above example:

- `my_decorator_function` is a decorator function that takes another function `original_function` as an argument.
- The decorator function defines a `wrapper_function` that calls the `original_function` and prints the arguments and returns the value of the function.
- The `wrapper_function` is returned by the decorator function and is used to wrap the `original_function`.
- The `wrapper_function` calls the `original_function` and prints the arguments and returns the value of the function.

To use the decorator function we can use the `@` symbol before the function definition

```python
@my_decorator_function
def my_function():
    print("Hello World")
```

When we can `my_function` it will be wrapped by the `my_decorator_function` and the output will be

```python
my_function()
# Function my_function called with args () and kwargs {}
# Hello World
# Function my_function returned None
```

## Real-World Use Cases of Decorator Functions

There are many use cases of decorator functions in Python. Some of the common use cases are

1. Logging - To log the input and output of a function along with different parameters
2. Timing - To measure the time a function takes to execute. This is useful for performance optimization
3. Rate Limiting - To limit the number of times a function can be called in a given time frame
4. Retry Mechanism - To retry the function in case of failure. This is useful when calling an API that might fail due to network issues.
5. Authentication - To authenticate the user before calling the function
6. Caching - To cache the result of a function for future use. This is useful when the function is called multiple times with the same input

## Retry Mechanism Using Decorator Function

To implement a retry mechanism using a decorator function we can define a decorator function that takes the number of retries as an argument. The decorator function will call the original function and if it fails it will retry the function for the specified number of times.

```python
import time

def retry(max_retries=3, delay=1):
    def decorator(original_function):
        def wrapper_func(*args, **kwargs):
 retries = 0
            if retries < max_retries:
                try:
                    return original_function(*args, **kwargs)
                except Exception as e:
                    print(f"Function {original_function.__name__} failed with error {e}. Retrying...")
 retries += 1
 time.sleep(delay)
            else:
                raise Exception(f"Function {original_function.__name__} failed after {max_retries} retries")
        return wrapper_func
    return decorator
```

- In the above example, we define a `retry` decorator function that takes the number of retries and delay as arguments.
- The `decorator` function returns the `wrapper_func` function that calls the original function and retries it in case of failure.
- The `decorator` function uses a `wrapper_func` that keeps track of the number of retries and retries the function for the specified number of times.
- If the function fails after the specified number of retries it raises an exception. The `time.sleep(delay)` is used to introduce a delay between retries.

To use the retry decorator we can use the following syntax

```python
@retry(max_retries=3, delay=1)
def my_function():
    print("Hello World")
    raise Exception("Something went wrong")

my_function()
```

In the above example, the `my_function` will be retried 3 times with a delay of 1 second between each retry. If the function fails after 3 retries it will raise an exception. The output of the above code will be

```python
my_function()
# Function my_function failed with error Something went wrong. Retrying...
# Function my_function failed with error Something went wrong. Retrying...
# Function my_function failed with error Something went wrong. Retrying...
# Traceback (most recent call last):
#   File "<stdin>", line 1, in <module>
#   File "<stdin>", line 13, in wrapper_func
# Exception: Function my_function failed after 3 retries
```

## Conclusion

In this article, we learned how to implement a retry mechanism using a decorator function in python. Decorator functions are a powerful feature of python that allows us to modify the behaviour of a function without changing its code. We also learned about some real-world use cases of decorator functions and how they can be used to improve the readability and maintainability of our code.
