const SEARCH_API_KEY = ''
const SEARCH_ID = ''
const BASE_URL = `https://www.googleapis.com/customsearch/v1?key=${SEARCH_API_KEY}&cx=${SEARCH_ID}&searchType=image`

let word = ''
let images = []

// Search
const searchImage = async query => {
  const { data } = await axios.get(`${BASE_URL}&q=${query}`)
  console.log(data)
  images = data.items.map(item => ({
    link: item.link
  }))
  console.log(images)
  addImages()
}

// Form
const form = document.querySelector('form')
form.onsubmit = async event => {
  // デフォルトで実行されるものを止める
  event.preventDefault()
  await searchImage(word)
}

// SearchBox
const searchBox = document.querySelector('input')
searchBox.onchange = event => {
  word = event.target.value
}

const res = {
  data: {}
}

// Observer 監視するやつ
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return
    const lazyImage = entry.target
    lazyImage.src = lazyImage['data-src']
    const svg = lazyImage.parentElement.querySelector('svg')

    // 遅いならこっちで。アニメーションを見せたいならsetTimeoutを使用
    lazyImage.onload = () => {
      svg.remove()
    }
    // setTimeout(() => {
    //   svg.remove()
    // }, 1000)

    observer.unobserve(lazyImage)
  })
})

// // Add Images
const addImages = () => {
  const box = document.querySelector('#image-box')
  images.forEach(image => {
    const div = document.createElement('div')
    div.style.width = '600px'
    div.style.height = '600px'
    div.style.position = 'relative'
    div.style.margin = '32px'

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', 600)
    svg.setAttribute('height', 600)

    // const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    // rect.setAttribute('x', 0)
    // rect.setAttribute('y', 0)
    // rect.setAttribute('width', 600)
    // rect.setAttribute('height', 600)

    const img = new Image(600, 600)
    img['data-src'] = image.link
    // data-〇〇は、HTMLのタグにJavaScriptを入れられるということを示す
    // JavaScriptはハイフン入れられない
    // img.data-src = image.link

    // svg.appendChild(rect)
    div.appendChild(img)
    div.appendChild(svg)
    box.appendChild(div)
    observer.observe(img)
  })
}
