import { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import MarkAsUnreadIcon from "@mui/icons-material/MarkAsUnread";
import { IconButton, Tooltip } from "@mui/material";
import { INotification } from "../../Model";
import { api } from "../../API/Api";

export type Props = {
  nota: INotification;
};

function Notafication({ nota }: Props) {
  const [notafication, setNotafication] = useState<INotification>(nota);

  const deleteNotification = async () => {
    try {
      await api.deleteNotification(notafication.id);
    } catch (error) {
      console.error(error);
    }
  };

  const changeHasRead = async () => {
    try {
      await api.updateNotificationHadSeen(
        notafication.id,
        !notafication.hadSeen
      );
      setNotafication({
        ...notafication,
        hadSeen: !notafication.hadSeen,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        minWidth: "250px",
        background: "#FFE9C9",
        border: "1px solid rgba(0, 0, 0, 0.25)",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
      }}
    >
      <p
        style={{
          fontFamily: "Rubik",
          fontStyle: "normal",
          fontWeight: 400,
          fontSize: "22px",
          lineHeight: "30px",
          textAlign: "right",
          color: "rgba(0, 0, 0, 0.8)",
        }}
      >
        {notafication.msg}
      </p>
      <div style={{ display: "flex", flex: "row", justifyContent: "left" }}>
        <IconButton onClick={deleteNotification}>
          <Tooltip title="מחק איזכור">
            <DeleteOutlineIcon />
          </Tooltip>
        </IconButton>

        <IconButton onClick={changeHasRead}>
          <Tooltip title={notafication.hadSeen ? "סמן כלא נקרא" : "נקרא"}>
            <div>
              {notafication.hadSeen && <MarkAsUnreadIcon />}
              {!notafication.hadSeen && <MailOutlineIcon />}
            </div>
          </Tooltip>
        </IconButton>
      </div>
    </div>
  );
}

export default Notafication;
