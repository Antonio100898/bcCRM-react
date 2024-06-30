import { Box, Button, Typography, Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

type Props = {
  onHandleValueClick: () => void;
  label: string;
  open: boolean;
  children?: React.ReactNode;
  counter?: number;
};

const CustomCollapseTrigger = ({
  onHandleValueClick,
  label,
  open,
  children,
  counter,
}: Props) => {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Button variant="text" onClick={onHandleValueClick}>
          <Typography variant="h6">
            {label} ({counter})
          </Typography>
          {open ? (
            <ExpandLessIcon color="primary" />
          ) : (
            <ExpandMoreIcon color="primary" />
          )}
        </Button>
      </Box>
      <Collapse in={open}>{children}</Collapse>
    </>
  );
};

export default CustomCollapseTrigger;
