import { useStore } from "../lib/store";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import CycleCalendar from "../components/CycleCalendar";
import NutritionalGuidance from "../components/NutritionalGuidance";
import PartnerNotifications from "../components/PartnerNotifications";
import EducationalContent from "../components/EducationalContent";
import SymptomLogModal from "../components/SymptomLogModal";
import { useState } from "react";

function Home() {
  const user = useStore((state) => state.user);
  const setCycles = useStore((state) => state.setCycles);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const { data: cycles } = useQuery(["cycles"], async () => {
    const response = await api.get("/cycles");
    setCycles(response);
    return response;
  });

  if (!user) return <div>Please log in.</div>;

  return (
    <div className="home">
      <h1>Welcome, {user.email}</h1>
      <CycleCalendar
        cycles={cycles || []}
        onDateClick={(date) => {
          setSelectedDate(date);
          setModalOpen(true);
        }}
      />
      <NutritionalGuidance phase="follicular" />
      <PartnerNotifications sharedData={[]} />
      <EducationalContent />
      <SymptomLogModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} date={selectedDate} />
    </div>
  );
}

export default Home;
