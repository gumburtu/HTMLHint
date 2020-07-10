const expect = require('expect.js')

/** @type import('../src/core/core').HTMLHint */
const HTMLHint = require('../dist/htmlhint.js').HTMLHint

describe('Core', () => {
  describe('Defaults', () => {
    it('Should use the recommended ruleset, if configuration is not defined', () => {
      const code =
        '<P ATTR=\'1\' id="a">><div id="a"><img src="" a="1" a="2"/></div>'
      const messages = HTMLHint.verify(code)
      expect(messages.length).to.be(9)
    })

    it('Should use the recommended ruleset, if empty configuration is passed', () => {
      const code =
        '<P ATTR=\'1\' id="a">><div id="a"><img src="" a="1" a="2"/></div>'
      const messages = HTMLHint.verify(code, {})
      expect(messages.length).to.be(9)
    })

    it('Should use the legacy ruleset, if it is passed', () => {
      const code =
        '<P ATTR=\'1\' id="a">><div id="a"><img src="" a="1" a="2"/></div>'
      const messages = HTMLHint.verify(code, {
        extends: ['htmlhint:legacy'],
      })
      expect(messages.length).to.be(9)
    })

    it('Should use the recommended ruleset, if it is passed', () => {
      const code =
        '<P ATTR=\'1\' id="a">><div id="a"><img src="" a="1" a="2"/></div>'
      const messages = HTMLHint.verify(code, {
        extends: ['htmlhint:recommended'],
      })
      expect(messages.length).to.be(9)
    })

    it('Should use no ruleset, if extends is not defined and empty ruleset is passed', () => {
      const code =
        '<P ATTR=\'1\' id="a">><div id="a"><img src="" a="1" a="2"/></div>'
      const messages = HTMLHint.verify(code, { rules: {} })
      expect(messages.length).to.be(0)
    })
  })

  describe('Customization', () => {
    it('Set false to rule no effected should result in an error', () => {
      const code = '<img src="test.gif" />'
      const messages = HTMLHint.verify(code, {
        rules: {
          'alt-require': 'off',
        },
      })
      expect(messages.length).to.be(0)
    })

    it('Inline ruleset not worked should result in an error', () => {
      // With value = 'error'
      let code = '<!-- htmlhint alt-require:error -->\r\n<img src="test.gif" />'
      let messages = HTMLHint.verify(code, {
        rules: {
          'alt-require': 'off',
        },
      })

      expect(messages.length).to.be(1)
      expect(messages[0].rule.id).to.be('alt-require')
      expect(messages[0].line).to.be(2)
      expect(messages[0].col).to.be(5)

      // Without value
      code = '<!-- htmlhint alt-require -->\r\n<img src="test.gif" />'
      messages = HTMLHint.verify(code, {
        rules: {
          'alt-require': 'off',
        },
      })

      expect(messages.length).to.be(1)
      expect(messages[0].rule.id).to.be('alt-require')
      expect(messages[0].line).to.be(2)
      expect(messages[0].col).to.be(5)

      // With value = 'off'
      code = '<!-- htmlhint alt-require:off -->\r\n<img src="test.gif" />'
      messages = HTMLHint.verify(code, {
        rules: {
          'alt-require': 'error',
        },
      })
      expect(messages.length).to.be(0)

      // Without rule
      code = '<!-- htmlhint -->\r\n<img src="test.gif" />'
      messages = HTMLHint.verify(code, {
        rules: {
          'alt-require': 'off',
        },
      })

      expect(messages.length).to.be(0)
    })

    it('Show formated result should not result in an error', () => {
      const code =
        'tttttttttttttttttttttttttttttttttttt<div>中文<img src="test.gif" />tttttttttttttttttttttttttttttttttttttttttttttt'
      const messages = HTMLHint.verify(code, {
        rules: {
          'alt-require': 'error',
          'tag-pair': 'error',
        },
      })
      let arrLogs = HTMLHint.format(messages)
      expect(arrLogs.length).to.be(4)

      arrLogs = HTMLHint.format(messages, {
        colors: true,
        indent: 4,
      })
      const log = arrLogs[0]
      expect(/\[37m/.test(log)).to.be(true)
      expect(/ {4}L1 /.test(log)).to.be(true)
      expect(/|\.\.\./.test(log)).to.be(true)
      expect(/t\.\.\./.test(log)).to.be(true)
    })
  })
})
