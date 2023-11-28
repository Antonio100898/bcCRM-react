import { Box, Typography, useTheme } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import dayjs from 'dayjs';
import { forwardRef, useMemo } from 'react';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export type ProblemAlertProps = {
  lastSupporter: string;
  historySummery: string;
};

const ProblemAlert = forwardRef<React.Ref<unknown>, ProblemAlertProps>(
  (props, ref) => {
    const theme = useTheme();

    const backColor = useMemo(() => {
      const segments = props.historySummery.split(', ');

      try {
        const highest =
          segments
            .map((s) => parseInt(s.split(' ')[0], 10))
            .sort((a, b) => a - b)
            .pop() || 0;

        if (highest >= 10) return theme.palette.error.main;
        if (highest >= 5) return theme.palette.error.light;
        if (highest > 0) return theme.palette.warning.light;
        return theme.palette.info.light;
      } catch (error) {
        return theme.palette.info.light;
      }
    }, [props.historySummery, theme.palette]);

    const lastSupporterName = useMemo(
      () =>
        props.lastSupporter
          .replace('תומך אחרון שדיבר עם הלקוח: ', '')
          .split(' בתאריך: ')[0],
      [props.lastSupporter]
    );

    const lastSupporterDate = useMemo(() => {
      return dayjs(
        props.lastSupporter
          .replace('תומך אחרון שדיבר עם הלקוח: ', '')
          .split(' בתאריך: ')[1],
        'DD-MM-YYYY HH:mm'
      ).format('HH:mm DD/MM');
    }, [props.lastSupporter]);

    return (
      <Box
        ref={ref}
        sx={{
          display: 'flex',
          gap: 0.5,
          alignItems: 'center',
          borderRadius: 2,
          padding: 2,
          backgroundColor: backColor,
          color: theme.palette.getContrastText(backColor),
        }}
        {...props}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Typography>{props.historySummery}</Typography>
          <Typography>
            {lastSupporterName} ערך/ה את הטיקט ב-{lastSupporterDate}
          </Typography>
        </Box>
        <WarningIcon sx={{ alignSelf: 'start' }} />
      </Box>
    );
  }
);

ProblemAlert.displayName = 'ProblemAlert';
export { ProblemAlert };
