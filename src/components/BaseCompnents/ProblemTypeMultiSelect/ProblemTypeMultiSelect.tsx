import {
  Box,
  Chip,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  SelectProps,
} from '@mui/material';
import { useUser } from '../../../Context/useUser';

export function ProblemTypeMultiSelect(props: SelectProps) {
  const { problemTypes } = useUser();

  // useEffect(() => {
  //   console.log(problemTypes);
  // }, [problemTypes]);

  return (
    <FormControl
      sx={{ m: 1, width: '100%', paddingLeft: '20px', margin: '10px' }}
    >
      <Select
        labelId="demo-multiple-chip-label"
        id="demo-multiple-chip"
        multiple
        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {(selected as string[]).map((value: string) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        {...props}
      >
        {problemTypes &&
          problemTypes
            .sort((a, b) => (a.problemTypeName > b.problemTypeName ? 1 : -1))
            .map((t) => (
              <MenuItem key={t.id} value={t.problemTypeName}>
                {t.problemTypeName}
              </MenuItem>
            ))}
      </Select>
    </FormControl>
  );
}
