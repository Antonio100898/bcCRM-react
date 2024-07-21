import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
} from "@mui/material";
import { useState } from "react";
import { problemService } from "../../API/services";
import { IProblem } from "../../Model";
import dayjs from "dayjs";
import {
  ExcelPlaceProblems,
  PlaceProblemExcel,
} from "../Excel/ExcelPlaceProblems";

const convertMsToHHmm = (ms: number) => {
  const hh = Math.floor(ms / 3600);
  const mm = (ms - hh * 3600) / 60;

  return `${hh.toString().length === 1 ? "0" + hh : hh}:${
    mm.toString().length === 1 ? "0" + mm : mm
  }`;
};

const Info = () => {
  const [placeName, setPlaceName] = useState("");
  const [foundProblems, setFoundProblems] = useState<IProblem[]>();

  const onSearchClick = async () => {
    if (!placeName) return;
    const result = await problemService.searchProblems({
      place: true,
      searchValue: placeName,
      daysBack: 70,
    });
    setFoundProblems(result?.d.problems);
  };

  const onExcel = () => {
    if (!foundProblems || foundProblems.length === 0) return;
    const reportProblems: PlaceProblemExcel[] = foundProblems?.map(
      ({
        desc,
        startTime,
        finishTime,
        updaterWorkerName,
        workerCreateName,
        solution,
        finishTimeEN,
        startTimeEN,
        placeName,
        customerName
      }) => {
        return {
          startTime,
          workerCreateName,
          finishTime,
          updaterWorkerName,
          placeName,
          customerName,
          desc,
          solution,
          totalTime: convertMsToHHmm(
            dayjs(new Date(finishTimeEN)).unix() -
              dayjs(new Date(startTimeEN)).unix()
          ),
        };
      }
    );
    ExcelPlaceProblems.exportFile(reportProblems);
  };

  return (
    <Box sx={{ px: 2 }}>
      <Typography sx={{ mb: 6 }} variant="subtitle1">
        מידע
      </Typography>
      <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
        <TextField
          value={placeName}
          onChange={(e) => setPlaceName(e.currentTarget.value)}
          label="שם המקום"
        />
        <Button variant="contained" onClick={onSearchClick}>
          חפש
        </Button>
      </Box>
      <Button variant="contained" onClick={onExcel}>
        יצוא לאקסל
      </Button>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>תאריך פתיחה</TableCell>
            <TableCell>יוצר</TableCell>
            <TableCell>תאריך סגירה</TableCell>
            <TableCell>מעדכן</TableCell>
            <TableCell>תיאור</TableCell>
            <TableCell>פתרון</TableCell>
            <TableCell>תקופת טיפול</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {foundProblems &&
            foundProblems.map(
              ({
                id,
                startTime,
                finishTime,
                workerCreateName,
                updaterWorkerName,
                desc,
                solution,
                startTimeEN,
                finishTimeEN,
              }) => (
                <TableRow key={id}>
                  <TableCell>{startTime}</TableCell>
                  <TableCell>{workerCreateName}</TableCell>
                  <TableCell>{finishTime}</TableCell>
                  <TableCell>{updaterWorkerName}</TableCell>
                  <TableCell>{desc}</TableCell>
                  <TableCell>{solution}</TableCell>
                  <TableCell>
                    {convertMsToHHmm(
                      dayjs(new Date(finishTimeEN)).unix() -
                        dayjs(new Date(startTimeEN)).unix()
                    )}
                  </TableCell>
                </TableRow>
              )
            )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default Info;
