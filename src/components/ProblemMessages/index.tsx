import { Box, IconButton, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import CreateIcon from "@mui/icons-material/Create";
import { IMsgLine } from "../../Model";
import { api } from "../../API/axoisConfig";
import PromptDialog from "../../Dialogs/PromptDialog";

type Props = {
  problemId: number;
  messages: IMsgLine[];
  refreshMessages: () => Promise<void>;
};

export default function ProblemMessages({
  problemId,
  messages,
  refreshMessages,
}: Props) {
  const [openMsgDialog, setOpenMsgDialog] = useState(false);

  const handleOpenCloseDialog = (value: boolean) => {
    setOpenMsgDialog(value);
  };

  const addNewMsg = async (value: string) => {
    if (problemId && value.length > 0) {
      try {
        const data = await api.addChatLines(problemId, value);
        if (data?.d.success) {
          enqueueSnackbar({
            message: "הצלחה",
            variant: "success",
          });
        }
      } catch (err) {
        if (err instanceof Error) {
          enqueueSnackbar({
            message: err.message,
            variant: "error",
          });
        }
      }
    }
  };

  const onConfirmMsgDialog = async (value: string) => {
    await addNewMsg(value);
    await refreshMessages();
  };

  useEffect(() => {
    refreshMessages();
  }, [problemId, refreshMessages]);

  return (
    <Box sx={{ width: "100%", marginBottom: 6 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: 1,
        }}
      >
        <IconButton onClick={() => handleOpenCloseDialog(true)}>
          <Typography fontSize={20} color={"black"} fontWeight="bold">
            הודעה
          </Typography>
          <CreateIcon />
        </IconButton>
      </Box>

      {messages?.map((m) => (
        <Box sx={{ marginBottom: 1 }} key={m.commitTime + m.workerId}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography fontSize={18} fontWeight="bold">
              {m.workerName}
            </Typography>
            <Typography fontSize={14}>{m.commitTime}</Typography>
          </Box>
          <TextField
            variant="standard"
            fullWidth
            multiline
            value={m.msg}
            disabled
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "black",
              },
            }}
          />
        </Box>
      ))}

      <PromptDialog
        defaultText=""
        message="הזן הודעה"
        open={openMsgDialog}
        setOpen={handleOpenCloseDialog}
        onConfirm={onConfirmMsgDialog}
      />
    </Box>
  );
}
