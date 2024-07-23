import { useState, useEffect } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDateStore } from '../store/dateStore';
import Image from 'next/image'

interface DatePickerProps {
  initialView?: 'date' | 'expanded';
}

const getMonthName = (date: Date): string => {
  return date.toLocaleString('default', { month: 'long' });
};


const CustomDatePicker: React.FC<DatePickerProps> = ({ initialView = 'date'}) => {
  const { selectedDate, setSelectedDate } = useDateStore();
  const [view, setView] = useState<'date' | 'expanded'>(initialView);
  const [selectedDateState, setSelectedDateState] = useState<Date>(new Date(selectedDate));
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(selectedDate));

  useEffect(() => {
    const newDate = new Date(selectedDate);
    setSelectedDateState(newDate);
    setCurrentMonth(new Date(newDate.getFullYear(), newDate.getMonth()));
  }, [selectedDate]);

  const startDate = startOfWeek(selectedDateState);

  const handleDateClick = (date: Date) => {
    setSelectedDateState(date);
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth()));
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const toggleView = () => {
    setView(view === 'date' ? 'expanded' : 'date');
  };

  return (
    <div className="date-picker border p-4 rounded-lg shadow bg-white">
      <div className="flex justify-between items-center mb-2">
        <div className="relative">
          <button onClick={toggleView} className="relative z-10 flex items-center">
            {format(currentMonth, 'MMMM')}
            <span className={`ml-2 transform ${view === 'expanded' ? 'rotate-180' : ''}`}>
              &#9662;
            </span>
          </button>
        </div>
        <div className='react-datepicker'>
          <DatePicker
            selected={selectedDateState}
            onChange={(date: Date) => handleDateClick(date)}
            customInput={
              <button>
                <Image src="/calender.png" alt="calender" width={24} height={24}/>
              </button>
            }
            
          />
        </div>
      </div>
      {view === 'expanded' && (
        <div className="calendar-grid">
          {Array.from({ length: 7 }).map((_, i) => {
            const day = addDays(startDate, i);
            return (
              <button
                key={i}
                onClick={() => handleDateClick(day)}
                className={`calendar-day ${day.getDate() === selectedDateState.getDate() ? 'bg-blue-500 text-white' : ''}`}
              >
                {format(day, 'eee d')}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
