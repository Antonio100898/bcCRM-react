import { Box, IconButton, TextField, Typography, Divider } from "@mui/material";
import { useState, useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import { IMsgLine } from "../../Model";
import PromptDialog from "../../Dialogs/PromptDialog";
import { problemService } from "../../API/services";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./ProblemMessages.style.css";
import { useUser } from "../../Context/useUser";
import { useConfirm } from "../../Context/useConfirm";

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
  const [openNewMsgDialog, setOpenNewMsgDialog] = useState(false);
  const [openUpdateMsgDialog, setOpenUpdateNewMsgDialog] = useState(false);
  const [allMessages, setAllMessages] = useState<IMsgLine[]>([]);
  const [messagesToShow, setMessagesToShow] = useState<IMsgLine[]>([]);
  const [showAllMessages, setShowAllMessages] = useState(false);
  const [defaultTextUpdateMessage, setDefaultTextUpdateMessage] = useState("");
  const [updateMsgId, setUpdateMsgId] = useState<undefined | number>(undefined);

  const { user } = useUser();
  const { confirm } = useConfirm();

  const handleOpenNewCloseDialog = (value: boolean) => {
    setOpenNewMsgDialog(value);
  };

  const handleOpenUpdateCloseDialog = (
    value: boolean,
    text?: string,
    msgId?: number
  ) => {
    if (text && msgId) {
      setDefaultTextUpdateMessage(text);
      setUpdateMsgId(msgId);
    }
    setOpenUpdateNewMsgDialog(value);
  };

  const addNewMsg = async (value: string) => {
    if (problemId && value.length > 0) {
      try {
        const data = await problemService.addProblemMessage(problemId, value);
        if (data?.d.success) {
          enqueueSnackbar({
            message: "הצלחה",
            variant: "success",
          });
        }
        await refreshMessages();
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

  const deleteMsg = async (msdgId: number) => {
    try {
      const data = await problemService.deleteMsgLine(msdgId);
      if (data?.d.success) {
        enqueueSnackbar({
          message: "הצלחה",
          variant: "success",
        });
      }
      await refreshMessages();
    } catch (err) {
      if (err instanceof Error) {
        enqueueSnackbar({
          message: err.message,
          variant: "error",
        });
      }
    }
  };

  const updateMsg = async (msgId: number, value: string) => {
    if (problemId && value.length > 0) {
      try {
        const data = await problemService.updateMsgLine(msgId, value);
        if (data?.d.success) {
          enqueueSnackbar({
            message: "הצלחה",
            variant: "success",
          });
        }
        await refreshMessages();
      } catch (err) {
        if (err instanceof Error) {
          enqueueSnackbar({
            message: err.message,
            variant: "error",
          });
        }
      }
    }
    setUpdateMsgId(undefined);
  };

  const onDeleteMsg = async (value: number) => {
    if (!(await confirm("למחוק את ההודעה?"))) return;
    await deleteMsg(value);
  };

  const onAddNewMsg = async (value: string) => {
    await addNewMsg(value);
  };

  const onUpdateMsg = async (value: string) => {
    if (!updateMsgId) return;
    await updateMsg(updateMsgId, value);
    setOpenUpdateNewMsgDialog(false);
    setDefaultTextUpdateMessage("");
  };

  useEffect(() => {
    setAllMessages(messages);
  }, [messages]);

  useEffect(() => {
    let mymessages: IMsgLine[] = [];
    mymessages = [...allMessages];

    if (showAllMessages) {
      setMessagesToShow(mymessages.reverse());
    } else {
      setMessagesToShow(mymessages.reverse().slice(0, 3));
    }
  }, [showAllMessages, allMessages]);

  useEffect(() => {
    refreshMessages();
  }, [problemId]);

  return (
    <Box sx={{ width: "100%" }}>
      <Divider>
        <Box className="new-message-button-container">
          <IconButton onClick={() => handleOpenNewCloseDialog(true)}>
            <Typography fontSize={20} color={"black"} fontWeight="bold">
              להוסיף הודעה
            </Typography>
            <MapsUgcIcon />
          </IconButton>
        </Box>
      </Divider>
      {messagesToShow.length === 0 && (
        <Box className="text-center">
          <Typography>אין פה הודעות כרגע...</Typography>
        </Box>
      )}
      {showAllMessages && (
        <Box className="text-center">
          <IconButton onClick={() => setShowAllMessages(false)}>
            <ExpandLessIcon />
          </IconButton>
        </Box>
      )}
      {messagesToShow.map((m) => (
        <Box sx={{ marginBottom: 1 }} key={m.id}>
          <Box className="flex-row">
            <Typography fontSize={18} fontWeight="bold">
              {m.workerName}
            </Typography>
            <Typography fontSize={14}>{m.commitTime}</Typography>
          </Box>
          <Box className="flex-row">
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
            {(m.workerId === user?.workerId || user?.userType === 1) && (
              <>
                <IconButton
                  onClick={() => handleOpenUpdateCloseDialog(true, m.msg, m.id)}
                >
                  <EditIcon color="primary" />
                </IconButton>

                <IconButton onClick={() => onDeleteMsg(m.id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </>
            )}
          </Box>
        </Box>
      ))}
      {allMessages.length > messagesToShow.length && !showAllMessages && (
        <Box className="text-center">
          <IconButton onClick={() => setShowAllMessages(true)}>
            <ExpandMoreIcon />
          </IconButton>
        </Box>
      )}
      <div id="bottom-of-messages"></div>
      <PromptDialog
        defaultText=""
        message="הזן הודעה"
        open={openNewMsgDialog}
        setOpen={handleOpenNewCloseDialog}
        onConfirm={onAddNewMsg}
      />
      <PromptDialog
        defaultText={defaultTextUpdateMessage}
        message="עדכן הודעה"
        open={openUpdateMsgDialog}
        setOpen={handleOpenUpdateCloseDialog}
        onConfirm={onUpdateMsg}
      />
    </Box>
  );
}
