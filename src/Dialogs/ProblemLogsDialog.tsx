import { Button, Dialog, DialogContent } from "@mui/material";
import { IProblemLog } from "../Model";
import "./ProblemLogsDialog.styles.css";

type Props = {
  onClose: () => void;
  showLogs: boolean;
  logs: IProblemLog[];
};

const ProblemLogsDialog = ({ onClose, showLogs, logs }: Props) => {
  return (
    <Dialog
      fullWidth
      onClose={onClose}
      maxWidth="lg"
      open={showLogs}
    >
      <DialogContent sx={{ padding: 0}}>
        <div className="dialogContainer">
          <div className="header">
            <div className="item-1">עובד מעדכן</div>
            <div className="item-2">שם השדה</div>
            <div className="item-3">ערך ישן</div>
            <div className="item-4">ערך חדש</div>
            <div className="item-5">תאריך</div>
          </div>
          {logs.map((log: IProblemLog) => {
            return (
              <div
                key={log.commitTime}
                className="data"
                style={{ border: "1px black solid" }}
              >
                <div className="item-1">{log.workerName}</div>
                <div className="item-2">{log.fieldName}</div>
                <div className="item-3">{log.oldValue}</div>
                <div className="item-4">{log.newValue}</div>
                <div className="item-5">{log.commitTime}</div>
              </div>
            );
          })}
          <div style={{ textAlign: "center" }}>
            <Button variant="contained" onClick={onClose}>
              סגור
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProblemLogsDialog;
