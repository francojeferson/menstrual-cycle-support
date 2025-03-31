function PartnerNotifications({ sharedData }) {
  const upcomingPhases = sharedData.filter((data) => new Date(data.start_date) > new Date());
  return (
    <div>
      <h3>Upcoming Phases</h3>
      <ul>
        {upcomingPhases.map((phase, index) => (
          <li key={index}>
            {phase.phase} starting on {new Date(phase.start_date).toDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PartnerNotifications;
