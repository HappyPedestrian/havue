import { describe, test, expect } from 'vitest'
import { stringSortFn, getPinyinInitial, subStrByByteLen } from '@havue/tools'

describe('tools: string', () => {
  test('stringSortFn', () => {
    const arr = ['！2abc', '3abc', '菜菜菜菜111', 'aabc', '1abc', '阿abc', 'babc']
    const targetSort = ['1abc', '3abc', 'aabc', '阿abc', 'babc', '菜菜菜菜111', '！2abc']
    expect(arr.sort(stringSortFn)).toEqual(targetSort)
  })

  test('getPinyinInitial', () => {
    expect(getPinyinInitial('啊')).toBe('A')
    expect(getPinyinInitial('吧')).toBe('B')
    expect(getPinyinInitial('从')).toBe('C')
    expect(getPinyinInitial('的')).toBe('D')
    expect(getPinyinInitial('额')).toBe('E')
    expect(getPinyinInitial('发')).toBe('F')
    expect(getPinyinInitial('给')).toBe('G')
    expect(getPinyinInitial('和')).toBe('H')
    expect(getPinyinInitial('就')).toBe('J')
    expect(getPinyinInitial('看')).toBe('K')
    expect(getPinyinInitial('了')).toBe('L')
    expect(getPinyinInitial('吗')).toBe('M')
    expect(getPinyinInitial('你')).toBe('N')
    expect(getPinyinInitial('哦')).toBe('O')
    expect(getPinyinInitial('怕')).toBe('P')
    expect(getPinyinInitial('去')).toBe('Q')
    expect(getPinyinInitial('人')).toBe('R')
    expect(getPinyinInitial('是')).toBe('S')
    expect(getPinyinInitial('他')).toBe('T')
    expect(getPinyinInitial('我')).toBe('W')
    expect(getPinyinInitial('下')).toBe('X')
    expect(getPinyinInitial('有')).toBe('Y')
    expect(getPinyinInitial('在')).toBe('Z')
    expect(getPinyinInitial('')).toBe('')
    expect(getPinyinInitial('abc按不出！')).toBe('abc按不出！')
  })

  test('subStrByByteLen', () => {
    expect(subStrByByteLen('', 0)).toBe('')
    expect(subStrByByteLen('', 1)).toBe('')

    expect(subStrByByteLen('!啊bcd额', 0)).toBe('')
    expect(subStrByByteLen('!啊bcd额', 1)).toBe('!')
    expect(subStrByByteLen('!啊bcd额', 2)).toBe('!')
    expect(subStrByByteLen('!啊bcd额', 3)).toBe('!啊')
    expect(subStrByByteLen('!啊bcd额', 4)).toBe('!啊b')
    expect(subStrByByteLen('!啊bcd额', 5)).toBe('!啊bc')
    expect(subStrByByteLen('!啊bcd额', 6)).toBe('!啊bcd')
    expect(subStrByByteLen('!啊bcd额', 7)).toBe('!啊bcd')
    expect(subStrByByteLen('!啊bcd额', 8)).toBe('!啊bcd额')
    expect(subStrByByteLen('!啊bcd额', 9)).toBe('!啊bcd额')
  })
})
