import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { StateCreator } from 'zustand';

interface DateState {
  selectedDate: string; // Stores date as a string in ISO format
  setSelectedDate: (date: string) => void; // Function to update the selected date
}

// Custom type for enhanced readability and reusability of the persist function with specific typing
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
      name: 'date-storage', // Name of the local storage item
      //getStorage: () => localStorage, // Optionally specify storage type, default is localStorage
    }
  )
);

export { useDateStore };
