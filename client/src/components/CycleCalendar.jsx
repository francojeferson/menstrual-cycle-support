import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "../styles/CycleCalendar.module.css";

function CycleCalendar({ cycles, onDateClick }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button onClick={prevMonth}>
          <ChevronLeft />
        </button>
        <span>{currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}</span>
        <button onClick={nextMonth}>
          <ChevronRight />
        </button>
      </div>
      <div className={styles.days}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`}></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
          const isCycleDay = cycles.some(
            (cycle) => date >= new Date(cycle.start_date) && date <= new Date(cycle.end_date),
          );
          return (
            <div key={i} className={isCycleDay ? styles.cycleDay : ""} onClick={() => onDateClick(date)}>
              {i + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CycleCalendar;
