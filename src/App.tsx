import { useMemo, useRef, useState } from "react";
import "./App.css";

import { MARKUP_LIMITS, SETTINGS } from "./constants";
import { calculate, buildSchedule, formatMoney, formatNumber, parseMoney, progress, paymentWord } from "./utils";
import { Header } from "./components/Header";
import { InputCard } from "./components/InputCard";
import { ResultsCard } from "./components/ResultsCard";
import { SummaryCard } from "./components/SummaryCard";

function App() {
  const [price, setPrice] = useState(formatNumber(100_000));
  const [downPayment, setDownPayment] = useState(formatNumber(0));
  const [term, setTerm] = useState(6);
  const [markupPercent, setMarkupPercent] = useState(20);
  const [copyStatus, setCopyStatus] = useState("");
  const timeoutRef = useRef<number | null>(null);

  const markupRate = markupPercent / 100;
  const result = useMemo(
    () => calculate(parseMoney(price), parseMoney(downPayment), term, markupRate),
    [price, downPayment, term, markupRate],
  );

  const markupRangeValue = Math.min(markupPercent, MARKUP_LIMITS.rangeMax);
  const markupProgress = progress(markupRangeValue, MARKUP_LIMITS.min, MARKUP_LIMITS.rangeMax);

  const whatsAppText = `Здравствуйте! Интересует рассрочка:

Стоимость товара: ${formatMoney(result.price)}
Срок: ${term} ${paymentWord(term)}
Первоначальный взнос: ${formatMoney(result.downPayment)}
Ежемесячный платеж: ${formatMoney(result.monthly)}
Итого: ${formatMoney(result.total)}`;
  const whatsAppUrl = `https://wa.me/${SETTINGS.whatsAppPhone}?text=${encodeURIComponent(whatsAppText)}`;

  async function copySchedule() {
    const text = buildSchedule(result);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.top = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopyStatus("График скопирован");
    } catch {
      setCopyStatus("Не удалось скопировать");
    }
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopyStatus(""), 1800);
  }

  return (
    <main className="app-shell">
      <section className="calculator" aria-label="Калькулятор рассрочки">
        <Header />

        <p className="calc-title">Калькулятор рассрочки</p>

        <InputCard
          price={price}
          setPrice={setPrice}
          term={term}
          setTerm={setTerm}
          markupPercent={markupPercent}
          setMarkupPercent={setMarkupPercent}
          downPayment={downPayment}
          setDownPayment={setDownPayment}
          result={result}
          markupRangeValue={markupRangeValue}
          markupProgress={markupProgress}
        />

        <ResultsCard
          monthly={result.monthly}
          term={term}
          copyStatus={copyStatus}
          onCopy={copySchedule}
        />

        <SummaryCard result={result} />

        <p className="calculation-note">
          Расчет предварительный. Итоговые условия подтверждает менеджер.
        </p>

        <a className="whatsapp-link" href={whatsAppUrl} rel="noreferrer" target="_blank">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Отправить расчет в WhatsApp
        </a>
      </section>
    </main>
  );
}

export default App;
