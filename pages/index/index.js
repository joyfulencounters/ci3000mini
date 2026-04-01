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
    words: [],
    wordlists: []
  },

  onLoad(options) {
    console.log('onLoad options:', options)

    if (options && options.mode === 'wordlist') {
      console.log('进入词单模式, id =', options.id)
      this.getWordList(options.id)
    } else if (options && options.id) {
      this.getWordById(options.id)
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
          wordlists: [],
          mode: 'word'
        })

        if (data.word && data.word.id) {
          this.getWordLists(data.word.id)
        }

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
            wordlists: [],
            mode: 'word'
          })

          if (data.word && data.word.id) {
            this.getWordLists(data.word.id)
          }
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

  getWordLists(wid) {
    if (!wid) {
      this.setData({ wordlists: [] })
      return
    }

    wx.request({
      url: 'https://www.ci3000.com/Ajax/AjaxGet.aspx',
      data: {
        Action: 'get_wordlists_by_word',
        id: wid
      },
      success: (res) => {
        let data = res.data

        if (typeof data === 'string') {
          try {
            data = JSON.parse(data)
          } catch (e) {
            console.error('词单解析失败', data)
            this.setData({ wordlists: [] })
            return
          }
        }

        this.setData({
          wordlists: data.list || []
        })
      },
      fail: (err) => {
        console.log('请求词所在词单失败', err)
        this.setData({ wordlists: [] })
      }
    })
  },

  getWordList(id) {
    // 先切换到词单模式，避免页面显示错误
    this.setData({ mode: 'wordlist' })

    let url = 'https://www.ci3000.com/Ajax/AjaxGet.aspx?Action=random_wordlist'
    let data = {}

    if (id) {
      url = 'https://www.ci3000.com/Ajax/AjaxGet.aspx'
      data = { Action: 'getwordlistbyid', id: id }
      console.log('请求指定词单, id =', id)
    }

    wx.request({
      url: url,
      data: data,
      success: (res) => {
        console.log('词单API返回数据:', res.data)

        let data = res.data

        if (typeof data === 'string') {
          try {
            data = JSON.parse(data)
          } catch (e) {
            console.error('解析失败', data)
            // 如果是请求指定词单失败，则加载随机词单
            if (id) {
              wx.showToast({ title: '词单加载失败，显示随机词单', icon: 'none' })
              this.getWordList()
            }
            return
          }
        }

        // 检查数据是否有效
        if (!data || data === false || (data.status && data.status !== 1)) {
          console.error('API返回无效数据')
          if (id) {
            wx.showToast({ title: '词单加载失败，显示随机词单', icon: 'none' })
            this.getWordList()
          }
          return
        }

        // 确保 wordlist 有有效数据
        const wordlist = data.wordlist || (data.id ? data : {})
        const words = data.words || []

        // 如果词单为空或无效
        if (!wordlist.id || !wordlist.name) {
          console.error('词单数据无效:', wordlist)
          wx.showToast({ title: '加载失败，请重试', icon: 'none' })
          return
        }

        console.log('设置词单数据:', wordlist, '词数:', words.length)

        this.setData({
          wordlist: wordlist,
          words: words,
          mode: 'wordlist'
        })

        this.playSwitchAnimation()
      },
      fail(err) {
        console.log('请求失败', err)
        wx.showToast({ title: '加载失败', icon: 'none' })
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

    wx.showToast({
      title: '暂不支持这个跳转',
      icon: 'none'
    })
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
  },

  goWordListDetail(e) {
    const id = e.currentTarget.dataset.id
    console.log('点击词单, id =', id)
    if (!id) return

    wx.redirectTo({
      url: '/pages/index/index?mode=wordlist&id=' + id
    })
  },

  playSwitchAnimation() {
    // 你原来如果已经有这个方法，就保留你自己的内容
  }
})