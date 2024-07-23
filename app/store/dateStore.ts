import {create} from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

interface DateState {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

type MyPersist = (
  config: StateCreator<DateState>,
  options: PersistOptions<DateState>
) => StateCreator<DateState>;

const useDateStore = create<DateState>(
  (persist as MyPersist)(
    (set) => ({
      selectedDate: new Date().toISOString().split('T')[0],
      setSelectedDate: (date: string) => set({ selectedDate: date }),
    }),
    {
      name: 'date-storage',
    }
  )
);

export { useDateStore };
