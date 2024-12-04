const API_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

const tableBody = document.getElementById("table-body");
const searchInput = document.getElementById("search");
const sortMktCapButton = document.getElementById("sortMktCap");
const sortPercentageButton = document.getElementById("sortPercentage");

// Fetch data using async/await
async function fetchData() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    renderTable(data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Fetch data using .then
function fetchDataThen() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      renderTable(data);
      return data;
    })
    .catch((error) => console.error("Error fetching data:", error));
}

// Render data in the table
function renderTable(data) {
  tableBody.innerHTML = data
    .map(
      (coin) => `
      <tr>
        <td><img src="${coin.image}" alt="${coin.name}" width="24" /></td>
        <td>${coin.name}</td>
        <td>${coin.symbol.toUpperCase()}</td>
        <td>$${coin.current_price.toLocaleString()}</td>
        <td>$${coin.total_volume.toLocaleString()}</td>
        <td>${coin.price_change_percentage_24h.toFixed(2)}%</td>
        <td>$${coin.market_cap.toLocaleString()}</td>
      </tr>
    `
    )
    .join("");
}

// Search functionality
searchInput.addEventListener("input", async () => {
  const query = searchInput.value.toLowerCase();
  const data = await fetchData();
  const filteredData = data.filter(
    (coin) =>
      coin.name.toLowerCase().includes(query) ||
      coin.symbol.toLowerCase().includes(query)
  );
  renderTable(filteredData);
});

// Sort by market cap
sortMktCapButton.addEventListener("click", async () => {
  const data = await fetchData();
  const sortedData = data.sort((a, b) => b.market_cap - a.market_cap);
  renderTable(sortedData);
});

// Sort by percentage change
sortPercentageButton.addEventListener("click", async () => {
  const data = await fetchData();
  const sortedData = data.sort(
    (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
  );
  renderTable(sortedData);
});

// Initial load
fetchData();
