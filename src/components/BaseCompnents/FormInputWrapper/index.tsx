import { Box } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  label?: string;
};

export default function FormInputWrapper({ children, label }: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Box sx={{ fontWeight: 'bold' }}>{label}</Box>
      {children}
    </Box>
  );
}
