# Adaptive Programming for TypeScript

## Why adaptive programming?
Adaptive programming allows you create a dependency graph between 'cells' of data. In this graph cells can depend on another cell for their value. If you update a cell, all of its dependend cells will be marked out of data and recalculate their value when needed. This means that adaptive programming:
* Uses lazy computation
* Still allowes mutable data
* Keeps it all in sync by pushing notifications down the tree

With the combinations of those features adaptive programming brings you the best of manny worlds:
* The easyness of 'just update things' from imperative programming!
* The efficiency of lazzy computions!
* The 'never being out-of-sync' from immutable datastructures!

## When use adaptive programming?

Adaptive programming is very useful to make 'views' of large datasets that only will get recreated when their source data updates. This can be very usefull in a SPA if you have a massive list of data and a page that shows a filtered or enriched version of it. With an adaptive container around the calculated version instead of creating it on render will save a lot of resource when the state of something else updates and `render()` gets called. The `AAray` will also be more efficient when just one item changes in the source as it will only recalculate the value of that single item and not the entire collection.

## How to solve problems with adaptive programming?

## TODO

- Dispose for cleaning up dependents
- Reduce implementation