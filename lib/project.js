const merge = require('./merge')

/**
 * A simple MongoDB $project-like function.
 * When multiple projection specs are provided, they are merged from right to left: `project(obj, {a: 1, b: 1}, {a: 0})` is the same as `project(obj, {a: 0, b: 1})`. It may be used to have a default projection spec.
 * @param {object|array} obj The object or object array to project
 * @param {...object} projectionSpecs A projection spec.
 *
 * @example
 * project({ a: 'a', b: 'b' }, { a: 1 }) === { a: 'a' }
 */
function project (obj, ...projectionSpecs) {
  if (Array.isArray(obj)) {
    return obj.map(el => project(el, ...projectionSpecs))
  }
  if (projectionSpecs.length === 0) {
    throw new Error(`You must provide at least one projection spec`)
  }
  if (projectionSpecs.length === 1 && projectionSpecs[0] === 1) {
    return obj
  }
  const projectionSpec = merge(...projectionSpecs)
  const projectedObj = {}
  for (let prop of Object.keys(obj)) {
    if (projectionSpec[prop] !== undefined && projectionSpec[prop] !== 0) {
      if (projectionSpec[prop].constructor !== Object && projectionSpec[prop] !== 1) {
        throw new Error(`Your projection spec should only contain ones and zeros`)
      }
      const value = obj[prop]
      projectedObj[prop] = project(value, projectionSpec[prop])
    }
  }
  return projectedObj
}

module.exports = project
