
export function getJSONP(url, cbName='callback') {
  return new Promise((resolve, reject) => {
    const cb = 'callback_' + new Date().getTime()
    url = url + '&' + cbName + '=' + cb

    const script = document.createElement('script');
    script.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(script);

    window[cb] = function (data) {
      // console.log('callback', data)
      delete window[cb]
      script.remove()
      resolve(data)
    }



    // const xhr = new XMLHttpRequest();
    // xhr.open("GET", url + '&cb=' + cb, true);
    // xhr.onreadystatechange = function() {
    //   if (xhr.readyState == 4) {
    //     eval(xhr.responseText);
    //     resolve()
    //   }
    // }
    // xhr.send();
  })
}
