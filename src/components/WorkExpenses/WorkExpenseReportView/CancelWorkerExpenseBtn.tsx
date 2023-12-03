import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { useSnackbar } from "notistack";
import { useConfirm } from "../../../Context/useConfirm";
import { useUser } from "../../../Context/useUser";
import { workerService } from "../../../API/services";

export type Props = {
  workerExpenceId: string;
  refreshlist: () => void;
};

export default function CancelWorkerExpenseBtn({
  workerExpenceId,
  refreshlist,
}: Props) {
  const { confirm } = useConfirm();
  const { enqueueSnackbar } = useSnackbar();
  const { updateShowLoader } = useUser();

  const deleteExpense = async (expenseId: string) => {
    if (!(await confirm("האם אתה בטוח שברצונך למחוק?"))) return;
    try {
      const data = await workerService.cancelWorkerExpenses(expenseId);

      if (!data?.d) {
        updateShowLoader(false);
        enqueueSnackbar({
          message: "אין משתמש כזה",
          variant: "error",
        });
        updateShowLoader(false);
        return;
      }
      if (!data.d.success) {
        updateShowLoader(false);
        enqueueSnackbar({
          message: data.d.msg,
          variant: "error",
        });
        updateShowLoader(false);
        return;
      }
      refreshlist();
    } catch (error) {
      console.error(error);
    }

    updateShowLoader(false);
  };

  return (
    <IconButton
      onClick={() => {
        deleteExpense(workerExpenceId);
      }}
    >
      <Tooltip title="מחק">
        <DeleteIcon style={{ fontSize: 25, color: "red" }} />
      </Tooltip>
    </IconButton>
  );
}
