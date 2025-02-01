const API_URL = "https://api.exchangerate-api.com/v4/latest/BRL";

const form = document.querySelector("form");
const amount = document.getElementById("amount");
const currency = document.getElementById("currency");
const footer = document.querySelector("main footer");
const description = document.getElementById("description");
const result = document.getElementById("result");

amount.addEventListener("input", () => {
  amount.value = amount.value.replace(/\D+/g, "");
});

async function fetchExchangeRates() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erro ao buscar taxas de câmbio");
    return await response.json();
  } catch (error) {
    console.error("Erro na API:", error);
    alert(
      "Não foi possível obter as taxas de câmbio. Tente novamente mais tarde."
    );
    return null;
  }
}

form.onsubmit = async (event) => {
  event.preventDefault();
  const exchangeData = await fetchExchangeRates();
  if (!exchangeData) return;

  const rates = exchangeData.rates;
  const selectedCurrency = currency.value;
  const rate = 1 / rates[selectedCurrency];

  if (!rate) {
    alert("Moeda não suportada");
    return;
  }

  convertCurrency(amount.value, rate, selectedCurrency);
};

function convertCurrency(amount, price, symbol) {
  try {
    description.textContent = `${symbol} 1 = ${formatCurrencyBRL(price)}`;
    let total = amount * price;

    if (isNaN(total)) {
      alert("Por favor, digite o valor corretamente para converter.");
      return;
    }

    result.textContent = `${formatCurrencyBRL(total)} Reais`;
    footer.classList.add("show-result");
  } catch (error) {
    footer.classList.remove("show-result");
    console.error(error);
    alert("Não foi possível converter. Tente novamente mais tarde.");
  }
}

function formatCurrencyBRL(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
