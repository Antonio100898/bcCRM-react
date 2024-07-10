import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import SelectChip from "../../components/SelectChip/SelectChip";
import SelectsChipGroup from "../../components/SelectChipGroup/SelectsChipGroup";
import CustomDialog from "../CustomDialog";
import {
  Box,
  Stack,
  SxProps,
  Theme,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FormInputWrapper from "../../components/BaseCompnents/FormInputWrapper";

type Props = {
  open: boolean;
  onClose: () => void;
  fullScreen?: boolean;
  onSubmit?: () => void;
  sx?: SxProps<Theme>;
};

const expenseTypes = ["בונוסים", "קילומטר", "נסיעות"];
const expenseDesc = [
  "אוטובוס",
  "חנייה",
  "סלופארק",
  "פנגו",
  "דלק",
  "מונית",
  "רכבת",
  "אחר",
];

const WorkerExpenseDialog = ({
  onClose,
  open,
  fullScreen,
  onSubmit,
  sx,
}: Props) => {
  const [selectedType, setSelectedType] = useState<null | string>(null);
  const [selectedDesc, setSelectedDesc] = useState<null | string>(null);

  return (
    <CustomDialog
      onClose={onClose}
      open={open}
      fullScreen={fullScreen}
      onSubmit={onSubmit}
      sx={sx}
      title="הוצאה חדשה"
    >
      <Stack gap={6} mt={4}>
        <SelectsChipGroup label="סוג הוצאה">
          {expenseTypes.map((type) => (
            <SelectChip
              onClick={() => setSelectedType(type)}
              selected={selectedType === type}
              label={type}
              key={type}
            />
          ))}
        </SelectsChipGroup>
        <SelectsChipGroup label="תיאור">
          {expenseDesc.map((desc) => (
            <SelectChip
              onClick={() => setSelectedDesc(desc)}
              selected={selectedDesc === desc}
              label={desc}
              key={desc}
            />
          ))}
        </SelectsChipGroup>
        <Stack direction="row" gap={2}>
          <Box>
            <FormInputWrapper label="תאריך">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={{
                    "& .MuiInputBase-input": {
                      padding: "6px",
                      textAlign: "center",
                    },
                  }}
                />
              </LocalizationProvider>
            </FormInputWrapper>
          </Box>
          <Stack direction="row-reverse" alignItems="flex-end" gap={1}>
            <Typography component="span" fontWeight={600} fontSize={20}>
              ₪
            </Typography>
            <FormInputWrapper label="סכום">
              <TextField
                type="text"
                sx={{
                  "& .MuiInputBase-input": {
                    padding: "6px",
                  },
                }}
              />
            </FormInputWrapper>
          </Stack>
        </Stack>
        <FormInputWrapper label="הערה">
          <TextField type="text" multiline />
        </FormInputWrapper>
      </Stack>
    </CustomDialog>
  );
};

export default WorkerExpenseDialog;
