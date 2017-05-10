# LZW Algorithm - Notes
Let's put this into a separate repository and publish it on npm!

You're mere hours away from being an open source software developer.

## Thoughts
* It might do good to look up the concept of _dependency injection_
* How can we generalize the current implementation? How can we make it encode an arbitrary alphabet, instead of just `[A-Z]`?
* What parts of the algorithm deserve their own functionality? We talk about having "classes" (misnomer since `js` doens't have classes yet) that do one thing well. What are areas of the code that could be pieced out into their own object.


## As I Started

## Notes
### Encoding and Decoding
The `encoder` and `decoder` are separate entities, 
but they have to agree to the same rules (dictionary). 
Just a random note.

### Flexible Dictionary
One strong point of LZW is its adaptive dictionary. 

Let the user initialize with an alphabet, but by default, let's have that alphabet include all of the ASCII characters.

### Decoding
I'm into it. Let's decode strings too!

### Dictionary Object
We'll talk about this in person.