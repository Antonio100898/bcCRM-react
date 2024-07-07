import { Chip } from "@mui/material";

type Props = {
  selected?: boolean;
  onClick: () => void;
  label?: string;
};

const SelectChip = ({ selected, onClick, label }: Props) => {
  return (
    <Chip
      onClick={onClick}
      sx={{
        fontSize: 14,
        fontWeight: 600,
        backgroundColor: selected ? "primary.main" : "",
        "&:hover": {
          backgroundColor: "primary.main",
        },
      }}
      label={label}
    />
  );
};

export default SelectChip;
