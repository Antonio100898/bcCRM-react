import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { IWorker } from "../../Model";
import WorkersHeader from "../../components/Workers/WorkersHeader";
import { useUser } from "../../Context/useUser";
import { workerService } from "../../API/services";

export default function WorkersCars() {
  const { updateShowLoader } = useUser();
  const [workerCars, setWorkersCars] = useState<IWorker[]>([]);

  const fetchWorkersCars = async () => {
    updateShowLoader(true);
    try {
      const data = await workerService.getWorkersCars();
      if (data?.d.success) setWorkersCars(data.d.workers);
    } catch (error) {
      console.error(error);
    }

    updateShowLoader(false);
  };

  useEffect(() => {
    fetchWorkersCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <WorkersHeader />

      <h2>מכוניות לעובדים</h2>

      <div>
        <TableContainer sx={{ maxHeight: 800 }}>
          <Table
            stickyHeader
            aria-label="תקלות"
            sx={{
              "& .MuiTableRow-root:hover": {
                backgroundColor: "primary.light",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell align="right">עובד</TableCell>
                <TableCell align="right">רכב</TableCell>
                <TableCell align="right">מספר רכב</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workerCars?.map((worker: IWorker) => {
                return (
                  <TableRow key={worker.Id} hover>
                    <TableCell align="right">{worker.workerName}</TableCell>
                    <TableCell align="right">{worker.carType}</TableCell>
                    <TableCell align="right">{worker.carNumber}</TableCell>
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
