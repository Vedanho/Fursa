import type { Result } from "../types";
import { formatMoney } from "../utils";

type Props = {
  result: Result;
};

export function SummaryCard({ result }: Props) {
  const overpay = Math.max(result.total - result.price, 0);

  return (
    <div className="summary-card">
      <dl className="result-list">
        <div className="total-row">
          <dt>Итого</dt>
          <dd>{formatMoney(result.total)}</dd>
        </div>
        <div>
          <dt>Стоимость товара</dt>
          <dd>{formatMoney(result.price)}</dd>
        </div>
        <div>
          <dt>Взнос</dt>
          <dd>{formatMoney(result.downPayment)}</dd>
        </div>
        {result.downPayment > 0 && (
          <div>
            <dt>Остаток</dt>
            <dd>{formatMoney(result.rest)}</dd>
          </div>
        )}
        <div>
          <dt>Переплата</dt>
          <dd>{formatMoney(overpay)}</dd>
        </div>
      </dl>
    </div>
  );
}
