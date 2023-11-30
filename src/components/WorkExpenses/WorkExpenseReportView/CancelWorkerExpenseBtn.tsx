import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { useSnackbar } from "notistack";
import { api } from "../../../API/axoisConfig";
import { TOKEN_KEY } from "../../../Consts/Consts";
import { useConfirm } from "../../../Context/useConfirm";
import { useUser } from "../../../Context/useUser";

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

  // console.log(workerExpenceId);

  const deleteExpense = async (expenseId: string) => {
    // console.log("DeleteExpense Clicked " + expenseId);
    // const proceed = prompt("אנא כתוב yes במידה וברצונך למחוק");

    // if (proceed === "yes") {
    if (await confirm("האם אתה בטוח שברצונך למחוק?")) {
      api
        .post("/CancelWorkerExpenses", {
          workerKey: localStorage.getItem(TOKEN_KEY),
          expenseId,
        })
        .then(({ data }) => {
          if (!data.d) {
            updateShowLoader(false);
            enqueueSnackbar({
              message: "אין משתמש כזה",
              variant: "error",
            });

            return;
          }
          if (!data.d.success) {
            updateShowLoader(false);
            enqueueSnackbar({
              message: data.d.msg,
              variant: "error",
            });

            return;
          }

          updateShowLoader(false);
          refreshlist();
        });
    }
  };

  return (
    <IconButton
      onClick={() => {
        deleteExpense(workerExpenceId);
      }}
      //   style={{
      //     textAlign: "left",
      //     background: "#FFFFFF",
      //     border: "1px solid rgba(0, 0, 0, 0.25)",
      //     boxShadow: "inset 0px 5px 10px rgba(0, 0, 0, 0.05)",
      //     borderRadius: "40px",
      //   }}
    >
      <Tooltip title="מחק">
        <DeleteIcon style={{ fontSize: 25, color: "red" }} />
      </Tooltip>
    </IconButton>
  );
}
