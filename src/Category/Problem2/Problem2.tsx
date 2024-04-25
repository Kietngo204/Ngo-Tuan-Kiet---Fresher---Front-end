import axios from "axios";
import "./problem.css";
import { useEffect, useState } from "react";

interface CurrencyData {
  currency: string;
  date: string;
  price: number;
}

const Problem2 = () => {
  const [currently, setCurrently] = useState<CurrencyData[]>([]);
  const [amountToSend, setAmountToSend] = useState<string>("");
  const [fromCurrency, setFromCurrency] = useState<string>("");
  const [toCurrency, setToCurrency] = useState<string>("");
  const [convertedAmount, setConvertedAmount] = useState<string>("");

  const getCurrency = async () => {
    try {
      const response = await axios({
        url: "https://interview.switcheo.com/prices.json",
        method: "GET",
      });
      return response.data;
    } catch (err: any) {
      throw err;
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (fromCurrency && toCurrency && amountToSend) {
      // Tìm giá trị của tiền tệ ban đầu và tiền tệ đích từ dữ liệu fetched
      const fromCurrencyData = currently.find(
        (currency) => currency.currency === fromCurrency
      );
      const toCurrencyData = currently.find(
        (currency) => currency.currency === toCurrency
      );
      if (fromCurrencyData && toCurrencyData) {
        // Tính toán tỷ lệ chuyển đổi
        const exchangeRate = toCurrencyData.price / fromCurrencyData.price;
        // Tính toán số tiền chuyển đổi
        const convertedValue = parseFloat(amountToSend) * exchangeRate;
        // Hiển thị kết quả
        setConvertedAmount(convertedValue.toFixed(2));
      }
    }
  };

  useEffect(() => {
    getCurrency()
      .then((res: any) => {
        setCurrently(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  console.log(currently);
  return (
    <div className="problem2">
      <div className="input-section">
        <form onSubmit={handleSubmit}>
          <label>
            Amount to send:
            <input
              type="text"
              name="amountToSend"
              value={amountToSend}
              onChange={(e) => setAmountToSend(e.target.value)}
            />
          </label>
          <label>
            From Currency:
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              <option value="">Select currency</option>
              {currently.map((currency) => (
                <option key={currency.currency} value={currency.currency}>
                  {currency.currency}
                </option>
              ))}
            </select>
          </label>
          <label>
            To Currency:
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              <option value="">Select currency</option>
              {currently.map((currency) => (
                <option key={currency.currency} value={currency.currency}>
                  {currency.currency}
                </option>
              ))}
            </select>
          </label>
          <input type="submit" value="Convert" />
        </form>
      </div>
      <div className="output-section">
        <div>
          Converted Amount:{" "}
          <input type="text" value={convertedAmount} readOnly />
        </div>
      </div>
    </div>
  );
};

export default Problem2;
