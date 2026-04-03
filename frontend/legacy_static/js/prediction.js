const API_URL = 'http://localhost:5000/api';

document.getElementById('prediction-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const cropType = document.getElementById('crop-type').value;
  const month = parseInt(document.getElementById('month').value);
  const previousSales = parseInt(document.getElementById('previous-sales').value) || 0;

  if (!cropType || !month) {
    alert('Please select crop type and month.');
    return;
  }

  const loader = document.getElementById('prediction-loader');
  const resultBox = document.getElementById('prediction-result');
  const predictBtn = document.getElementById('predict-btn');

  resultBox.classList.remove('visible');
  loader.style.display = 'block';
  predictBtn.disabled = true;

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to use the prediction tool.');
      window.location.href = 'login.html';
      return;
    }

    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ cropType, month, previousSales })
    });

    const result = await response.json();

    if (result.success) {
      const prediction = result.data;

      loader.style.display = 'none';
      predictBtn.disabled = false;

      document.getElementById('prediction-value').textContent = `${prediction.predictedDemand} kg`;
      document.getElementById('suggestion-message').textContent = prediction.suggestion;

      // Render bar graph (Simulated historical for visualization)
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const barData = [];
      const baseDemand = 1000;
      for (let i = 5; i >= 0; i--) {
        const m = ((month - 1 - i + 12) % 12) + 1;
        const val = i === 0 ? prediction.predictedDemand : Math.round(baseDemand * (0.8 + Math.random() * 0.4));
        barData.push({ label: monthNames[m - 1], value: val });
      }

      const maxVal = Math.max(...barData.map(d => d.value), 1);
      const graphEl = document.getElementById('prediction-bar-graph');
      graphEl.innerHTML = barData.map((d) => `
        <div class="bar-item" style="height: ${Math.max((d.value / maxVal) * 100, 5)}%" title="${d.label}: ${d.value} kg"></div>
      `).join('');

      resultBox.classList.add('visible');
      resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      alert(result.error);
      loader.style.display = 'none';
      predictBtn.disabled = false;
    }
  } catch (err) {
    console.error(err);
    alert('Prediction failed. Make sure you are logged in.');
    loader.style.display = 'none';
    predictBtn.disabled = false;
  }
});
