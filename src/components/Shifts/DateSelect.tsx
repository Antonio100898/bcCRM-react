import { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

export type Props = {
  setDate: (date: Date) => void;
};

function getLastSunday(orOtherDay: number) {
  const date = new Date();
  const today = date.getDate();
  const currentDay = date.getDay();
  const newDate = date.setDate(today - (currentDay || orOtherDay));

  return new Date(newDate);
}

function getLastSundayOption(date: Date, orOtherDay: number) {
  const today = date.getDate();
  const currentDay = date.getDay();
  if (currentDay === orOtherDay) {
    return date;
  }
  const newDate = date.setDate(today - (currentDay || orOtherDay));

  return new Date(newDate);
}

export default function DateSelect({ setDate }: Props) {
  const [startDate, setStartDate] = useState(getLastSunday(7));

  function addDays(theDate: Date, days: number) {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
  }

  const handleChange = (newValue: Dayjs | null) => {
    const d: Date = getLastSundayOption(newValue!.toDate(), 7);
    setStartDate(d);
    setDate(d);
  };

  return (
    <div style={{ display: 'flex', flex: 'row', justifyContent: 'center' }}>
      <Tooltip title="שבוע אחורה">
        <IconButton
          onClick={() => {
            setStartDate(addDays(startDate, -7));
            setDate(addDays(startDate, -7));
          }}
        >
          <ArrowLeftIcon
            style={{
              height: '56px',
              fontSize: '50px',
              background: '#FFF5E9',
              border: '1px solid rgba(0, 0, 0, 0.5)',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.05)',
              borderRadius: '8px',
              transform: 'matrix(-1, 0, 0, 1, 0, 0)',
            }}
          />
        </IconButton>
      </Tooltip>
      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            format="DD/MM/YYYY"
            value={dayjs(startDate)}
            onChange={handleChange}
            slotProps={{
              textField: {
                sx: {
                  fontFamily: 'Rubik',
                  fontStyle: 'normal',
                  fontWeight: '300',
                  fontSize: '26px',
                  lineHeight: '38px',
                  textAlign: 'center',

                  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.05)',

                  padding: '8px',
                },
              },
            }}
          />
        </LocalizationProvider>
      </div>

      <Tooltip title="שבוע קדימה">
        <IconButton
          onClick={() => {
            setStartDate(addDays(startDate, 7));
            setDate(addDays(startDate, 7));
          }}
        >
          <ArrowRightIcon
            style={{
              height: '56px',
              fontSize: '50px',
              background: '#FFF5E9',
              border: '1px solid rgba(0, 0, 0, 0.5)',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.05)',
              borderRadius: '8px',
              transform: 'matrix(-1, 0, 0, 1, 0, 0)',
            }}
          />
        </IconButton>
      </Tooltip>
    </div>
  );
}
