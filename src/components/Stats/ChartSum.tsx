import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { IStats } from '../../Model/IStats';

export interface Props {
  stats: IStats[];
}

export default function ChartSum({ stats }: Props) {
  const [data, setData] = useState<IStats[]>([]);

  useEffect(() => {
    stats.sort((a: IStats, b: IStats) => {
      return a.totalProblems > b.totalProblems ? -1 : 1;
    });

    // console.log(stats);
    setData(stats);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats]);

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <BarChart width={1600} height={300} data={data}>
        <XAxis dataKey="workerName" stroke="black" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <Bar dataKey="totalProblems" fill="#8884d8" barSize={30} />
      </BarChart>
    </div>
  );
}
