<!-- 

### 1) Difference between **var, let, and const**

* **var** → Function-scoped, can be re-declared and updated.
* **let** → Block-scoped, can be updated but NOT re-declared in same scope.
* **const** → Block-scoped, CANNOT be updated or re-declared.

---

### 2) Difference between **map(), forEach(), and filter()**

* **map()** → Creates a **new array** by modifying each element.
* **forEach()** → Loops through array but **does not return** a new array.
* **filter()** → Creates a **new array** with elements that match a condition.

---

### 3) What are arrow functions in ES6?

Arrow functions are a **shorter way to write functions** using `=>`.

Example:

```js
const add = (a, b) => a + b;
```

They also do not have their own `this`.

---

### 4) How does destructuring assignment work in ES6?

Destructuring allows you to **extract values from arrays or objects** into variables.

Example:

```js
const person = { name: "John", age: 25 };
const { name, age } = person;
```

---

### 5) What are template literals in ES6?

Template literals use **backticks (` `)** and allow variables inside strings using `${}`.

Example:

```js
let name = "John";
console.log(`Hello ${name}`);
```

Difference:

* Template literals are cleaner and support **multi-line strings**.
* String concatenation uses `+` to join strings.

 -->