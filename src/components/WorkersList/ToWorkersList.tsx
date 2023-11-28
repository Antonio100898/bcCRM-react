// import { Chip, Popper } from "@material-ui/core";
import { InfoOutlined } from '@mui/icons-material';
import { Chip, Popper, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { IWorker } from '../../Model/IWorker';
import './WorkersList.styles.css';

interface Props {
  selectedWorkers: IWorker[];
  handleWorkerDeselection: (id: number) => void;
}

export function ToWorkersList({
  selectedWorkers,
  handleWorkerDeselection,
}: Props) {
  const [anchorEl, setAnchorEl] = useState<
    (EventTarget & HTMLDivElement) | null
  >(null);

  const onClose = useCallback(() => setAnchorEl(null), []);

  useEffect(() => {
    if (!selectedWorkers.length) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWorkers]);

  const onOpen = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
      selectedWorkers.length && setAnchorEl(e.currentTarget),
    [selectedWorkers]
  );

  return (
    <div onMouseEnter={onOpen}>
      <div>
        <InfoOutlined className="endIcon" />
      </div>
      <Popper className="poper" open={!!anchorEl} anchorEl={anchorEl}>
        <div className="popover" id="toWorkersTooltip">
          <div>תומכים מטפלים</div>
          <hr />
          {selectedWorkers.map((w) => (
            <Chip
              className="chip"
              key={w.Id}
              sx={{
                '& .MuiChip-deleteIcon': {
                  color: 'white',
                },
              }}
              label={
                <Typography fontSize={14} color="white">
                  {w.workerName}
                </Typography>
              }
              onDelete={() => handleWorkerDeselection(w.Id)}
            />
          ))}
        </div>
      </Popper>
    </div>
  );
}
