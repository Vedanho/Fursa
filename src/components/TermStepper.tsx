import { paymentWord } from "../utils";

type Props = {
  term: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export function TermStepper({ term, onIncrement, onDecrement }: Props) {
  return (
    <div className="field-group">
      <div className="label-row">
        <label className="field-label">Количество платежей</label>
        <output className="term-badge">
          {term} {paymentWord(term)}
        </output>
      </div>
      <div className="term-stepper">
        <button className="stepper-btn" aria-label="Уменьшить" onClick={onDecrement}>
          −
        </button>
        <span className="stepper-value">
          {term} {paymentWord(term)}
        </span>
        <button className="stepper-btn stepper-btn--plus" aria-label="Увеличить" onClick={onIncrement}>
          +
        </button>
      </div>
    </div>
  );
}
