Page({
  data: {
    word: '',
    tag: '',
    tags: [],
    related: [],
    wordSize: 74,
    wordSpacing: 2,
    mode: 'word', // word / wordlist
    wordlist: {},
    words: []
  },
  getWordList() {
    const that = this
    wx.request({
      url: 'https://www.ci3000.com/Ajax/AjaxGet.aspx?Action=random_wordlist',
      success(res) {
        that.setData({
          wordlist: res.data.wordlist,
          words: res.data.words
        })
      }
    })
  },
  
  switchToWord() {
    wx.request({
      url: 'https://www.ci3000.com/Ajax/AjaxGet.aspx?Action=random_word',
      success: (res) => {
        let data = res.data
  
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data)
          } catch (e) {
            return
          }
        }
  
        this.setData({
          word: data.word || {},
          related: data.related || [],
          tag: data.tag || '',
          tags: data.tags || [],
          mode: 'word'
        })
      }
    })
  },
  
  switchToWordList() {
    wx.request({
      url: 'https://www.ci3000.com/Ajax/AjaxGet.aspx?Action=random_wordlist',
      success: (res) => {
        let data = res.data
  
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data)
          } catch (e) {
            return
          }
        }
  
        this.setData({
          wordlist: data.wordlist || {},
          words: data.words || [],
          mode: 'wordlist'
        })
      }
    })
  },

  onLoad() {
    this.getWord()
  },

  getWord() {
    const that = this

    wx.request({
      url: 'https://www.ci3000.com/Ajax/AjaxGet.aspx?Action=random_word',
      success: (res) => {
        let data = res.data
      
        // ⭐ 关键：兼容字符串和对象两种情况
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data)
          } catch (e) {
            console.error('解析失败', data)
            return
          }
        }
      
        // ⭐ 正确取字段
        this.setData({
          word: data.word || {},
          related: data.related || [],
          tag: data.tag || '',
          tags: data.tags || []
        })
      },
      fail(err) {
        console.log('请求失败', err)
      }
    })
  }
})