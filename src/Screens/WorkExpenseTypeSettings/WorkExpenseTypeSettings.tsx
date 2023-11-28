import './WorkerExpenses.styles.css';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import { useSnackbar } from 'notistack';
import { api } from '../../API/Api';
import { TOKEN_KEY } from '../../Consts/Consts';
import WorkersHeader from '../../components/Workers/WorkersHeader';
import { IWorkExpensesType } from '../../Model/IWorkExpensesType';
import { useUser } from '../../Context/useUser';

export default function WorkExpenseTypeSettings() {
  const { enqueueSnackbar } = useSnackbar();
  const [workExpensesType, setWorkExpensesType] = useState<IWorkExpensesType[]>(
    []
  );
  const { updateShowLoader } = useUser();

  useEffect(() => {
    updateShowLoader(true);
    api
      .post('/GetWorkExpensesTypes', {
        workerKey: localStorage.getItem(TOKEN_KEY),
      })
      .then(({ data }) => {
        if (!data.d) {
          updateShowLoader(false);
          enqueueSnackbar({
            message: 'אין משתמש כזה',
            variant: 'error',
          });
          return;
        }

        // console.log(data.d);
        if (data.d.success) {
          // console.log(data.d.workExpensesTypes);
          setWorkExpensesType(data.d.workExpensesTypes);
        }

        updateShowLoader(false);
      });
  }, [enqueueSnackbar, updateShowLoader]);

  const updateExpenceTypeName = (id: string, newValue: string) => {
    const newState = workExpensesType.map((obj) => {
      if (obj.id === id) {
        return { ...obj, workExpensName: newValue };
      }

      return obj;
    });

    setWorkExpensesType(newState);
  };

  const updateExpenceTypePrice = (id: string, newValue: string) => {
    const newState = workExpensesType.map((obj) => {
      if (obj.id === id) {
        return { ...obj, defValue: newValue };
      }

      return obj;
    });

    setWorkExpensesType(newState);
  };

  const updateExpenceOrderIndex = (id: string, newValue: string) => {
    const newState = workExpensesType.map((obj) => {
      if (obj.id === id) {
        return { ...obj, orderIndex: newValue };
      }

      return obj;
    });

    setWorkExpensesType(newState);
  };

  const updateExpensesType = useCallback(() => {
    // ("updateExpensesType");
    api
      .post('/UpdateWorkExpensesTypes', {
        workerKey: localStorage.getItem(TOKEN_KEY),
        expensesType: workExpensesType,
      })
      .then(({ data }) => {
        if (!data.d) {
          updateShowLoader(false);
          enqueueSnackbar({
            message: 'אין משתמש כזה',
            variant: 'error',
          });
          return;
        }

        // console.log(data.d);
        if (data.d.success) {
          enqueueSnackbar({
            message: 'עדכן בהצלחה',
            variant: 'error',
          });
          return;
        }

        updateShowLoader(false);
      });
  }, [enqueueSnackbar, updateShowLoader, workExpensesType]);

  return (
    <div>
      <WorkersHeader />

      <div>
        <div>
          <h2>הגדרות הוצאות עבודה</h2>
          <IconButton
            onClick={updateExpensesType}
            style={{
              background: '#F3BE80',
              border: '1px solid rgba(0, 0, 0, 0.25)',
              boxShadow: 'inset 0px 5px 10px rgba(0, 0, 0, 0.05)',
              borderRadius: '12px',
            }}
          >
            <Tooltip title="עדכן הגדרות">
              <SaveIcon
                style={{ fontSize: 35, color: 'rgba(255, 255, 255, 0.9)' }}
              />
            </Tooltip>
          </IconButton>
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table
              stickyHeader
              aria-label="תקלות"
              sx={{
                '& .MuiTableRow-root:hover': {
                  backgroundColor: 'primary.light',
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell align="right">קטגוריה</TableCell>
                  <TableCell align="right">פירוט</TableCell>
                  <TableCell align="right">סכום ברירת מחדל</TableCell>
                  <TableCell align="right">סדר</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workExpensesType &&
                  workExpensesType
                    .filter(
                      (name: IWorkExpensesType) => name.workExpensCategoryId > 1
                    )
                    .map((eType: IWorkExpensesType) => {
                      return (
                        <TableRow key={eType.id} hover>
                          <TableCell align="right">
                            {eType.categoryName}
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              value={eType.workExpensName}
                              onChange={(e) =>
                                updateExpenceTypeName(eType.id, e.target.value)
                              }
                            />{' '}
                          </TableCell>

                          <TableCell align="right">
                            <TextField
                              type="number"
                              value={eType.defValue}
                              onChange={(e) =>
                                updateExpenceTypePrice(eType.id, e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              value={eType.orderIndex}
                              onChange={(e) =>
                                updateExpenceOrderIndex(
                                  eType.id,
                                  e.target.value
                                )
                              }
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}
