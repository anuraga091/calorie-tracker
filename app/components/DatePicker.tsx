import { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, getDate, parseISO, formatISO } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDateStore } from '../store/dateStore';
import Image from 'next/image';

interface DatePickerProps {
  initialView?: 'date' | 'expanded';
}

const CustomDatePicker: React.FC<DatePickerProps> = ({ initialView = 'date' }) => {
  const { selectedDate, setSelectedDate } = useDateStore();
  const [view, setView] = useState<'date' | 'expanded'>(initialView);
  const [selectedDateState, setSelectedDateState] = useState<Date>(parseISO(selectedDate));

  useEffect(() => {
    const newDate = parseISO(selectedDate);
    setSelectedDateState(newDate);
  }, [selectedDate]);

  const handleDateClick = (date: Date | null) => {
    if (date) {
      setSelectedDateState(date);
      setSelectedDate(formatISO(date, { representation: 'date' }));
    }
  };

  const toggleView = () => {
    setView(view === 'date' ? 'expanded' : 'date');
  };

  return (
    <div className="date-picker border p-4 rounded-lg shadow bg-white">
      <div className="flex justify-between items-center mb-2">
        <div className="relative">
          <button onClick={toggleView} className="relative z-10 flex items-center">
            {format(selectedDateState, 'MMMM')}
            <span className={`ml-2 transform ${view === 'expanded' ? 'rotate-180' : ''}`}>
              &#9662;
            </span>
          </button>
        </div>
        <div className="react-datepicker">
          <DatePicker
            selected={selectedDateState}
            onChange={handleDateClick}
            customInput={
              <button>
                <Image src="/calender.png" alt="calendar" width={24} height={24} />
              </button>
            }
          />
        </div>
      </div>
      {view === 'expanded' && (
        <div className="calendar-grid grid grid-cols-7 gap-2 mt-6">
          {Array.from({ length: 7 }).map((_, i) => {
            const day = addDays(startOfWeek(selectedDateState), i);
            const isSelected = getDate(day) === getDate(selectedDateState);
            return (
              <button
                key={i}
                onClick={() => handleDateClick(day)}
                className={`calendar-day ${isSelected ? ' text-blue-500' : ''} p-2 rounded`}
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
