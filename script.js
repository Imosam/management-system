//all needed selection
const calc = document.querySelector(".calc")
const price = document.querySelector("#price")
const taxes = document.querySelector("#taxes")
const ads = document.querySelector("#ads")
const discount = document.querySelector("#discount")
const total = document.querySelector("#total")
const createButton = document.querySelector("#create-btn")
const title = document.querySelector("#title")
const category = document.querySelector("#category")
const count = document.querySelector("#count")
const productTable = document.querySelector("#item-table")
const deleteAllButton = document.querySelector("#delete-all")
const searchBar = document.querySelector("#search-bar")
const searchByTitleButton = document.querySelector("#search-title")
const searchByCategoryButton = document.querySelector("#search-category")
const updateButton = document.querySelector("#update-btn")
updateButton.classList.add("update")
//**************************************************************************** */
//load products at the beginning
loadProducts()
//**************************************************************************** */
//event for the calculation of the total(price,taxes,ads,discount)
calc.addEventListener("change", () => {
  checkTotal()
})
//**************************************************************************** */
//event for the create button
createButton.addEventListener("click", e => {
  //prevent the form submit default
  e.preventDefault()
  //check if all data set properly
  if (
    !title.value |
    !category.value |
    !count.value |
    isNaN(count.value) |
    !total.dataset.total |
    false
  )
    return
  //create products and put them in the table
  //save the products in the localStorage
  let products = JSON.parse(localStorage.getItem("products")) || []
  console.log(products)
  const product = [
    title.value,
    price.value,
    taxes.value,
    ads.value,
    discount.value || 0,
    total.dataset.total,
    category.value,
  ]
  createProducts(products, product, parseInt(count.value))
  products = JSON.parse(localStorage.getItem("products")) || []
  let sum = products.length
  deleteAllButton.value = "Delete All" + "(" + sum + ")"
})
//**************************************************************************** */
//event for the deleteAll button
deleteAllButton.addEventListener("click", e => {
  e.preventDefault()
  deleteAll()
  deleteAllButton.value = "Delete All"
})
//**************************************************************************** */
//event for the search by title button
searchByTitleButton.addEventListener("click", e => {
  e.preventDefault()
  hideRows(1)
})
//**************************************************************************** */
//event for the search by category button
searchByCategoryButton.addEventListener("click", e => {
  e.preventDefault()
  hideRows(7)
})
//**************************************************************************** */
//event for the delete button
productTable.addEventListener("click", e => {
  if (!e.target.matches(".delete")) return
  let products = Array.from(JSON.parse(localStorage.getItem("products")))
  const parent = e.target.parentElement.parentElement
  const pos = parent.childNodes[0].innerText
  products = products.filter(element => element !== products[pos - 1])
  localStorage.setItem("products", JSON.stringify(products))
  clearTable()
  loadProducts()
})
//**************************************************************************** */
//event for small-update button
productTable.addEventListener("click", e => {
  if (!e.target.matches(".update")) return
  count.classList.add("hide")
  createButton.classList.add("hide")
  updateButton.classList.remove("hide")
  let products = Array.from(JSON.parse(localStorage.getItem("products")))
  const parent = e.target.parentElement.parentElement
  const pos = parent.childNodes[0].innerText
  title.value = products[pos - 1][0]
  price.value = products[pos - 1][1]
  taxes.value = products[pos - 1][2]
  ads.value = products[pos - 1][3]
  discount.value = products[pos - 1][4]
  total.value = "Total: " + products[pos - 1][5]
  total.classList.add("right")
  category.value = products[pos - 1][6]
  count.value = pos
})
//*************** */
//event for big update button
updateButton.addEventListener("click", e => {
  e.preventDefault()
  let products = Array.from(JSON.parse(localStorage.getItem("products")))
  const parent = e.target.parentElement.parentElement
  let pos = parseInt(count.value)
  checkTotal()
  const product = [
    title.value,
    price.value,
    taxes.value,
    ads.value,
    discount.value || 0,
    total.dataset.total,
    category.value,
  ]

  for (let i = 0; i < 7; i++) products[pos - 1][i] = product[i]
  localStorage.setItem("products", JSON.stringify(products))
  clearTable()
  loadProducts()
})
//**************************************************************************** */
function checkTotal() {
  //total calculation
  //if the elements are not set properly bring things to default
  if (
    !price.value |
    !taxes.value |
    !ads.value |
    isNaN(price.value) |
    isNaN(taxes.value) |
    isNaN(ads.value) |
    false
  ) {
    total.value = "Total:"
    total.dataset.total = ""
    total.classList.remove("right")
    return
  }
  //else start calculate the total
  total.value = 0
  if (parseInt(discount.value) > 0)
    total.value = parseInt(total.value) - parseInt(discount.value)

  total.value =
    parseInt(total.value) +
    parseInt(price.value) +
    parseInt(taxes.value) +
    parseInt(ads.value)
  total.classList.add("right")
  total.dataset.total = total.value
  total.value = "Total: " + total.value
}
//**************************************************************************** */
//delete products only from the table
function clearTable() {
  const tab = Array.from(productTable.children)
  for (let i = 1; i < tab.length; i++) tab[i].remove()
}
//**************************************************************************** */
//hide the unnecessary rows
function hideRows(type) {
  let rows = Array.from(productTable.children)
  rows.forEach(element => {
    element.classList.remove("hide")
  })
  if (searchBar.value == "") return
  for (let i = 1; i < rows.length; i++) {
    if (
      !rows[i].childNodes[type].innerHTML
        .toLowerCase()
        .includes(searchBar.value.toLowerCase())
    ) {
      rows[i].classList.add("hide")
    }
  }
}
//**************************************************************************** */
//function that create products and put it in the table and in the storage
function createProducts(products, product, nbr) {
  if (nbr <= 0) return
  let k = products.length === 0 ? 1 : products.length + 1
  for (let i = 0; i < nbr; i++) {
    let row = document.createElement("tr")
    let data = document.createElement("td")
    data.innerHTML = k++
    row.appendChild(data)
    product.forEach(element => {
      let data = document.createElement("td")
      data.innerHTML = element
      row.appendChild(data)
    })
    const anchor = document.createElement("a")
    anchor.href = "#main-title"
    anchor.innerText = "Update"
    anchor.classList.add("update")
    anchor.classList.add("btn")
    const DeleteButton = document.createElement("button")
    DeleteButton.innerText = "Delete"
    DeleteButton.classList.add("delete")
    DeleteButton.classList.add("btn")
    data = document.createElement("td")
    data.appendChild(anchor)
    row.appendChild(data)
    data = document.createElement("td")
    data.appendChild(DeleteButton)
    row.appendChild(data)
    productTable.appendChild(row)
    products.push(product)
  }
  localStorage.setItem("products", JSON.stringify(products))
  clearInputs()
}
//**************************************************************************** */
//function that load the products in the table from beginning
function loadProducts() {
  count.classList.remove("hide")
  createButton.classList.remove("hide")
  updateButton.classList.add("hide")
  const data = JSON.parse(localStorage.getItem("products")) || []
  if (data.length !== 0)
    deleteAllButton.value = "Delete All" + "(" + data.length + ")"
  else deleteAllButton.value = "Delete All"
  localStorage.setItem("products", JSON.stringify([]))
  data.forEach(element => {
    let products = JSON.parse(localStorage.getItem("products")) || []
    createProducts(products, element, 1)
  })
  const rows = Array.from(productTable.children)
  rows.forEach(element => {
    element.classList.remove("hide")
  })
}
//**************************************************************************** */
//function that delete all elements
function deleteAll() {
  const rows = productTable.querySelectorAll("tr")
  if (rows.length === 0) return
  for (let i = 1; i < rows.length; i++) rows[i].remove()
  localStorage.setItem("products", JSON.stringify([]))
  deleteAllButton.value = "Delete All"
}
//**************************************************************************** */
//function that clear the inputs
function clearInputs() {
  title.value = ""
  price.value = ""
  taxes.value = ""
  ads.value = ""
  discount.value = ""
  total.value = ""
  total.dataset.total = ""
  total.classList.remove("right")
  count.value = ""
  category.value = ""
}
