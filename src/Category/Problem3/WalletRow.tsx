import React from "react";

interface WalletRowProps {
  className: string;
  key: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
}

const WalletRow: React.FC<WalletRowProps> = ({
  className,
  key,
  amount,
  usdValue,
  formattedAmount,
}) => {
  return (
    <div className={className} key={key}>
      <span>Amount: {amount}</span>
      <span>USD Value: {usdValue}</span>
      <span>Formatted Amount: {formattedAmount}</span>
    </div>
  );
};

export default WalletRow;
