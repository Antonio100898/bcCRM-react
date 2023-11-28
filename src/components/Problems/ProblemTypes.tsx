import './ProblemNote.styles.css';
import { Avatar, Chip } from '@mui/material';
import { IProblemType } from '../../Model/IProblemType';

export interface IProp {
  problemTypes: IProblemType[];
}

export function ProblemTypes({ problemTypes }: IProp) {
  return (
    <div style={{ display: 'flex', flex: 'row', flexWrap: 'wrap' }}>
      {problemTypes &&
        problemTypes.map((pType: IProblemType) => {
          return (
            <Chip
              key={pType.id}
              style={{ margin: '3px' }}
              label={pType.problemTypeName}
              size="small"
              variant="outlined"
              avatar={
                <Avatar
                  sx={{ bgcolor: pType.color }}
                  style={{
                    marginRight: '5px',
                    border: '1px solid black',
                    opacity: '0.7',
                  }}
                >
                  {' '}
                </Avatar>
              }
            />
          );
        })}
    </div>
  );
}

export default ProblemTypes;
