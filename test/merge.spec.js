const { assert } = require('chai')
const merge = require('../lib/merge')

describe('Merge', () => {
  describe('when passing 0 parameter', () => {
    it('should return an empty object', () => {
      assert.deepStrictEqual(merge(), {})
    })
  })

  describe('when passing 1 parameter', () => {
    it('should return the given object', () => {
      const obj = {}
      assert.strictEqual(merge(obj), obj)
    })
  })

  describe('when passing more than one parameter', () => {
    const obj1 = {
      a: 1,
      b: 1
    }
    const obj2 = {
      a: 0,
      c: 1
    }
    it('should merge them correctly', () => {
      assert.deepStrictEqual(merge(obj1, obj2), { a: 0, b: 1, c: 1 })
    })

    it('should not mutate any parameter', () => {
      const obj1copy = Object.assign({}, obj1)
      const obj2copy = Object.assign({}, obj2)
      merge(obj1, obj2)
      assert.deepStrictEqual(obj1, obj1copy)
      assert.deepStrictEqual(obj2, obj2copy)
    })

    it('should work when overriding a number by an object', () => {
      assert.deepStrictEqual(merge({
        a: {
          b: 1
        }
      }, {
        a: 1
      }), { a: 1 })
    })

    it('should work when overriding an object by a number', () => {
      assert.deepStrictEqual(merge({
        a: 1
      }, {
        a: {
          b: 1
        }
      }), { a: { b: 1 } })
    })

    it('should deep merge properly', () => {
      assert.deepStrictEqual(merge({
        a: 1,
        b: {
          c: 1,
          d: {
            e: 1
          },
          f: {
            g: 1
          }
        }
      }, {
        b: {
          c: 0,
          d: 0,
          f: {
            h: 1
          },
          i: 1
        }
      }), {
        a: 1,
        b: {
          c: 0,
          d: 0,
          f: {
            g: 1,
            h: 1
          },
          i: 1
        }
      })
    })
  })
})
