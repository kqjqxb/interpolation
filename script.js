class ActionWithPoints
{
    constructor() {
        this.filePointsCache = [];
    }
    updatePointsForm() {
        const pointsForm = document.getElementById('pointsForm');
        const numPoints = pointsForm.children.length;

        for (let i = 1; i <= numPoints; i++) {
            const xInput = document.getElementById(`x${i}`);
            const yInput = document.getElementById(`y${i}`);
            xInput.name = `x${i}`;
            yInput.name = `y${i}`;
            xInput.id = `x${i}`;
            yInput.id = `y${i}`;
        }
    }
    validateInput(input, minValue, maxValue) {
        const value = input.value;
        const isValid = /^-?\d*\.?\d*$/.test(value);
        if (!isValid) {
            input.value = value.slice(0, -1);
        } else {
            const numValue = parseFloat(value);
            if (numValue < minValue || numValue > maxValue) {
                alert(`Значення має бути в діапазоні від ${minValue} до ${maxValue}`);
                input.value = '';
            }
        }
    }
    addPoint() {
        const pointsForm = document.getElementById('pointsForm');
        const numPoints = pointsForm.children.length + 1;

        if (numPoints > 15) {
            alert('Кількість точок повинна бути від 2 до 15.');
            return;
        }

        const point = `
            <div id="point${numPoints}">
                <label for="x${numPoints}">X${numPoints}: </label>
                <input type="text" id="x${numPoints}" oninput="awp.validateInput(this, -1500, 1500)">
                <label for="y${numPoints}">Y${numPoints}: </label>
                <input type="text" id="y${numPoints}" oninput="awp.validateInput(this, -1500, 1500)">
                <button type="button" id="remove" class="btn btn-danger" onclick="awp.removePoint(${numPoints})">Видалити</button>
            </div>
        `;

        pointsForm.insertAdjacentHTML('beforeend', point);
        document.getElementById('numPoints').value = numPoints;
    }
    removePoint(index) {
        const point = document.getElementById(`point${index}`);
        if (point) {
            point.remove();
            this.reIndexPoints();
            this.updatePointsForm();
            document.getElementById('numPoints').value = document.getElementById('pointsForm').children.length;
        }
    }
    reIndexPoints() {
        const pointsForm = document.getElementById('pointsForm');
        const children = pointsForm.children;
        for (let i = 0; i < children.length; i++) {
            const point = children[i];
            const id = i + 1;
            point.id = `point${id}`;
            point.querySelector('label[for^="x"]').htmlFor = `x${id}`;
            point.querySelector('label[for^="x"]').innerText = `X${id}: `;
            point.querySelector('input[id^="x"]').id = `x${id}`;
            point.querySelector('label[for^="y"]').htmlFor = `y${id}`;
            point.querySelector('label[for^="y"]').innerText = `Y${id}: `;
            point.querySelector('input[id^="y"]').id = `y${id}`;
            point.querySelector('button').setAttribute('onclick', `awp.removePoint(${id})`);
        }
    }
    generatePoints() {
        const numPoints = document.getElementById('numPoints').value;
        if (numPoints < 2 || numPoints > 15) {
            alert('Кількість точок повинна бути від 2 до 15.');
            return;
        }
        const pointsForm = document.getElementById('pointsForm');
        pointsForm.innerHTML = '';
        for (let i = 1; i <= numPoints; i++) {
            const x = Math.floor(Math.random() * 3001) - 1500;
            const y = Math.floor(Math.random() * 3001) - 1500;
            pointsForm.innerHTML += `
                <div id="point${i}">
                    <label for="x${i}">X${i}: </label>
                    <input type="text" id="x${i}" value="${x}" oninput="awp.validateInput(this, -1500, 1500)">
                    <label for="y${i}">Y${i}: </label>
                    <input type="text" id="y${i}" value="${y}" oninput="awp.validateInput(this, -1500, 1500)">
                    <button type="button" id="remove" class="btn btn-danger" onclick="awp.removePoint(${i})">Видалити</button>
                </div>
            `;
        }
    }
    checkDuplicatePoints(points) {
        const duplicates = [];
        for (let i = 0; i < points.length - 1; i++) {
            for (let j = i + 1; j < points.length; j++) {
                if (points[i].x === points[j].x && points[i].y === points[j].y) {
                    duplicates.push({ point1: i + 1, point2: j + 1 });
                }
            }
        }
        return duplicates;
    }
    setFilePoints(points) {
        if (points.length < 2 || points.length > 15) {
            alert('Кількість точок повинна бути від 2 до 15.');
            return;
        }
        const pointsForm = document.getElementById('pointsForm');
        pointsForm.innerHTML = '';
        points.forEach((point, index) => {
            pointsForm.innerHTML += `
                <div id="point${index + 1}">
                    <label for="x${index + 1}">X${index + 1}: </label>
                    <input type="text" id="x${index + 1}" value="${point.x}" oninput="awp.validateInput(this, -1500, 1500)">
                    <label for="y${index + 1}">Y${index + 1}: </label>
                    <input type="text" id="y${index + 1}" value="${point.y}" oninput="awp.validateInput(this, -1500, 1500)">
                    <button type="button" id="remove" class="btn btn-danger" onclick="awp.removePoint(${index + 1})">Видалити</button>
                </div>
            `;
        });
        document.getElementById('numPoints').value = points.length;
    }
    sortPoints(points) {
        return points.sort((a, b) => a.x - b.x);
    }
    readFile(input) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            const points = lines.map(line => {
                const [x, y] = line.split(/\s+/).map(Number);
                return { x, y };
            });
            if (points.length < 2 || points.length > 15) {
                alert('Кількість точок повинна бути від 2 до 15.');
                return;
            }
            this.filePointsCache = points;
            this.setFilePoints(points); // Виклик функції для відображення точок у формі
        };
        reader.readAsText(file);
    }
    setFilePoints(points) {
        const pointsForm = document.getElementById('pointsForm');
        pointsForm.innerHTML = '';
        points.forEach((point, index) => {
            pointsForm.innerHTML += `
                <div id="point${index + 1}">
                    <label for="x${index + 1}">X${index + 1}: </label>
                    <input type="text" id="x${index + 1}" value="${point.x}" oninput="awp.validateInput(this)">
                    <label for="y${index + 1}">Y${index + 1}: </label>
                    <input type="text" id="y${index + 1}" value="${point.y}" oninput="awp.validateInput(this)">
                    <button type="button" id="remove" class="btn btn-danger" onclick="awp.removePoint(${index + 1})">Видалити</button>
                </div>
            `;
        });
    }
    getFilePoints() {
        return this.filePointsCache;
    }
}
class UI
{
    createFields() {
        const numPoints = document.getElementById('numPoints').value;
        if (numPoints < 2 || numPoints > 15) {
            alert('Кількість точок повинна бути від 2 до 15.');
            return;
        }
        const pointsForm = document.getElementById('pointsForm');
        pointsForm.innerHTML = '';
        for (let i = 1; i <= numPoints; i++) {
            pointsForm.innerHTML += `
                <div id="point${i}">
                    <label for="x${i}">X${i}: </label>
                    <input type="text" id="x${i}" oninput="awp.validateInput(this, -1500, 1500)">
                    <label for="y${i}">Y${i}: </label>
                    <input type="text" id="y${i}" oninput="awp.validateInput(this, -1500, 1500)">
                    <button type="button" id="remove" class="btn btn-danger" onclick="awp.removePoint(${i})">Видалити</button>
                </div>
            `;
        }
    }
    toggleInputMethod() {
        const method = document.getElementById('pointInputMethod').value;
        const manualInput = document.getElementById('manualInput');
        const fileInputDiv = document.getElementById('fileInputDiv');
        if (method === 'manual') {
            manualInput.style.display = 'block';
            fileInputDiv.style.display = 'none';
        } else if (method === 'file') {
            manualInput.style.display = 'none';
            fileInputDiv.style.display = 'block';
            document.getElementById('pointsForm').innerHTML = '';
            awp.setFilePoints(awp.getFilePoints());
        }
    }
    resetAll() {
        const pointsForm = document.getElementById('pointsForm');
        pointsForm.innerHTML = '';
        const numPoints = document.getElementById('numPoints');
        numPoints.value = '';
        document.getElementById('fileInput').value = ''; // Очищення поля файлу

        const ctx = document.getElementById('interpolationChart').getContext('2d');
        if (window.chart) {
            window.chart.destroy();
        }
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        document.getElementById('complexity').innerHTML = '';
    }
}
class Interpolator
{
    interpolate() {
        const method = document.getElementById('method').value;
        const pointInputMethod = document.getElementById('pointInputMethod').value;
        let points = [];
        if (pointInputMethod === 'manual') {
            const numPoints = document.getElementById('pointsForm').children.length;
            if (numPoints < 2 || numPoints > 15) {
                alert('Кількість точок повинна бути від 2 до 15.');
                return;
            }
            for (let i = 1; i <= numPoints; i++) {
                const x = parseFloat(document.getElementById(`x${i}`).value);
                const y = parseFloat(document.getElementById(`y${i}`).value);
                if (isNaN(x) || isNaN(y)) {
                    alert('Введіть коректні значення для всіх точок.');
                    return;
                }
                points.push({ x, y });
            }
        } else if (pointInputMethod === 'file') {
            points = awp.getFilePoints();
            if (points.length < 2 || points.length > 15) {
                alert('Кількість точок повинна бути від 2 до 15.');
                return;
            }
        }
        points = awp.sortPoints(points);
        const duplicates = awp.checkDuplicatePoints(points);
        if (duplicates.length > 0) {
            alert('Помилка! Знайдено однакові точки');
            return;
        }
        if (method === 'cubic' || method === 'newton') {
            const xValues = points.map(p => p.x);
            const uniqueXValues = new Set(xValues);
            if (uniqueXValues.size !== xValues.length) {
                alert('Не можна побудувати інтерполяцію, тому що є однакові координати X.');
                return;
            }
        }
        let interpolatedPoints = [];
        let complexityCount = 0;
        if (method === 'linear') {
            [interpolatedPoints, complexityCount] = this.linearInterpolation(points);
            this.displayLinearPolynomial(points);
        } else if (method === 'cubic') {
            interpolatedPoints = this.cubicSplineInterpolation(points);
        } else if (method === 'newton') {
            [interpolatedPoints, complexityCount] = this.newtonInterpolation(points);
        }
        awc.drawChart(points, interpolatedPoints);
        this.displayComplexity(method, points.length, complexityCount);
    }
    linearInterpolation(points) {
        const interpolatedPoints = [];
        let complexityCount = 0;
        for (let i = 0; i < points.length - 1; i++) {
            const x0 = points[i].x;
            const y0 = points[i].y;
            const x1 = points[i + 1].x;
            const y1 = points[i + 1].y;
            interpolatedPoints.push({ x: x0, y: y0 });
            complexityCount += 1;
            for (let x = x0 + 1; x < x1; x++) {
                const y = y0 + (y1 - y0) * (x - x0) / (x1 - x0);
                interpolatedPoints.push({ x, y });
                complexityCount += 5;
            }
        }
        interpolatedPoints.push(points[points.length - 1]);
        complexityCount += 1;
        this.displayLinearPolynomial(points);
        return [interpolatedPoints, complexityCount];
    }
    displayLinearPolynomial(points) {
        let polynomial = '';
        for (let i = 0; i < points.length - 1; i++) {
            const x0 = points[i].x;
            const y0 = points[i].y;
            const x1 = points[i + 1].x;
            const y1 = points[i + 1].y;
            const slope = (y1 - y0) / (x1 - x0);
            const intercept = y0 - slope * x0;
            polynomial += `L_{${i+1}}(x) = ${slope.toFixed(10)}x ${intercept >= 0 ? '+' : '-'} ${Math.abs(intercept.toFixed(10))}`;
            if (i < points.length - 2) {
                polynomial += ';\n';
            }
        }
        console.log(polynomial);
        document.getElementById('polynomialDisplay').innerHTML = `\\[${polynomial}\\]`;
        MathJax.typeset();
    }
    newtonInterpolation(points) {
        const n = points.length;
        const coefficients = this.dividedDifferences(points);
        const interpolatedPoints = [];
        let complexityCount = 0;
        for (let x = points[0].x; x <= points[n - 1].x; x += 0.1) {
            let y = coefficients[0];
            complexityCount++;
            for (let i = 1; i < n; i++) {
                let term = coefficients[i];
                complexityCount++;
                for (let j = 0; j < i; j++) {
                    term *= (x - points[j].x);
                    complexityCount += 2;
                }
                y += term;
                complexityCount++;
            }
            interpolatedPoints.push({ x, y });
        }
        this.displayNewtonPolynomial(coefficients, points);
        return [interpolatedPoints, complexityCount];
    }
    dividedDifferences(points) {
        const n = points.length;
        const table = Array.from({ length: n }, () => Array(n).fill(0));
        let complexityCount = 0;
        for (let i = 0; i < n; i++) {
            table[i][0] = points[i].y;
            complexityCount++;
        }
        for (let j = 1; j < n; j++) {
            for (let i = 0; i < n - j; i++) {
                table[i][j] = (table[i + 1][j - 1] - table[i][j - 1]) / (points[i + j].x - points[i].x);
                complexityCount += 3;
            }
        }
        return table[0];
    }
    displayNewtonPolynomial(coefficients, points) {
        const n = coefficients.length;
        let expandedPolynomial = Array(n).fill(0);
        const multiplyAndAdd = (termCoeffs, factor) => {
            const newCoeffs = Array(n).fill(0);
            for (let i = 0; i < termCoeffs.length; i++) {
                if (termCoeffs[i] !== 0) {
                    for (let j = 0; j < factor.length; j++) {
                        if (i + j < n) {
                            newCoeffs[i + j] += termCoeffs[i] * factor[j];
                        }
                    }
                }
            }
            return newCoeffs;
        };
        expandedPolynomial[0] = coefficients[0];
        for (let i = 1; i < n; i++) {
            let termCoeffs = Array(n).fill(0);
            termCoeffs[0] = coefficients[i];
            for (let j = 0; j < i; j++) {
                let factor = Array(n).fill(0);
                factor[0] = -points[j].x;
                factor[1] = 1;
                termCoeffs = multiplyAndAdd(termCoeffs, factor);
            }
            expandedPolynomial = expandedPolynomial.map((val, idx) => val + termCoeffs[idx]);
        }
        let polynomial = 'P(x) = ';
        let terms = [];
        for (let i = n - 1; i >= 0; i--) {
            if (expandedPolynomial[i] !== 0) {
                let term = '';
                if (expandedPolynomial[i] < 0) {
                    term += ' - ';
                } else if (terms.length > 0) {
                    term += ' + ';
                }
                term += `${Math.abs(expandedPolynomial[i].toFixed(10))}`;
                if (i > 0) {
                    term += 'x';
                    if (i > 1) {
                        term += `^{${i}}`;
                    }
                }
                terms.push(term);
            }
        }
        polynomial += terms.join('');
        console.log(polynomial);
        document.getElementById('polynomialDisplay').innerHTML = `\\[${polynomial}\\]`;
        MathJax.typeset();
    }
    displayComplexity(method, numPoints, complexityCount) {
        const complexityDisplay = document.getElementById('complexityDisplay');
        complexityDisplay.innerText = `Кількість точок: ${numPoints}, Кількість операцій: ${complexityCount}`;
    }
}
class actionWithChart
{
    saveChart() {
        const pointsForm = document.getElementById('pointsForm');
        if (pointsForm.children.length === 0) {
            alert('Введіть точки перед збереженням графіку.');
            return;
        }
        const canvas = document.getElementById('interpolationChart');
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'graphic.png';
        link.click();
    }
    drawChart(originalPoints, interpolatedPoints) {
        const ctx = document.getElementById('interpolationChart').getContext('2d');

        if (window.chart) {
            window.chart.destroy();
        }

        window.chart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Оригінальні точки',
                    data: originalPoints,
                    borderColor: 'blue',
                    backgroundColor: 'blue',
                    showLine: false,
                    pointRadius: 5
                }, {
                    label: 'Інтерпольовані точки',
                    data: interpolatedPoints,
                    borderColor: 'red',
                    backgroundColor: 'transparent',
                    fill: false,
                    showLine: true,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'xy'
                        },
                        zoom: {
                            wheel: {
                                enabled: true,
                            },
                            pinch: {
                                enabled: true
                            },
                            mode: 'xy',
                            rangeMin: {
                                x: -200,
                                y: -200
                            },
                            rangeMax: {
                                x: 200,
                                y: 200
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `(${context.raw.x.toFixed(2)}, ${context.raw.y.toFixed(2)})`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'X'
                        },
                        min: -150,
                        max: 150,
                        grid: {
                            borderColor: 'black',
                            borderWidth: 2
                        }
                    },
                    y: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'Y'
                        },
                        min: -150,
                        max: 150,
                        grid: {
                            borderColor: 'black',
                            borderWidth: 2
                        }
                    }
                }
            }
        });
    }
}
const awp = new ActionWithPoints();
const ui = new UI();
const interp = new Interpolator();
const awc = new actionWithChart();
