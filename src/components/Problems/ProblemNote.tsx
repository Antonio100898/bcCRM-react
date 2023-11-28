import './ProblemNote.styles.css';
import { useState } from 'react';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import dayjs from 'dayjs';
import { IProblem } from '../../Model/IProblem';
import { ProblemTypes } from './ProblemTypes';

export type ProblemNoteProps = {
  problem?: IProblem;
  onClick: (pro: IProblem) => void;
  ticketColor: string;
  dense: boolean;
};

export function ProblemNote({
  problem,
  onClick,
  ticketColor,
  dense,
}: ProblemNoteProps) {
  const [showLogs, setShowLogs] = useState(false);

  return (
    <Box dir="rtl">
      <Box
        onClick={() => onClick(problem!)}
        sx={(theme) => ({
          backgroundColor: ticketColor,
          borderRadius: 2,
          padding: 2,
          pt: 1,
          border: '0.1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: theme.shadows[3],
        })}
      >
        {dense && <>asd</>}
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="שם העסק">
                <Typography
                  fontSize={22}
                  fontWeight="bold"
                  sx={{
                    maxWidth: problem!.ip ? 120 : 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'pre',
                  }}
                >
                  {problem!.placeName}
                </Typography>
              </Tooltip>
              {problem && problem.ip && (
                <Tooltip title="IP">
                  <Typography
                    fontSize={18}
                    fontWeight="bold"
                    color="primary"
                    sx={{ px: 1 }}
                  >
                    {problem!.ip}
                  </Typography>
                </Tooltip>
              )}
            </Box>
            <Box
              sx={{
                borderRadius: 1,
                border: '0.5px solid rgba(0, 0, 0, 0.3)',
                px: 0.5,
              }}
            >
              <Tooltip title="תאריך פתיחה">
                <Typography variant="body1">
                  {dayjs(problem!.startTimeEN).format('HH:mm DD/MM')}
                </Typography>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        {/* <Box
          className="row"
          onClick={() => {
            return problem && onClick(problem);
          }}
        >
          <Tooltip title="פרטי לקוח" className="col-8">
            <p className="cusNameNote" style={{ color: textColor }}>
              {problem &&
                problem.customerName +
                  (problem.customerName && problem.phone && ' · ') +
                  problem.phone}
            </p>
          </Tooltip>
          <Tooltip
            title="עובד שפתח את הקריאה"
            className="col-4"
            style={{ textAlign: 'left' }}
          >
            <p
              className="timeNote"
              style={{ color: textColor, textAlign: 'left' }}
            >
              {problem && problem.workerCreateName}
            </p>
          </Tooltip>
        </Box> */}
        <Box
          sx={{
            py: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography
            sx={{ overflow: 'hidden', fontSize: 18 }}
            textAlign="start"
          >
            {problem!.desc}
          </Typography>
          {problem!.solution && <Divider sx={{ my: 1, maxWidth: 150 }} />}
          <Typography sx={{ overflow: 'hidden' }} textAlign="start">
            {problem!.solution}
          </Typography>
        </Box>

        <div className="row">
          <ProblemTypes problemTypes={problem!.problemTypesList} />
        </div>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1 }}>
            {problem!.statusId === 2 && (
              <Tooltip title="סגור">
                <IconButton
                  size="small"
                  style={{
                    background: '#F2F2F2',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <TaskAltIcon style={{ color: 'green' }} fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {problem!.emergencyId > 0 && (
              <Tooltip title="דחוף">
                <IconButton
                  size="small"
                  style={{
                    background: '#F2F2F2',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <NotificationsActiveIcon
                    style={{ color: 'red' }}
                    fontSize="small"
                  />
                </IconButton>
              </Tooltip>
            )}
            {problem!.takingCare && (
              <Tooltip title="בטיפול">
                <IconButton
                  size="small"
                  style={{
                    background: '#F2F2F2',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <AccessTimeIcon
                    style={{ color: 'orange' }}
                    fontSize="small"
                  />
                </IconButton>
              </Tooltip>
            )}

            {problem && problem.isLocked && (
              <Tooltip title="נעול">
                <IconButton
                  size="small"
                  style={{
                    background: '#F2F2F2',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <LockIcon style={{ color: 'blue' }} fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {problem && problem.callCustomerBack && (
              <Tooltip title="לחזור ללקוח">
                <IconButton
                  size="small"
                  style={{
                    background: '#F2F2F2',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <ContactPhoneIcon
                    style={{ color: 'blue' }}
                    fontSize="small"
                  />
                </IconButton>
              </Tooltip>
            )}

            {problem!.fileCount > 0 && (
              <Tooltip title="מצורף קובץ">
                <IconButton
                  size="small"
                  style={{
                    background: '#F2F2F2',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <AttachFileIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Box>
            <Tooltip title="עובד שפתח > עובד מטפל">
              <Typography
                sx={{
                  borderRadius: 1,
                  border: '0.5px solid rgba(0, 0, 0, 0.5)',
                  px: 0.5,
                }}
              >
                {`${problem!.workerCreateName} > ${problem!.updaterWorkerName}`}
              </Typography>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      <Dialog
        dir="rtl"
        sx={{ textAlign: 'right' }}
        fullWidth
        onClose={() => setShowLogs(false)}
        maxWidth="lg"
        open={showLogs}
      >
        <DialogContent>
          <div>
            <div className="row">
              <div className="col-2">עובד מעדכן</div>
              <div className="col-2">שם השדה</div>
              <div className="col-3">ערך ישן</div>
              <div className="col-3">ערך חדש</div>
              <div className="col-2">תאריך</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Button variant="contained" onClick={() => setShowLogs(false)}>
                סגור
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default ProblemNote;
