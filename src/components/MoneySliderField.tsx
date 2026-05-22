type Props = {
  id: string;
  label: string;
  value: string;
  numericValue: number;
  sliderMin: number;
  sliderMax: number;
  sliderStep?: number;
  sliderProgress: number;
  onChange: (value: string) => void;
  onBlur: () => void;
  onRangeChange: (value: string) => void;
};

export function MoneySliderField({
  id,
  label,
  value,
  numericValue,
  sliderMin,
  sliderMax,
  sliderStep = 100,
  sliderProgress,
  onChange,
  onBlur,
  onRangeChange,
}: Props) {
  return (
    <div className="field-group">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <div className="money-slider-field">
        <div className="money-field">
          <input
            id={id}
            inputMode="numeric"
            type="text"
            value={value}
            onBlur={onBlur}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          />
          <span>₽</span>
        </div>
        <input
          aria-label={label}
          className="money-range"
          min={sliderMin}
          max={sliderMax}
          step={sliderStep}
          type="range"
          value={numericValue}
          onChange={(e) => onRangeChange(e.target.value)}
          style={{
            background: `linear-gradient(to right, var(--slider) 0%, var(--slider) ${sliderProgress}%, var(--border) ${sliderProgress}%, var(--border) 100%)`,
          }}
        />
      </div>
    </div>
  );
}
