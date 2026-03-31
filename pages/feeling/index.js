Page({
  data: {
    tag: '',
    inputValue: '',
    placeholderText: '幸福/美好/惆怅/遗憾...',
    list: [],
    rowCount: 0,
    page: 1,
    pageSize: 50,
    loading: false,
    loadingMore: false,
    hasMore: true,
    emptyText: '这里暂时一片空白，不妨换种感觉试试',
    animClass: ''
  },

  onLoad(options) {
    const tag = options.tag ? decodeURIComponent(options.tag) : ''
  
    if (tag) {
      this.setData({
        tag: tag,
        inputValue: tag,
        placeholderText: ''
      })
      this.fetchWordsByTag(tag, 1)
    } else {
      this.setData({
        tag: '',
        inputValue: '',
        placeholderText: '幸福/美好/惆怅/遗憾...'
      })
    }
  },

  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  onSearch() {
    const tag = (this.data.inputValue || '').trim()
    if (!tag) {
      wx.showToast({
        title: '请输入一种感觉',
        icon: 'none'
      })
      return
    }
  
    this.setData({
      tag: tag,
      list: [],
      rowCount: 0,
      page: 1,
      hasMore: true
    })
  
    this.fetchWordsByTag(tag, 1)
  },

  fetchWordsByTag(tag, page) {
    if (!tag) return
  
    const isFirstPage = page === 1
  
    if (isFirstPage) {
      this.setData({
        loading: true
      })
    } else {
      if (this.data.loadingMore || !this.data.hasMore) return
  
      this.setData({
        loadingMore: true
      })
    }
  
    wx.request({
      url: 'https://www.ci3000.com/Ajax/AjaxGet.aspx',
      method: 'GET',
      data: {
        Action: 'getWordsByTag',
        tag: tag,
        page: page,
        pagesize: this.data.pageSize
      },
      success: (res) => {
        let data = res.data
  
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data)
          } catch (e) {
            console.error('解析失败', data)
            if (isFirstPage) {
              this.setData({
                list: [],
                rowCount: 0,
                hasMore: false
              })
            }
            return
          }
        }
  
        if (data.status == 1) {
          const newList = data.list || []
          const total = Number(data.rowCount || 0)
  
          const finalList = isFirstPage
            ? newList
            : this.data.list.concat(newList)
  
          this.setData({
            list: finalList,
            rowCount: total,
            page: page,
            hasMore: finalList.length < total && newList.length > 0
          })
        } else {
          if (isFirstPage) {
            this.setData({
              list: [],
              rowCount: 0,
              hasMore: false
            })
          }
  
          wx.showToast({
            title: data.msg || '加载失败',
            icon: 'none'
          })
        }
        this.playSwitchAnimation()
      },
      fail: () => {
        if (isFirstPage) {
          this.setData({
            list: [],
            rowCount: 0,
            hasMore: false
          })
        }
  
        wx.showToast({
          title: '网络异常',
          icon: 'none'
        })
      },
      complete: () => {
        this.setData({
          loading: false,
          loadingMore: false
        })
      }
    })
  },

  goWordDetail(e) {
    const id = e.currentTarget.dataset.id
    if (!id) return
  
    wx.redirectTo({
      url: '/pages/index/index?id=' + id
    })
  },

  goWordHome() {
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },

  goWordListHome() {
    wx.redirectTo({
      url: '/pages/index/index?mode=wordlist'
    })
  },

  onReachBottom() {
    const { tag, page, loading, loadingMore, hasMore } = this.data
  
    if (!tag || loading || loadingMore || !hasMore) return
  
    this.fetchWordsByTag(tag, page + 1)
  },

  playSwitchAnimation() {
    this.setData({
      animClass: 'fade-in'
    })
  
    setTimeout(() => {
      this.setData({
        animClass: ''
      })
    }, 260)
  },
  onFocusInput() {
    this.setData({
      placeholderText: ''
    })
  },
  onBlurInput() {
    if (!this.data.inputValue) {
      this.setData({
        placeholderText: '幸福/美好/惆怅/遗憾...'
      })
    }
  }

})