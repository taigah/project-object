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

  describe('when providing a spec with non-0 and non-1 values', () => {
    it('should throw an error', () => {
      assert.throw(() => {
        project({ a: 1 }, { a: 'foo' })
      }, 'Your projection spec should only contain ones and zeros')
    })
  })
})
