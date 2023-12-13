/**
 * 
 * eslint error but component is not imported
 * 
 */ 

// import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
// import { Badge, Button, IconButton } from "@mui/material";
// import { useEffect, useState } from "react";
// import { api } from "../../API/axoisConfig";
// import { INotification } from "../../Model";
// import Notafication from "./Notafication";

// function NotaficationButton() {
//   const [notifications, setNotifications] = useState<INotification[]>([]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [notificationsCount, setNotificationsCount] = useState(0);

//   const fetchNotificationsCount = async () => {
//     try {
//       const data = await api.getNotificationsCount();
//       if (data) setNotificationsCount(data.d.notificationsCount);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchNotificationsCount();
//   }, []);

//   const getNotifications = async () => {
//     try {
//       const data = await api.getNotifications();
//       if (data) setNotifications(data.d.notifications);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const showNotificationsFn = () => {
//     getNotifications();
//     setShowNotifications(!showNotifications);
//   };

//   const deleteAll = async () => {
//     try {
//       const data = await api.deleteNotificationAll();
//       if (data) setNotifications(data.d.notifications);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <Badge
//         badgeContent={notificationsCount}
//         anchorOrigin={{
//           vertical: "bottom",
//           horizontal: "left",
//         }}
//       >
//         <IconButton onClick={showNotificationsFn}>
//           <NotificationsNoneIcon style={{ fontSize: "36px" }} />
//         </IconButton>
//       </Badge>

//       {showNotifications && (
//         <div
//           style={{
//             display: "block",
//             position: "fixed",
//             right: "90px",
//             top: "60px",
//             zIndex: "10000",
//             background: "#FAF9F9",
//             border: "1px solid rgba(0, 0, 0, 0.2)",
//             boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
//             borderRadius: "16px 16px 0px 0px",
//           }}
//         >
//           <div>
//             <p
//               style={{
//                 fontFamily: "Rubik",
//                 fontStyle: "normal",
//                 fontWeight: 700,
//                 fontSize: "28px",
//                 lineHeight: "38px",
//               }}
//             >
//               התראות
//             </p>
//           </div>
//           {notifications && notifications.length > 0 && (
//             <div>
//               <Button variant="contained" onClick={deleteAll}>
//                 מחק הכל
//               </Button>
//             </div>
//           )}
//           {notifications &&
//             notifications.map((note) => {
//               return <Notafication key={note.id} nota={note} />;
//             })}
//         </div>
//       )}
//     </div>
//   );
// }

// export default NotaficationButton;
