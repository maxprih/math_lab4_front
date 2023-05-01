<template>
  <div class="hello">
    <table class="center">
      <thead>
        <tr>
          <th class="first_line">X</th>
          <th class="first_line">Y</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><input type="number" placeholder="Enter X" min="-100" max="100" name="x1" step="any" required></td>
          <td><input type="number" placeholder="Enter Y" min="-100" max="100" name="y1" step="any" required></td>
        </tr>
        <tr>
          <td><input type="number" placeholder="Enter X" min="-100" max="100" name="x2" step="any" required></td>
          <td><input type="number" placeholder="Enter Y" min="-100" max="100" name="y2" step="any" required></td>
        </tr>
        <tr>
          <td><input type="number" placeholder="Enter X" min="-100" max="100" name="x3" step="any" required></td>
          <td><input type="number" placeholder="Enter Y" min="-100" max="100" name="y3" step="any" required></td>
        </tr>
        <tr>
          <td><input type="number" placeholder="Enter X" min="-100" max="100" name="x4" step="any" required></td>
          <td><input type="number" placeholder="Enter Y" min="-100" max="100" name="y4" step="any" required></td>
        </tr>
        <tr>
          <td><input type="number" placeholder="Enter X" min="-100" max="100" name="x5" step="any" required></td>
          <td><input type="number" placeholder="Enter Y" min="-100" max="100" name="y5" step="any" required></td>
        </tr>
        <tr>
          <td><input type="number" placeholder="Enter X" min="-100" max="100" name="x6" step="any" required></td>
          <td><input type="number" placeholder="Enter Y" min="-100" max="100" name="y6" step="any" required></td>
        </tr>
        <tr>
          <td><input type="number" placeholder="Enter X" min="-100" max="100" name="x7" step="any" required></td>
          <td><input type="number" placeholder="Enter Y" min="-100" max="100" name="y7" step="any" required></td>
        </tr>
        <tr>
          <td><input type="number" placeholder="Enter X" min="-100" max="100" name="x8" step="any" required></td>
          <td><input type="number" placeholder="Enter Y" min="-100" max="100" name="y8" step="any" required></td>
        </tr>
        <tr id="row-9" style="display: none">
          <td><input type="number" id="x9" placeholder="Enter X" min="-100" max="100" name="x9" step="any"></td>
          <td><input type="number" id="y9" placeholder="Enter Y" min="-100" max="100" name="y9" step="any"></td>
        </tr>
        <tr id="row-10" style="display: none">
          <td><input type="number" id="x10" placeholder="Enter X" min="-100" max="100" name="x10" step="any"></td>
          <td><input type="number" id="y10" placeholder="Enter Y" min="-100" max="100" name="y10" step="any"></td>
        </tr>
        <tr id="row-11" style="display: none">
          <td><input type="number" id="x11" placeholder="Enter X" min="-100" max="100" name="x11" step="any"></td>
          <td><input type="number" id="y11" placeholder="Enter Y" min="-100" max="100" name="y11" step="any"></td>
        </tr>
        <tr id="row-12" style="display: none">
          <td><input type="number" id="x12" placeholder="Enter X" min="-100" max="100" name="x12" step="any"></td>
          <td><input type="number" id="y12" placeholder="Enter Y" min="-100" max="100" name="y12" step="any"></td>
        </tr>
        <tr>
          <td>
            <button id="inc_btn" @click="this.increment()" type="button" class="add-row">+</button>
          </td>
          <td>
            <button id="dec_btn" @click="this.decrement()" type="button" class="remove-row">-</button>
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="loadFile()">Load File</button>
    <button @click="submitForm" class="submit">Submit</button>
    <div>
      <h2 v-if="function_name == 'линейная'"><span>Коэффициент Пирсона: {{ pirson }}</span></h2>
      <h2><span>Среднеквадратичное отклонение: {{ otkl }} </span></h2>
      <h2><span>Лучшая аппроксимирующая функция: {{ function_name }}</span></h2>
      <br>
      <h2>
        <span>f(x): </span>
        <span id="function">{{ functionX }}</span>
      </h2>

    </div>

    <div class="table-responsive">
      <table class="table-hover table-bordered center">
        <thead>
          <tr style="text-align:center">
            <th>X</th>
            <th>Y</th>
            <th>Phi</th>
            <th>Eps</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(point, index) in points" :key="index" class="res-table-column">
            <td>{{ point.x }}</td>
            <td>{{ point.y }}</td>
            <td>{{ phis[index] }}</td>
            <td>{{ epsilons[index] }}</td>

          </tr>
        </tbody>
      </table>
    </div>
    <div id="jxgbox" class="jxgbox center" ref="jxgbox"></div><br>
  </div>
</template>

<script>
import MathService from "../services/math.service"
import functionPlot from 'function-plot'

export default {
  name: 'HelloWorld',
  data() {
    return {
      points: [],
      point: {
        x: 1,
        y: 1
      },
      phis: [],
      epsilons: [],
      response: [],
      function_name: "",
      functionX: "",
      otkl: "",
      rows: 8,
      pirson: null
    }
  },
  methods: {
    getAnswer() {
      const inputs = Array.from(document.querySelectorAll('input[type="number"]'))
        .filter(input => getComputedStyle(input).display !== 'none');
      const values = inputs.map(input => parseFloat(input.value));

      let points = this.parseTable(values);
      let pointsArr = this.parseTableForGraph(values);
      MathService.postReq(points)
        .then(response => {
          this.otkl = response.data.sredneKvOtkl
          this.function_name = this.getTypeTextRepresentation(response.data)
          this.functionX = this.getFunctionTextRepresentation(response.data)
          this.points = response.data.points;
          this.phis = response.data.phis;
          this.pirson = response.data.pirson;
          this.epsilons = response.data.epsilons;
          this.graph(response.data, pointsArr)
        })
    },
    graph(data, points) {
      functionPlot({
        target: "#jxgbox",
        width: 800,
        height: 800,
        grid: true,
        data: [
          { fn: this.getFunctionTextRepresentation(data) },
          { points: points, fnType: 'points', graphType: 'scatter' }
        ]
      })
    },
    parseTable(cells) {
      let points = []

      let point;
      for (let i = 0; i < cells.length; i += 2) {
        point = {}
        point.x = parseFloat(cells[i])
        point.y = parseFloat(cells[i + 1])

        if (this.isValid(point.x) && this.isValid(point.y)) {
          points.push(point)
        }
      }

      return points
    },
    parseTableForGraph(cells) {
      let points = []

      for (let i = 0; i < cells.length; i += 2) {
        let x = parseFloat(cells[i])
        let y = parseFloat(cells[i + 1])

        if (this.isValid(x) && this.isValid(y)) {
          points.push([x, y])
        }
      }

      return points
    },
    isValid(x) {

      return !isNaN(x) && (x >= -100 && x <= 100);
    },

    getFunction(data) {
      switch (data.best) {
        case "linear":
          return x => data.linear[0] * x + data.linear[1];
        case "square":
          return x => data.square[0] + data.square[1] * x + data.square[2] * Math.pow(x, 2);
        case "cubic":
          return x => data.cubic[0] + data.cubic[1] * x + data.cubic[2] * Math.pow(x, 2) + data.cubic[3] * Math.pow(x, 3);
        case "exponential":
          return x => data.exponential[0] * Math.exp(data.exponential[1] * x);
        case "logarithmic":
          return x => data.logarithmic[0] * Math.log(x) + data.logarithmic[1];
        case "power":
          return x => data.power[0] * Math.pow(x, data.power[1])
      }
    },
    getFunctionTextRepresentation(data) {
      switch (data.best) {
        case "linear":
          return data.linear[1].toFixed(2) + " + " + data.linear[0].toFixed(2) + " * x";
        case "square":
          return data.square[0].toFixed(2) + " + " + data.square[1].toFixed(2) + " * x + " + data.square[2].toFixed(2) + " * x ^ 2";
        case "cubic":
          return data.cubic[0].toFixed(2) + " + " + data.cubic[1].toFixed(2) + " * x + " + data.cubic[2].toFixed(2) + " * x ^ 2 + " + data.cubic[3].toFixed(2) + " * x ^ 3";
        case "exponential":
          return data.exponential[0].toFixed(2) + " * e ^ (x * " + data.exponential[1].toFixed(2) + ")";
        case "logarithmic":
          return data.logarithmic[0].toFixed(2) + " * ln(x) + " + data.logarithmic[1].toFixed(2);
        case "power":
          return data.power[0].toFixed(2) + " * x ^ " + data.power[1].toFixed(2);
      }
    },
    getTypeTextRepresentation(data) {
      switch (data.best) {
        case "linear":
          return "линейная";
        case "square":
          return "квадратичная";
        case "cubic":
          return "кубическая";
        case "exponential":
          return "экспоненциальная";
        case "logarithmic":
          return "логарифмическая";
        case "power":
          return "степенная"
      }
    },

    draw_points(board, points) {
      points.forEach((point) => {
        board.create("point", [point.x, point.y], { fixed: true });
      });
    },

    checkRowLimits() {
      this.checkRemove()
      this.checkAdd()
    },

    checkRemove() {
      if (this.rows === 8) {
        document.querySelector('#dec_btn').disabled = true;
        document.getElementById("dec_btn").classList.add("disabled_btn");
      }

      if (this.rows === 11) {
        document.querySelector('#inc_btn').disabled = false;
        document.getElementById("inc_btn").classList.remove("disabled_btn")
      }
    },
    checkAdd() {
      if (this.rows === 12) {
        document.querySelector('#inc_btn').disabled = true;
        document.getElementById("inc_btn").classList.add("disabled_btn");
      }
      if (this.rows === 9) {
        document.querySelector('#dec_btn').disabled = false;
        document.getElementById("dec_btn").classList.remove("disabled_btn")
      }
    },
    increment() {

      if (this.rows + 1 <= 12) {
        this.rows++;
        const str = '#row-' + this.rows;
        const xi = '#x' + this.rows;
        const yi = '#y' + this.rows;
        document.querySelector(xi).style.display = '';
        document.querySelector(yi).style.display = '';
        document.querySelector(str).style.display = 'table-row';

      }
      this.checkRowLimits();
    },
    decrement() {
      if (this.rows - 1 >= 8) {
        const str = '#row-' + this.rows;
        const xi = '#x' + this.rows;
        const yi = '#y' + this.rows;
        document.querySelector(str).style.display = 'none';
        document.querySelector(xi).style.display = 'none';
        document.querySelector(yi).style.display = 'none';
        this.rows--;
      }
      this.checkRowLimits();
    },
    submitForm() {
      const inputs1 = document.getElementsByTagName('input');
      let error = false;
      let set = new Set();
      for (let i = 0; i < this.rows * 2; i++) {
        const val = parseFloat(inputs1[i].value);
        if (isNaN(val) || val < -100 || val > 100) {
          inputs1[i].classList.add('error');
          error = true;
        } else {
          inputs1[i].classList.remove('error');
          if (set.has(val) && i % 2 === 0) {
            for (let j = 0; j < this.rows * 2; j += 2) {
              const new_val = parseFloat(inputs1[j].value);
              if (new_val === val) {
                inputs1[j].classList.add('error');
              }
            }
            error = true;
          }
          if (i % 2 === 0) {
            set.add(val);
          }


        }
      }
      if (error) {
        return;
      }
      this.getAnswer();
    }, 
    loadFile() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.txt'; // optional file types
      input.onchange = () => {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
          const lines = e.target.result.split('\n');
          for (let i = 0; i < lines.length && i < 12; i++) {
            const values = lines[i].trim().split(/\s+/);
            if (values.length >= 2) {
              const xInput = document.getElementsByName(`x${i + 1}`)[0];
              const yInput = document.getElementsByName(`y${i + 1}`)[0];
              this.rows = i + 1

              xInput.value = values[0];
              yInput.value =  values[1]; 
            }
          }
        }
        reader.readAsText(file);
      };
      input.click();

    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.center {
  margin-left: auto;
  margin-right: auto;
}

.hello {
  /* background-color: #2e2c3d; */
  /* color: #fff; */
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

h1 {
  text-align: center;
  margin-top: 40px;
}

h2 {
  text-align: center;
  margin-top: 10px;
}


table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  padding: 10px;
  text-align: center;
}

th {
  background-color: #6c5ce7;
  color: #fff;
  font-weight: normal;
}


input[type="number"] {
  background-color: #b2a3cd;
  border: none;
  /* color: #fff; */
  padding: 10px;
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  box-sizing: border-box;
}

input[type="number"]:focus {
  outline: none;
}

.error {
  background-color: #ec3853 !important;
}

.submit {
  background-color: #6c5ce7;
  border: none;
  /* color: #fff; */
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 20px;
  transition: background-color 0.3s ease-in-out;
}

.submit:hover {
  background-color: #a29bfe;
}

.result {
  background-color: #3c344b;
  padding: 20px;
  height: 100%;

}

.result h2 {
  margin-top: 0;
}

.result p {
  font-size: 16px;
  line-height: 1.5;
}

.add-row,
.remove-row {
  background-color: rgba(206, 50, 97, 0.92);
  border: none;
  color: #fff;
  padding: 10px;
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  box-sizing: border-box;
}

.disabled_btn {
  background-color: #3c344b;
}

.jxgbox {
  width: 500px;
  height: 500px;
}
</style>
