const merge = require('./merge')

/**
 * A simple MongoDB $project-like function.
 * When multiple projection specs are provided, they are merged from right to left: `project(obj, {a: 1, b: 1}, {a: 0})` is the same as `project(obj, {a: 0, b: 1})`. It may be used to have a default projection spec.
 * Unlike MongoDB $project you can rename properties specifying a string instead of one-value
 * @param {object|array} source The object or object array to project
 * @param {...object} specs A projection spec.
 *
 * @example
 * project({ a: 'a', b: 'b' }, { a: 1 })                           // { a: 'a' }
 * project({ a: 'a' }, { a: 'foo' })                               // { foo: 'a' }
 * project({ a: { b: 'b', c: 'c' } }, { a: ['foo', { b: 1 } ]})    // { foo: { b: 1 } }
 */
function project (source, ...specs) {
  if (Array.isArray(source)) {
    return source.map(el => project(el, ...specs))
  }
  if (specs.length === 0) {
    throw new Error(`You must provide at least one projection spec`)
  }
  if (specs.length === 1 && specs[0] === 1) {
    return source
  }
  const spec = merge(...specs)
  const projected = {}
  for (let prop of Object.keys(source)) {
    if (spec[prop] === undefined || spec[prop] === 0) { // Ignore this property
      // console.log(prop, 'ignored')
      continue
    }
    if (Array.isArray(spec[prop])) {
      if (typeof spec[prop][0] !== 'string' || spec[prop].length > 2) {
        throw new Error(`Arrays in your projection should only contain one string and one projection spec`)
      }
      projected[spec[prop][0]] = project(source[prop], spec[prop][1])
      continue
    }
    if (spec[prop].constructor === Object || spec[prop] === 1) {
      // console.log(prop, 'projected')
      projected[prop] = project(source[prop], spec[prop])
      continue
    }
    if (typeof spec[prop] === 'string') {
      // console.log(prop, 'renamed')
      projected[spec[prop]] = source[prop]
      continue
    }
    throw new Error(`Your projection spec should only contain ones, zeros, strings and arrays`)
  }
  return projected
}

module.exports = project
