import {
  Collapse,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { MenuCategory } from "../../AppLayout";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./drawer.module.css";

interface Props {
  items: MenuCategory[];
  handleMenuClose: () => void;
  anchorEl: HTMLElement | null;
}

const MultiMenu = ({ items, handleMenuClose, anchorEl }: Props) => {
  const [currentMenu, setCurrentMenu] = useState<string | null>(null);
  const [collapseOpen, setCollapseOpen] = useState(false);

  const onClick = (label: string) => {
    if (currentMenu === null) {
      setCurrentMenu(label);
      setCollapseOpen(true);
    }
    collapseOpen && setCollapseOpen(false);

    if (!(currentMenu === label)) {
      setTimeout(() => {
        setCurrentMenu(label);
        setCollapseOpen(true);
      }, 300);
    } else {
      setCurrentMenu(null);
    }
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => {
        setCurrentMenu(null);
        handleMenuClose();
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      {items.map((i) => (
        <>
          <MenuItem
            sx={{ width: "180px" }}
            key={i.label}
            onClick={() => onClick(i.label)}
          >
            {i.label}
          </MenuItem>
          <Collapse
            className={styles.collapse}
            in={currentMenu === i.label && collapseOpen}
          >
            {i.entities.map((e) => (
              <MenuItem key={e.label} component={Link} to={e.to}>
                <ListItemIcon sx={{ pr: 1.5 }}>{e.icon}</ListItemIcon>
                <ListItemText>{e.label}</ListItemText>
              </MenuItem>
            ))}
          </Collapse>
        </>
      ))}
    </Menu>
  );
};

export default MultiMenu;
