import { Box, Button, Typography, Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

type Props = {
  collapseOpen: boolean;
  onHandleValueClick: () => void;
  label: string;
  open: boolean;
  children?: React.ReactNode;
};

const CustomCollapseTrigger = ({
  collapseOpen,
  onHandleValueClick,
  label,
  open,
  children,
}: Props) => {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Button variant="text" onClick={onHandleValueClick}>
          <Typography color="black" variant="h6">
            {label}
          </Typography>
          {collapseOpen ? (
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
