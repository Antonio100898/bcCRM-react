import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { api } from '../../API/Api';
import { TOKEN_KEY } from '../../Consts/Consts';
import { IWorker } from '../../Model/IWorker';
import WorkersHeader from '../../components/Workers/WorkersHeader';
import { useUser } from '../../Context/useUser';

export default function WorkersCars() {
  const { updateShowLoader } = useUser();
  const [workers, setWorkers] = useState<IWorker[]>([]);

  function GetWorkers() {
    updateShowLoader(true);

    const workerKey = localStorage.getItem(TOKEN_KEY);
    // console.log("Start GetWorkersCars");
    api
      .post('/GetWorkersCars', {
        workerKey,
      })
      .then(({ data }) => {
        setWorkers(data.d.workers);
        updateShowLoader(false);
      });
  }

  useEffect(() => {
    GetWorkers();
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
              '& .MuiTableRow-root:hover': {
                backgroundColor: 'primary.light',
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
              {workers &&
                workers.map((worker: IWorker) => {
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
