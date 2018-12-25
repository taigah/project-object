/**
 * A simplified lodash merge-like function.
 * It is meant to be used by the project function so it doesn't deal with arrays.
 *
 * @param  {...any} sources Object to merge.
 * @returns {object} The merge result.
 */
function merge (...sources) {
  if (sources.length === 0) return {}
  if (sources.length === 1) return sources[0]
  const output = {}
  for (let source of sources) {
    for (let key of Object.keys(source)) {
      if (output[key] === undefined) {
        output[key] = source[key]
        continue
      } else if (output[key].constructor !== Object || source[key].constructor !== Object) {
        output[key] = source[key]
        continue
      } else {
        output[key] = merge(output[key], source[key])
      }
    }
  }
  return output
}

module.exports = merge
