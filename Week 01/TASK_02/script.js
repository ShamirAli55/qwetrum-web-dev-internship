let allCountries = [];
const user_search = document.getElementById("srch");
const container = document.getElementById("container");
const loader = document.getElementById("loader");

async function loadData() {
  try {
    loader.style.display = "block";
    container.style.display = "none";

    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,flags,population",
    );

    const data = await res.json();

    allCountries = data;
    renderCountries(allCountries.slice(0, 10));
  } catch (e) {
    loader.innerHTML = "Failed to load Countries ...";
    container.style.display = "none";
    return;
  }

  loader.style.display = "none";
  container.style.display = "grid";
}
user_search.addEventListener("input", (e) => {
  console.log(e.target.value);
  let value = e.target.value.toLowerCase();
  const filtered = allCountries.filter((country) => {
    return country.name.official.toLowerCase().includes(value);
  });
  //   console.log(filtered);
  renderCountries(filtered);
});

function renderCountries(list) {
  let html = "";
  if (list.length === 0) {
    container.innerHTML = "<p>No countries found</p>";
    return;
  }
  for (let i = 0; i < list.length; i++) {
    html += `
      <div class='card'>
        <img src="${list[i].flags.png}" alt="${list[i].name.official}"/>
        <h1>${list[i].name.official}</h1>
        <p>Population: ${list[i].population}</p>
      </div>
    `;
  }

  container.innerHTML = html;
}

loadData();
