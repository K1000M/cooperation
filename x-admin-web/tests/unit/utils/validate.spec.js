import { validUsername, isExternal } from '@/utils/validate.js'

describe('Utils:validate', () => {
  it('validUsername', () => {
    expect(validUsername('admin')).toBe(true)
    expect(validUsername('editor')).toBe(true)
    expect(validUsername('xxxx')).toBe(false)
  })
  it('isExternal', () => {
    expect(isExternal('https://picture.gptkong.com/20240808/1444354e05a87e4fffb1b2408b8b4017a1.png')).toBe(true)
    expect(isExternal('http://picture.gptkong.com/20240808/1444354e05a87e4fffb1b2408b8b4017a1.png')).toBe(true)
    expect(isExternal('picture.gptkong.com/20240808/1444354e05a87e4fffb1b2408b8b4017a1.png')).toBe(false)
    expect(isExternal('/dashboard')).toBe(false)
    expect(isExternal('./dashboard')).toBe(false)
    expect(isExternal('dashboard')).toBe(false)
  })
})
