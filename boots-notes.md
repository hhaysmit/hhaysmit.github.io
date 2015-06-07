# Overview
:tada: Nice work!


If you want to see my solutions, you can find them at the [internship repo](https://github.com/brettimus/switchboard-internship-2015/tree/master/eloquent-js/exercises).

Here are some broad things:

* Even though they are usually optional, remember to end statements with a semi-colon
* Prefer `===` to `==` and `!==` to `!=`
* Declare all of your variables at the top of their scope. This reflects the way that JS is interpreted. (See: hoisting)
* Be sure to write tests!
* reduce accepts a second parameter - the starting value. See it on [mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce).

## Chapter 2
### triangleLoop
You accidentally declared a global variable in the first line-- remember to put var in front of all your definitions!

### fizzBuzz
There is a very esteemed software person who claims FizzBuzz should be the extend of most programming interviews. So, good job!

### chessBoard
This is nit-picky, but you declared `row` inside a `for` loop. `for`, `if`, and `while` loops don't have block-level scope, so I like to reflect that by declaring `var`s outside of them.

## Chapter 3
### countBs
I think this is missing a return statement? Otherwise, good use of `.charAt`! I have forgotten _multiple time_ that we need to call that instead of using array-like indexing.
### all others
:thumbsup:

## Chapter 4
### range
In lieu of checking the length of the arguments vector, you could assign a default for the `step` parameter. E.g.,
```javascript
  step = step || 1;
```

### simpleSum
`reduce` accepts a parameter after the function that lets you pass in a starting value for the reduction. Otherwise, that paramter is assumed to be 0.

So, we could really remove the declaration of `a` from the beginning and be fine. In fact, `a` is not even being used in the function as it stands. The function-level scope of `function(a,x) {...}` beats out the initial declaration of `a`.

## Chapter 5
### some, every
You could also use `break` statements to get out of the loop, but your way is still :star2:.
### flatten
Obviously you were supposed to use `concat`, but just know it's pretty slow.

Also, as I wrote above (and put in the overview), `.reduce` accepts a second parameter, which is the starting value for the `reduction`. Here, you could pass in an empty array literal `[]`.


## Chapter 6
### get
This has a typo! (`Math.sqr`)

Please write tests in the future!