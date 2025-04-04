import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { differenceInDays, format } from "date-fns";

export default function Input() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const formattedDate = formatDate(selectedDate);

  return (
    <div>
      <div className="bg-surface-container-high px-5 py-3 font-bold flex items-center gap-2">
        <span>{formattedDate}</span>
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => {
            if (date) {
              setSelectedDate(date);
            }
          }}
          dateFormat="(d MMM yyyy)"
          placeholderText="Select date"
          className="bg-surface-container-high outline-none"
        />
      </div>
    </div>
  );
}

const formatDate = (date: Date | null): string => {
  date = date ?? new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  const diffDays = differenceInDays(compareDate, today);

  switch (diffDays) {
    case 0:
      return "Today";
    case 1:
      return "Tomorrow";
    case -1:
      return "Yesterday";
    default:
      const absDay = Math.abs(diffDays);
      return diffDays > 0 ? `${absDay} days after` : `${absDay} days ago`;
  }
};
