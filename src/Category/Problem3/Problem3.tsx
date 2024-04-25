import { useMemo } from "react";
import WalletRow from "./WalletRow";
import classes from "./wallet.module.css";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Thêm trường blockchain vào giao diện WalletBalance
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

// Sửa Props interface
interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

// Định nghĩa hàm sử dụng để lấy dữ liệu các tài khoản trong ví
const useWalletBalances = () => {
  // Thực hiện yêu cầu HTTP hoặc gọi API để lấy dữ liệu
  // Trả về một mảng các tài khoản và số dư tương ứng
  return [
    { currency: "ETH", amount: 10, blockchain: "Ethereum" },
    { currency: "BTC", amount: 5, blockchain: "Bitcoin" },
    // Các tài khoản khác...
  ];
};

interface Prices {
  [key: string]: number; // Thêm kiểu phổ biến để cho phép truy cập bằng chuỗi
}

// Định nghĩa hàm sử dụng để lấy dữ liệu giá cả của các loại tiền tệ
const usePrices = (): Prices => {
  // Thực hiện yêu cầu HTTP hoặc gọi API để lấy dữ liệu
  // Trả về một đối tượng, trong đó khóa là mã tiền tệ và giá trị là giá tương ứng
  return {
    ETH: 2000,
    BTC: 60000,
    // Các mã tiền tệ khác...
  };
};

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
      case "Neo": // Gộp 2 case có cùng mức ưu tiên
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        if (balancePriority > -99) {
          // Sửa từ lhsPriority thành balancePriority
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        } else {
          return 0; // Thêm trường hợp trả về 0 khi cả hai mức ưu tiên bằng nhau
        }
      });
  }, [balances, prices, getPriority]); // Thêm getPriority vào danh sách dependency

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  const rows = sortedBalances.map((balance: WalletBalance, index: number) => {
    const formattedBalance = formattedBalances.find(
      (b) => b.currency === balance.currency
    ); // Tìm kiếm balance tương ứng trong formattedBalances
    if (formattedBalance) {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={balance.currency}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={formattedBalance.formatted} // Sử dụng trường formatted từ formattedBalance
        />
      );
    } else {
      return null; // Xử lý trường hợp không tìm thấy balance tương ứng trong formattedBalances
    }
  });

  return <div {...rest}>{rows}</div>;
};

export default WalletPage;
