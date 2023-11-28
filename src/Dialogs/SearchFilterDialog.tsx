import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  DialogActions,
  Button,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { ISearchProblem } from 'Model/ISearchProblem';

export type SearchFilterDialogProps = {
  open: boolean;
  filter: Partial<ISearchProblem>;
  onClose: () => void;
  onFilterChanged: (filter: Partial<ISearchProblem>) => void;
};

export function SearchFilterDialog({
  open,
  filter,
  onClose,
  onFilterChanged,
}: SearchFilterDialogProps) {
  const [selfFilter, setSelfFilter] = useState(filter);

  const handleChange = useCallback(
    <K extends keyof ISearchProblem>(key: K, value: ISearchProblem[K]) => {
      setSelfFilter((f) => ({ ...f, [key]: value }));
    },
    []
  );

  const handleSave = useCallback(() => {
    onFilterChanged(selfFilter);
    onClose();
  }, [onClose, onFilterChanged, selfFilter]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>פילטר חיפוש</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <FormControlLabel
            label="שם המקום"
            control={
              <Checkbox
                checked={selfFilter.place}
                onChange={(_, checked) => handleChange('place', checked)}
              />
            }
          />
          <FormControlLabel
            label="טלפון"
            control={
              <Checkbox
                checked={selfFilter.phone}
                onChange={(_, checked) => handleChange('phone', checked)}
              />
            }
          />
          <FormControlLabel
            label="עובד מטפל"
            control={
              <Checkbox
                checked={selfFilter.workerName}
                onChange={(_, checked) => handleChange('workerName', checked)}
              />
            }
          />
          <FormControlLabel
            label="תוכן תקלה"
            control={
              <Checkbox
                checked={selfFilter.desc}
                onChange={(_, checked) => handleChange('desc', checked)}
              />
            }
          />
          <FormControlLabel
            label="כמות זמן לחיפוש"
            sx={{
              display: 'flex',
              flexDirection: 'column-reverse',
              alignItems: 'start',
              gap: 1,
              mt: 2,
              mx: 'inherit',
            }}
            control={
              <ToggleButtonGroup
                exclusive
                value={selfFilter.daysBack}
                onChange={(_, value) => handleChange('daysBack', value)}
              >
                <ToggleButton value={3}>¼ שנה</ToggleButton>
                <ToggleButton value={6}>½ שנה</ToggleButton>
                <ToggleButton value={12}>שנה 1</ToggleButton>
                <ToggleButton value={24}>שנתיים</ToggleButton>
              </ToggleButtonGroup>
            }
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          ביטול
        </Button>
        <Button onClick={handleSave}>שמירה</Button>
      </DialogActions>
    </Dialog>
  );
}
