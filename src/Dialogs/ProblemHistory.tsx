import {
  Dialog,
  DialogContent,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Table,
  CircularProgress,
  Box,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IProblem } from "../Model";
import { useUser } from "../Context/useUser";

export type ProblemHistoryDialogProps = {
  open: boolean;
  onClose: (takeAction: boolean) => void;
  problem: IProblem;
  loading: boolean;
  problemsHistory: IProblem[];
  onShowLogs: (problemId: number) => void;
};

export function ProblemHistoryDialog({
  open,
  onClose,
  problem,
  loading,
  problemsHistory,
  onShowLogs,
}: ProblemHistoryDialogProps) {
  const { workers } = useUser();

  return (
    <Dialog
      dir="rtl"
      sx={{ textAlign: "right" }}
      fullWidth
      onClose={onClose}
      maxWidth="lg"
      open={open}
      PaperProps={{ sx: { borderRadius: 6, maxWidth: "90%" } }}
    >
      <DialogContent sx={{ p: 0, borderRadius: 0 }}>
        {loading ? (
          <Box
            sx={{
              p: 6,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <div>
            <TableContainer>
              <Table
                aria-label="תקלות"
                sx={{
                  "& .MuiTableCell-body": {
                    fontWeight: 400,
                    fontSize: "16px",
                    textAlign: "center",
                    background: "#FEFEFE",
                  },

                  "& .MuiTableCell-head": {
                    background: "#E0E0E0",

                    fontWeight: 700,
                    fontSize: "24px",
                    textAlign: "center",
                  },
                  "& .MuiTableRow-root:hover": {
                    backgroundColor: "#E0E0E0",
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>סטאטוס</TableCell>
                    <TableCell>תאריך</TableCell>
                    <TableCell>יוצר</TableCell>
                    <TableCell>טלפון</TableCell>
                    <TableCell>מקום</TableCell>
                    <TableCell>לקוח</TableCell>
                    <TableCell>תקלה</TableCell>
                    <TableCell>פתרון</TableCell>
                    <TableCell>מחלקה</TableCell>
                    <TableCell>מעדכן</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workers &&
                    problemsHistory.map((p: IProblem) => {
                      return (
                        <TableRow key={p.id} hover>
                          <TableCell>{p.statusName}</TableCell>
                          <TableCell>
                            <div>
                              {`${new Date(p!.startTimeEN)
                                .getDate()
                                .toString()
                                .padStart(2, "0")}/${(
                                new Date(p!.startTimeEN).getMonth() + 1
                              )
                                .toString()
                                .padStart(2, "0")}/${new Date(
                                p!.startTimeEN
                              ).getFullYear()} ${new Date(p!.startTimeEN)
                                .getHours()
                                .toString()
                                .padStart(2, "0")}:${new Date(p!.startTimeEN)
                                .getMinutes()
                                .toString()
                                .padStart(2, "0")}`}
                            </div>
                          </TableCell>
                          <TableCell>{p.workerCreateName}</TableCell>
                          <TableCell>{p.phone}</TableCell>
                          <TableCell>{p.placeName}</TableCell>
                          <TableCell>{p.customerName}</TableCell>
                          <TableCell>{p.desc}</TableCell>
                          <TableCell>{p.solution}</TableCell>
                          <TableCell>{p.departmentName}</TableCell>
                          <TableCell>{p.updaterWorkerName}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => {
                                if (problem) onShowLogs(p.id);
                              }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
