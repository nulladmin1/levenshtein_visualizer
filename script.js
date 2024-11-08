document.addEventListener('DOMContentLoaded', function() {
    const coloschemeselector = document.getElementById('colorschemeselector');
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setColorScheme('dark');
        coloschemeselector.value = 'dark';
    }

    coloschemeselector.addEventListener('change', function() {
        setColorScheme(this.value);
    });
});

function setColorScheme(scheme) {
    document.documentElement.className = scheme;
    localStorage.setItem('colorscheme', scheme);
}

const savedScheme = localStorage.getItem('colorscheme');
if (savedScheme) {
    setColorScheme(savedScheme);
    document.getElementById('colorschemeselector').value = savedScheme;
}

function levenshteinMatrix() {
    const string1 = document.getElementById('string1').value;
    const string2 = document.getElementById('string2').value;
    
    const n = string1.length;
    const m = string2.length;

    matrix = Array(n+1).fill().map(() => Array(m+1).fill(0));
    
    for (let i = 0; i <= n; i++) 
        matrix[i][0] = i;
    for (let j = 0; j <= m; j++) 
        matrix[0][j] = j;

    const matrix_html = document.getElementById('matrix');
    matrix_html.innerHTML = '';

    const cols = m + 1;
    const colwidth = "30px";

    matrix_html.style.gridTemplateColumns = `repeat(${cols}, ${colwidth})`;

    for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= m; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.textContent = matrix[i][j];
            matrix_html.appendChild(cell);
        }
    }

    runCalculations(string1, string2, matrix);
} 

async function runCalculations(string1, string2, matrix) {
    const cells = document.querySelectorAll('.cell');
    const n = string1.length;
    const m = string2.length;

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            await new Promise(resolve => setTimeout(resolve, 150));

            const sub_cost = string1[i - 1] === string2[j - 1] ? 0 : 1;
            const min_cost = Math.min(
                matrix[i-1][j] + 1,
                matrix[i][j-1] + 1,
                matrix[i-1][j-1] + sub_cost
            );

            matrix[i][j] = min_cost;
            cells[i * (m + 1) + j].textContent = min_cost;
            cells[i * (m + 1) + j].classList.add('highlight');

            await new Promise(resolve => setTimeout(resolve, 200));
            cells[i * (m + 1) + j].classList.remove('highlight');
        }
    }

    document.getElementById('result').textContent = `Levenshtein distance: ${matrix[n][m]}`;
}