import { MARKUP_LIMITS } from "../constants";

type Props = {
  value: number;
  rangeValue: number;
  rangeProgress: number;
  onChange: (value: number) => void;
};

export function MarkupSliderField({ value, rangeValue, rangeProgress, onChange }: Props) {
  return (
    <div className="field-group">
      <div className="label-row">
        <label className="field-label" htmlFor="custom-markup">
          Наценка
        </label>
        <output className="term-badge" htmlFor="custom-markup">
          {value.toLocaleString("ru-RU", { maximumFractionDigits: 1 })}%
        </output>
      </div>
      <div className="markup-slider-field">
        <div className="markup-field">
          <input
            id="custom-markup"
            inputMode="decimal"
            min={MARKUP_LIMITS.min}
            step={MARKUP_LIMITS.step}
            type="number"
            value={value}
            onChange={(e) => onChange(Math.max(Number(e.target.value) || 0, MARKUP_LIMITS.min))}
          />
          <span>%</span>
        </div>
        <input
          aria-label="Наценка"
          className="money-range"
          max={MARKUP_LIMITS.rangeMax}
          min={MARKUP_LIMITS.min}
          step={MARKUP_LIMITS.step}
          type="range"
          value={rangeValue}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, var(--slider) 0%, var(--slider) ${rangeProgress}%, var(--border) ${rangeProgress}%, var(--border) 100%)`,
          }}
        />
      </div>
    </div>
  );
}
