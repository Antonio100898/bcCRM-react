import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { IStats } from "../../../Model";
import ChartHours from "../../../components/Stats/ChartHours";
import ChartSum from "../../../components/Stats/ChartSum";
import { useUser } from "../../../Context/useUser";
import { statisticService } from "../../../API/services/statisticService";

export default function Stats() {
  const { updateShowLoader } = useUser();
  const [stats, setStats] = useState<IStats[]>([]);

  const fetchStats = async () => {
    updateShowLoader(true);
    try {
      const data = await statisticService.getStats();
      if (data?.d.success) setStats(data.d.stats);
    } catch (error) {
      console.error(error);
    }

    updateShowLoader(false);
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2>סטיסטיקה </h2>
      {new Date().toDateString()}
      <div>
        <ChartSum stats={stats} />
      </div>

      <div>
        <ChartHours stats={stats} />
      </div>

      <br />
      <div>
        <TableContainer sx={{ maxHeight: 800 }}>
          <Table
            stickyHeader
            aria-label="סטיסטיקה"
            style={{ textAlign: "center" }}
            sx={{
              "& .MuiTableRow-root:hover": {
                backgroundColor: "primary.light",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell align="center">עובד</TableCell>
                <TableCell align="center">תקלות</TableCell>
                <TableCell align="center">פתוח</TableCell>
                <TableCell align="center">סגור</TableCell>
                <TableCell align="center">שעה שפתח לראשונה</TableCell>
                <TableCell align="center">שעה שסגר לראשונה</TableCell>
                <TableCell align="center">שעה שפתח אחרונה</TableCell>
                <TableCell align="center">שעה שסגר אחרונה</TableCell>
                <TableCell align="center">תקלות שפתח שעליו</TableCell>
                <TableCell align="center">תקלות שפתח שהעביר</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats &&
                stats.map((stat: IStats) => {
                  return (
                    <TableRow key={stat.workerId} hover>
                      <TableCell align="center">{stat.workerName}</TableCell>

                      <TableCell align="center">{stat.totalProblems}</TableCell>

                      <TableCell align="center">{stat.openProblems}</TableCell>

                      <TableCell align="center">{stat.closeProblems}</TableCell>
                      <TableCell align="center">
                        {stat.firstHourOpenProblem}
                      </TableCell>
                      <TableCell align="center">
                        {stat.firstHourCloseProblem}
                      </TableCell>
                      <TableCell align="center">
                        {stat.lastHourOpenProblem}
                      </TableCell>
                      <TableCell align="center">
                        {stat.lastHourCloseProblem}
                      </TableCell>
                      <TableCell align="center">{stat.openAndOnHim}</TableCell>
                      <TableCell align="center">{stat.movedProblems}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
