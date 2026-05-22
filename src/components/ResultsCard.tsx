import { formatMoney, paymentWord } from "../utils";

type Props = {
  monthly: number;
  term: number;
  copyStatus: string;
  onCopy: () => void;
};

export function ResultsCard({ monthly, term, copyStatus, onCopy }: Props) {
  return (
    <section
      className="results-card"
      role="button"
      tabIndex={0}
      aria-label="Скопировать график платежей"
      onClick={onCopy}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCopy();
        }
      }}
    >
      <span className="results-label">Ежемесячный платеж</span>
      <strong className="results-amount">{formatMoney(monthly)}</strong>
      <small className="results-term">
        × {term} {paymentWord(term)}
      </small>
      <div className="copy-btn" aria-live="polite">
        {copyStatus || "Нажмите, чтобы скопировать график"}
      </div>
    </section>
  );
}
