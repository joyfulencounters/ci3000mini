Page({
  data: {
    word: '',
    tag: '',
    tags: [],
    related: [],
    wordSize: 74,
    wordSpacing: 2,
    mode: 'word',
    wordlist: {},
    words: []
  },

  onLoad(options) {
    if (options && options.id) {
      this.getWordById(options.id)
    } else if (options && options.mode === 'wordlist') {
      this.getWordList()
    } else {
      this.getWord()
    }
  },

  getWord() {
    wx.request({
      url: 'https://www.ci3000.com/Ajax/AjaxGet.aspx?Action=random_word',
      success: (res) => {
        let data = res.data

        if (typeof data === 'string') {
          try {
            data = JSON.parse(data)
          } catch (e) {
            console.error('解析失败', data)
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
        this.playSwitchAnimation()
      },
      fail(err) {
        console.log('请求失败', err)
      }
    })
  },

  getWordById(id) {
    wx.request({
      url: 'https://www.ci3000.com/Ajax/AjaxGet.aspx',
      data: {
        Action: 'getwordbyid',
        id: id
      },
      success: (res) => {
        let data = res.data

        if (typeof data === 'string') {
          try {
            data = JSON.parse(data)
          } catch (e) {
            console.error('解析失败', data)
            return
          }
        }

        if (data.status == 1) {
          this.setData({
            word: data.word || {},
            related: data.related || [],
            tag: data.tag || '',
            tags: data.tags || [],
            mode: 'word'
          })
        } else {
          wx.showToast({
            title: data.msg || '未找到该词',
            icon: 'none'
          })
          this.getWord()
        }
        this.playSwitchAnimation()
      },
      fail(err) {
        console.log('请求失败', err)
      }
    })
  },

  getWordList() {
    wx.request({
      url: 'https://www.ci3000.com/Ajax/AjaxGet.aspx?Action=random_wordlist',
      success: (res) => {
        let data = res.data

        if (typeof data === 'string') {
          try {
            data = JSON.parse(data)
          } catch (e) {
            console.error('解析失败', data)
            return
          }
        }

        this.setData({
          wordlist: data.wordlist || {},
          words: data.words || [],
          mode: 'wordlist'
        })
        this.playSwitchAnimation()
      },
      fail(err) {
        console.log('请求失败', err)
      }
    })
  },

  switchToWord() {
    this.getWord()
  },

  switchToWordList() {
    this.getWordList()
  },
  goFeelingHome() {
    wx.redirectTo({
      url: '/pages/feeling/index'
    })
  },
  goFeeling(e) {
    const tag = e.currentTarget.dataset.tag
    if (!tag) return
  
    wx.redirectTo({
      url: '/pages/feeling/index?tag=' + encodeURIComponent(tag)
    })
  },

  goWordDetail(e) {
    console.log('点击了友邻词汇', e)
  
    const id = e.currentTarget.dataset.id
    console.log('当前 id =', id)
  
    if (!id) return
  
    wx.redirectTo({
      url: '/pages/index/index?id=' + id,
      success(res) {
        console.log('跳转成功', res)
      },
      fail(err) {
        console.log('跳转失败', err)
      }
    })
  },
  goWord(e) {
    const name = e.currentTarget.dataset.name
    if (!name) return
  
    // 切换到词模式
    this.setData({
      mode: 'word'
    })
  
    // 调你原来获取词的接口（你肯定已经有这个方法）
    this.getWordByName(name)
  },
  goWordFromList(e) {
    const id = e.currentTarget.dataset.id
    console.log('点击了收录词汇，id =', id)
  
    if (!id) {
      wx.showToast({
        title: '这个词暂时打不开',
        icon: 'none'
      })
      return
    }
  
    this.getWordById(id)
  }

})