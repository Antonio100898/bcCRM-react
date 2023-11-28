import React, { useCallback, useMemo } from 'react';
import { ListItemButton } from '@mui/material';
import { useUser } from '../../Context/UserContext';
import { IWorker } from '../../Model/IWorker';
import { Group, GroupsList } from '../GroupsList/GroupsList';
import { ToWorkersList } from './ToWorkersList';
import { WorkerAvatar } from './WorkerAvatar';
import './WorkersList.styles.css';

interface Props {
  workersSelected: number[];
  setWorkersSelected: (ids: number[]) => void;
}

const getWorkerGroupByDepartment = (workers: IWorker[]): Group<IWorker>[] => {
  const groups: { [department: string]: Group<IWorker> } = {};
  workers.forEach((worker) => {
    const departmentName = worker.departmentName || 'כללי';
    if (!groups[departmentName]) {
      groups[departmentName] = { title: departmentName, options: [] };
    }
    groups[departmentName].options.push(worker);
  });

  return Object.values(groups);
};

const getHandlersTitle = (selectedWorkers: IWorker[]) => {
  const count = selectedWorkers.length - 1;
  return count + 1
    ? `${selectedWorkers[0].workerName} ${!count ? '' : `+ ${count}`}`
    : 'מי מטפל ?';
};

export function WorkersList({ setWorkersSelected, workersSelected }: Props) {
  const { workers } = useUser();
  const groups = useMemo(() => getWorkerGroupByDepartment(workers), [workers]);

  const selectedSet = useMemo(
    () => new Set(workersSelected),
    [workersSelected]
  );
  const selectedWorkers = useMemo(
    () => Array.from(workers.values()).filter(({ Id }) => selectedSet.has(Id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedSet]
  );
  const title = useMemo(
    () => getHandlersTitle(selectedWorkers),
    [selectedWorkers]
  );

  const onSelectWorker = useCallback(
    (id: number, val: boolean) => {
      if (!val) {
        setWorkersSelected(
          workersSelected.filter((workerId) => id !== workerId)
        );
        return;
      }
      setWorkersSelected([...workersSelected, id]);
    },
    [setWorkersSelected, workersSelected]
  );

  const handleWorkerDeselection = useCallback(
    (id: number) => {
      onSelectWorker(id, false);
    },
    [onSelectWorker]
  );

  return (
    <GroupsList
      title={title}
      groups={groups}
      idsDismissBlur={['toWorkersTooltip']}
      optionIsSelected={(worker) => selectedSet.has(worker.Id)}
      endAdornment={
        <ToWorkersList
          selectedWorkers={selectedWorkers}
          handleWorkerDeselection={handleWorkerDeselection}
        />
      }
      filterPredicat={(filter, worker) =>
        !filter || worker.workerName.includes(filter)
      }
      renderKey={(worker) => worker.Id.toString()}
      renderOption={(worker) => (
        <ListItemButton
          className="row itemContainer"
          onClick={() => onSelectWorker(worker.Id, !selectedSet.has(worker.Id))}
        >
          <div className="col-10 container">
            <div className="avatarContainer">
              <WorkerAvatar
                worker={worker}
                selected={selectedSet.has(worker.Id)}
              />
            </div>
            <div className="pe-3">
              <div className="workerName">{worker.workerName}</div>
              <div className="jobTitle">{worker.jobTitle}</div>
            </div>
          </div>
        </ListItemButton>
      )}
    />
  );
}
