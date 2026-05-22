import type { Result } from "../types";
import { PRICE_LIMITS, SETTINGS } from "../constants";
import { clamp, formatNumber, parseMoney, progress } from "../utils";
import { MoneySliderField } from "./MoneySliderField";
import { TermStepper } from "./TermStepper";
import { MarkupSliderField } from "./MarkupSliderField";

type Props = {
  price: string;
  setPrice: (v: string) => void;
  term: number;
  setTerm: (v: number) => void;
  markupPercent: number;
  setMarkupPercent: (v: number) => void;
  downPayment: string;
  setDownPayment: (v: string) => void;
  result: Result;
  markupRangeValue: number;
  markupProgress: number;
};

export function InputCard({
  price,
  setPrice,
  term,
  setTerm,
  markupPercent,
  setMarkupPercent,
  downPayment,
  setDownPayment,
  result,
  markupRangeValue,
  markupProgress,
}: Props) {
  const numericPrice = clamp(parseMoney(price), PRICE_LIMITS.min, PRICE_LIMITS.max);
  const priceProgress = progress(numericPrice, PRICE_LIMITS.min, PRICE_LIMITS.max);
  const downProgress = progress(result.downPayment, result.minDown, result.maxDown);

  function syncMinDown(nextPrice: number) {
    const nextMinDown = Math.ceil((nextPrice * SETTINGS.minDownRate) / SETTINGS.roundStep) * SETTINGS.roundStep;
    setDownPayment(formatNumber(nextMinDown));
  }

  function handlePriceBlur() {
    const next = clamp(parseMoney(price), PRICE_LIMITS.min, PRICE_LIMITS.max);
    setPrice(formatNumber(next));
    syncMinDown(next);
  }

  function handlePriceRange(value: string) {
    const next = Number(value);
    setPrice(formatNumber(next));
    syncMinDown(next);
  }

  function handleDownBlur() {
    setDownPayment(formatNumber(result.downPayment));
  }

  return (
    <div className="input-card">
      <MoneySliderField
        id="price"
        label="Стоимость товара"
        value={price}
        numericValue={numericPrice}
        sliderMin={PRICE_LIMITS.min}
        sliderMax={PRICE_LIMITS.max}
        sliderStep={1000}
        sliderProgress={priceProgress}
        onChange={(v) => setPrice(formatNumber(parseMoney(v)))}
        onBlur={handlePriceBlur}
        onRangeChange={handlePriceRange}
      />

      <div className="field-divider" />

      <TermStepper
        term={term}
        onDecrement={() => setTerm(Math.max(term - 1, 1))}
        onIncrement={() => setTerm(Math.min(term + 1, 120))}
      />

      <div className="field-divider" />

      <MarkupSliderField
        value={markupPercent}
        rangeValue={markupRangeValue}
        rangeProgress={markupProgress}
        onChange={setMarkupPercent}
      />

      <div className="field-divider" />

      <MoneySliderField
        id="down"
        label="Первоначальный взнос"
        value={downPayment}
        numericValue={result.downPayment}
        sliderMin={result.minDown}
        sliderMax={result.maxDown}
        sliderStep={SETTINGS.roundStep}
        sliderProgress={downProgress}
        onChange={(v) => setDownPayment(formatNumber(parseMoney(v)))}
        onBlur={handleDownBlur}
        onRangeChange={(v) => setDownPayment(formatNumber(Number(v)))}
      />
    </div>
  );
}
