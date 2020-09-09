const { assert } = require('chai')
const project = require('../lib/project')

describe('Project', () => {
  describe('when not specifying the project spec', () => {
    it('should throw an error', () => {
      assert.throw(() => {
        project({})
      }, 'You must provide at least one projection spec')
    })
  })

  describe('when specifying a deep project spec', () => {
    it('should project successfuly', () => {
      assert.deepStrictEqual(project({
        a: {
          b: {
            c: 'c',
            d: 'd'
          }
        }
      }, {
        a: {
          b: {
            c: 1
          }
        }
      }), {
        a: {
          b: {
            c: 'c'
          }
        }
      })
    })
  })

  describe('when providing a spec with strings', () => {
    it('should rename the property', () => {
      assert.deepStrictEqual(project({
        a: {
          b: 'b'
        }
      }, {
        a: {
          b: 'foo'
        }
      }), {
        a: {
          foo: 'b'
        }
      })
    })
  })

  describe('when providing a spec with array containing only one string and one spec', () => {
    it('should rename the property and properly project his value', () => {
      assert.deepStrictEqual(project({
        a: {
          b: {
            c: 'c',
            d: 'd'
          }
        }
      }, {
        a: {
          b: ['foo', {
            c: 1
          }]
        }
      }), {
        a: {
          foo: {
            c: 'c'
          }
        }
      })
    })
  })

  describe('when not specyfing to keep a property', () => {
    it('should not keep it', () => {
      assert.notProperty(project({ a: 1 }, {}), 'a')
    })
  })

  describe('when working with arrays', () => {
    it('should project each array element', () => {
      assert.deepStrictEqual(project({
        messages: [{
          publicField: 'hello',
          privateField: 'world'
        }, {
          publicField: 'foo',
          privateField: 'bar'
        }]
      }, { messages: { publicField: 1 } }), {
        messages: [{
          publicField: 'hello'
        }, {
          publicField: 'foo'
        }]
      })
    })
  })

  describe('when providing multiple projection specs', () => {
    it('should merge them without mutating the spec objects', () => {
      const spec1 = {
        a: 1,
        b: 1
      }
      const spec1copy = Object.assign({}, spec1)
      const spec2 = {
        b: 0,
        c: 1
      }
      const spec2copy = Object.assign({}, spec2)
      assert.deepStrictEqual(project({
        a: 'a',
        b: 'b',
        c: 'c'
      }, spec1, spec2), {
        a: 'a',
        c: 'c'
      })
      // check for mutations
      assert.deepStrictEqual(spec1, spec1copy)
      assert.deepStrictEqual(spec2, spec2copy)
    })
  })

  describe('when providing an array', () => {
    it('should treat it properly', () => {
      assert.deepStrictEqual(project([{
        a: 'a',
        b: 'b'
      }, {
        a: 'c',
        b: 'd'
      }], { a: 1 }), [{
        a: 'a'
      }, {
        a: 'c'
      }])
    })
  })

  describe('when providing a spec with non-0, non-1, non-string and non-array value', () => {
    it('should throw an error', () => {
      assert.throw(() => {
        project({ a: 1 }, { a: false })
      }, 'Your projection spec should only contain ones, zeros, strings and arrays')
    })
  })

  describe('when providing a spec with invalid array', () => {
    it('should throw an error', () => {
      assert.throw(() => {
        project({ a: 1, b: { c: 1 } }, { a: [{ b: 1 }, { b: 1 }] })
      }, 'Arrays in your projection should only contain one string and one projection spec')
    })
  })
})
