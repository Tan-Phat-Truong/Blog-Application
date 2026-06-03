import { history } from "@/functions/history";
import { SummaryItem } from "./SummaryItem";
import { type Post } from "@repo/db/data";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export async function HistoryList({
  selectedYear,
  selectedMonth,
  posts,
}: {
  selectedYear?: string;
  selectedMonth?: string;
  posts: Post[];
}) {
  const historyItems = history(posts);

  return (
    <div>
      <h3>History</h3>
      {historyItems.map((item) => {
  const name = `${months[item.month - 1]}, ${item.year}`; 
  const link = `/history/${item.year}/${item.month}`;

  const isSelected =
    selectedYear === item.year.toString() &&
    selectedMonth === item.month.toString();

  return (
    <SummaryItem
      key={link}
      name={name}
      link={link}
      count={item.count}
      isSelected={isSelected}
      title={`History / ${name}`}
    />
  );
})}
    </div>
  );
}