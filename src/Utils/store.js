const chrome = window.chrome
const saveKey = 'sitelist'
const defaultData = JSON.stringify([...Array(9)].map(() => {
  return {
    title: '分组',
    data: [...Array(9)].map(() => {
      return {
        name: '',
        url: ''
      }
    })
  }
})
)

function isChromeExtension() {
  return chrome && chrome.storage && chrome.storage.sync && chrome.storage.sync.get
}

export function getData() {
  return new Promise((resolve) => {
    if (isChromeExtension()) {
      chrome.storage.sync.get([saveKey], function (result) {
        let data = result[saveKey]
        if (!data) {
          data = defaultData
        }
        resolve(data)
      })
    } else {
      let result = localStorage.getItem(saveKey)
      if (!result) {
        result = defaultData
      }
      resolve(result)
    }
  })
}
export function setData(data) {
  return new Promise((resolve) => {
    if (isChromeExtension()) {
      const params = {}
      params[saveKey] = data
      chrome.storage.sync.set(params, function () {
        resolve()
      })
    } else {
      localStorage.setItem(saveKey, data)
      resolve()
    }
  })
}
