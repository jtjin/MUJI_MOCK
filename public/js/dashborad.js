/** @format */

// const axiosInstance = axios.create({
//     baseURL: 'https://white-100.online/'
// });

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
})

const socket = io()
const socket = io("https://localhost:3001")

let total = document.querySelector("#number")

socket.on("freshDashBoard", (data) => {
  showTotal()
  colorPie()
  pricePie()
  sizePie()
})

showTotal()
colorPie()
pricePie()
sizePie()

function showTotal() {
  axiosInstance
    .get("/api/1.0/total_value")
    .then((res) => {
      total.innerHTML = res.data.total
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      }
    })
}

function colorPie() {
  axiosInstance
    .get("/api/1.0/total_color")
    .then((res) => {
      var data = [
        {
          values: res.data[2],
          labels: res.data[1],
          marker: { colors: res.data[0] },
          type: "pie",
        },
      ]
      var layout = {
        height: 400,
        width: 500,
        title: "Product sold percentage in different colors",
      }
      Plotly.newPlot("myDiv", data, layout)
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      }
    })
}

function pricePie() {
  axiosInstance
    .get("/api/1.0/total_price")
    .then((res) => {
      console.log(res.data)

      var trace1 = {
        x: res.data[0],
        y: res.data[1],
        name: "control",
        autobinx: false,
        histnorm: "count",
        marker: {
          color: "#1F77B4",
          line: {
            color: "#1F77B4",
            width: 1,
          },
        },
        //opacity: 0.5,
        type: "histogram",
        xbins: {
          end: 1800,
          size: 20,
          start: 0,
        },
      }

      var data = [trace1]
      var layout = {
        bargap: 500,
        bargroupgap: 500,
        barmode: "stack",
        title: "Product sold quantity in different price range",
        xaxis: { title: "Price Range" },
        yaxis: { title: "Quantity" },
      }
      Plotly.newPlot("priceDiv", data, layout)
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      }
    })
}

function sizePie() {
  axiosInstance
    .get("/api/1.0/total_size")
    .then((res) => {
      let data = []

      res.data.forEach((element, index) => {
        let trace = {
          x: element[1].map((e) => {
            return "product" + e
          }),
          y: element[2],
          name: element[0],
          type: "bar",
        }
        data.push(trace)
      })

      var layout = {
        barmode: "stack",
        title: "Quantity of top 5 sold products in different sizes",
      }

      Plotly.newPlot("sizePie", data, layout)
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      }
    })
}
