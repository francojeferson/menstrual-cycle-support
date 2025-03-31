function NutritionalGuidance({ phase }) {
  const recommendations = {
    follicular: ["Foods rich in iron", "Leafy greens"],
    ovulation: ["Antioxidants", "Berries"],
    luteal: ["Magnesium-rich foods", "Nuts and seeds"],
    menstruation: ["Vitamin B6", "Bananas"],
  };

  return (
    <div>
      <h3>Nutritional Recommendations for {phase} phase</h3>
      <ul>
        {recommendations[phase].map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default NutritionalGuidance;
