import './WorkExpenseReportView.styles.css';
import { useState, useEffect } from 'react';
import {
  Autocomplete,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  OutlinedInput,
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useUser } from '../../../Context/useUser';

export type Props = {
  exportFile: () => void;
  updateWorkesExpensesApprove: () => void;
  updateWorker: (m: string) => void;
  updateMonth: (m: string) => void;
  updateYear: (m: string) => void;
  updateSortBy: (m: string) => void;
};

interface AutocompleteOption {
  label: string;
  id: number;
}

export default function WorkExpenseReportFilters({
  exportFile,
  updateWorkesExpensesApprove,
  updateYear,
  updateWorker,
  updateMonth,
  updateSortBy,
}: Props) {
  const { workers } = useUser();

  const [workersOption, setWorkersOption] = useState<AutocompleteOption[]>([]);
  const [filterYear, setFilterYear] = useState(
    new Date().getFullYear().toString()
  );
  const months = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
  ];

  const [filterMonth, setFilterMonth] = useState<string>(
    months[new Date().getMonth()]
  );
  const [filterWorkerId, setFilterWorkerId] = useState('0');
  const [sortBy, setSortBy] = useState('startExpenseDate');

  useEffect(() => {
    const rows: AutocompleteOption[] = [];
    for (let i = 0; i < workers.length; i += 1) {
      rows.push({ label: workers[i].workerName, id: workers[i].Id });
    }
    rows.push({ label: 'כולם', id: 0 });
    setWorkersOption(rows);
    setFilterMonth(months[new Date().getMonth()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function YearChanged(val: string) {
    setFilterYear(val);
    updateYear(val);
  }

  function MonthChanged(val: string) {
    setFilterMonth(val);
    updateMonth(val);
  }

  return (
    <div className="row">
      <div
        className="col-xs-12 col-sm-12 col-md-3 col-lg-3 right"
        style={{ display: 'flex' }}
      >
        <Autocomplete
          fullWidth
          disablePortal
          id="combo-box-demo"
          options={workersOption}
          onChange={(_, newValue: AutocompleteOption | null) => {
            setFilterWorkerId(`${newValue?.id}`);
            updateWorker(`${newValue?.id}`);
          }}
          renderInput={(params) => (
            <TextField {...params} label="עובדים" value={filterWorkerId} />
          )}
        />
      </div>
      <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 right">
        <Select
          fullWidth
          value={filterMonth}
          onChange={(e) => MonthChanged(e.target.value)}
          input={<OutlinedInput label="חודשים" />}
          style={{ height: '56px' }}
        >
          {months.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className="col-xs-12 col-sm-6 col-md-2 col-lg-2 right">
        <Select
          fullWidth
          variant="outlined"
          value={filterYear}
          className="cboDateMonth"
          onChange={(e) => YearChanged(e.target.value)}
          style={{ height: '56px' }}
        >
          <MenuItem value="2022">2022</MenuItem>
          <MenuItem value="2023">2023</MenuItem>
          <MenuItem value="2024">2024</MenuItem>
          <MenuItem value="2025">2025</MenuItem>
          <MenuItem value="2026">2026</MenuItem>
        </Select>
      </div>
      <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 right">
        <Tooltip title="סדר לפי" placement="left-start">
          <Select
            label="לסדר לפי"
            fullWidth
            variant="outlined"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              updateSortBy(e.target.value);
              // console.log(e.target.value);
            }}
            style={{ height: '56px' }}
          >
            <MenuItem value="startExpenseDate">תאריך</MenuItem>
            <MenuItem value="workerName">עובד</MenuItem>
            <MenuItem value="workExpensName">הוצאה</MenuItem>
            <MenuItem value="expenseValue">סכום</MenuItem>
          </Select>
        </Tooltip>
      </div>

      <div className="col-xs-2 col-sm-6 col-md-1 col-lg-1 left">
        <Tooltip title="יצא לאקסל">
          <IconButton
            onClick={exportFile}
            style={{
              background: '#F3BE80',
              borderRadius: '12px',
              margin: 5,
            }}
          >
            <ArticleIcon
              style={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.9)' }}
            />
          </IconButton>
        </Tooltip>
      </div>
      <div className="col-xs-2 col-sm-6 col-md-1 col-lg-1 left">
        <Tooltip title="אשר את כל ההוצאות">
          <IconButton
            onClick={updateWorkesExpensesApprove}
            style={{
              background: '#F3BE80',
              borderRadius: '12px',
              margin: 5,
            }}
          >
            <TaskAltIcon
              style={{
                fontSize: 40,
                color: 'green',
              }}
            />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}
