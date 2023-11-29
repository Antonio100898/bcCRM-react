import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { IStats } from "../../Model";

export interface Props {
  stats: IStats[];
}

export default function ChartHours({ stats }: Props) {
  const [data, setData] = useState<IStats[]>([]);

  useEffect(() => {
    stats.sort((a: IStats, b: IStats) => {
      return a.totalProblems > b.totalProblems ? -1 : 1;
    });

    setData(stats);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats]);

  return (
    <div style={{ overflowX: "auto", width: "100%" }}>
      <LineChart width={1600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="כולם" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="totalProblems"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </div>
  );
}
