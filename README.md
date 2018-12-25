# project-object

A simple, light-weight MongoDB $project-like function allowing you to filter your objects properties with ease.

## Installation

```bash
yarn add project-object
```

## Basic usage

```javascript
const project = require('project-object')

const thread = {
  title: 'Some title',
  ip: '0.0.0.0',
  messages: [{
    content: 'foo',
    ip: '0.0.0.0'
  }, {
    content: 'bar',
    ip: '0.0.0.0'
  }]
}
project(thread, {
  title: 1,
  messages: {
    content: 1
  }
})
/*
=>
{
  title: 'Some title',
  messages: [{
    content: 'foo'
  }, {
    content: 'bar'
  }]
}
*/
```

## Examples

With an array instead of an object

```javascript
const users = [{
  username: 'foo',
  password: 'some hash'
}, {
  username: 'bar',
  password: 'some other hash'
}]

project(users, { username: 1 })
/*
=>
[{
  username: 'foo'
}, {
  username: 'bar'
}]
*/
```

Using multiple specs

```javascript
const userProjectionSpec = {
  username: 1
}

function projectUser (userObj, overrideProjectionSpec = {}) {
  return project(userObj, userProjectionSpec, overrideProjectionSpec)
}

const user = {
  username: 'foo',
  email: 'foo@bar.fr',
  password: 'some hash'
}

projectUser(user)
/*
=>
{
  username: 'foo',
  email: 'foo@bar.fr'
}
*/

projectUser(user, { email: 0, password: 1 })
/*
=>
{
  username: 'foo',
  password: 'some hash'
}
*/
```