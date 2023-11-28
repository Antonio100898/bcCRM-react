import { IshiftDetail } from '../../Model/IShifsForShiftType';
import './WorkerShift.styles.css';

interface Iprop {
  shift: IshiftDetail;
}

export default function WorkerShift({ shift }: Iprop) {
  return (
    <div
      style={{
        display: 'flex',
        flex: 'row',
        width: '100%',
        borderBottom: '1px solid #EFEFEF',
        transform: 'rotate(-0.43deg)',
        padding: '5px',
      }}
    >
      <div style={{ width: '5%' }} className="dayDiv">
        יום
        <br />
        <b>{shift.dayName}</b>
      </div>
      <div
        style={{
          width: '85%',
          textAlign: 'right',
          display: 'flex',
          flexDirection: 'column',
          marginRight: '10px',
        }}
      >
        <div className="jobType">{shift.jobTypeName}</div>

        <div className="placeName">{shift.placeName && shift.placeName}</div>
      </div>
      <div
        style={{
          width: '10%',
        }}
        className="hours"
      >
        {shift.startHour}
        <br />
        {shift.finishHour}
      </div>
    </div>
  );
}
