"use client";

import { LineChart, ResponsiveContainer, XAxis, YAxis, Line } from "recharts";
import { useState, useEffect } from "react";
import { fetchEnergyData } from "@/scripts/api";

function getColor(value, min, max) {
  if (min === max) return "rgb(0, 255, 0)";
  const t = (value - min) / (max - min);
  const r = Math.round(255 * t);
  const g = Math.round(255 * (1 - t));
  const b = 0;
  return `rgb(${r}, ${g}, ${b})`;
}

function predictNextValues(historicalData, numPredictions = 6) {
  const lastValue = historicalData[historicalData.length - 1].energy;
  const targetIncrease = 0.10; // Target increase over the prediction period
  const perHourIncrease = targetIncrease / numPredictions;

  const lastDate = new Date(`2000/01/01 ${historicalData[historicalData.length - 1].hour}`);
  const predictions = [];

  for (let i = 1; i <= numPredictions; i++) {
    const nextDate = new Date(lastDate.getTime() + i * 60 * 60 * 1000);
    const increaseFactor = 1 + (perHourIncrease * i);
    const variation = (Math.random() * 0.03) - 0.01; // Add slight random variation with bias towards increase
    const predictedEnergy = lastValue * (increaseFactor + variation);

    predictions.push({
      hour: nextDate.toTimeString().slice(0, 5),
      energy: i === 1 ? lastValue : null,
      predictedEnergy,
    });
  }

  return predictions;
}



export function Overview() {
  const [data, setData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [showPredictionLine, setShowPredictionLine] = useState(false); // State to control the delay

  useEffect(() => {
    async function loadData() {
      try {
        const energyData = await fetchEnergyData();
        if (energyData && energyData.length) {
          setData(energyData);
          const predictions = predictNextValues(energyData);
          setCombinedData([...energyData, ...predictions]);

          // Delay the appearance of the prediction line (start animating after 1 second)
          setTimeout(() => {
            setShowPredictionLine(true);
          }, 1000); // Delay in milliseconds
        } else {
          setPlaceholderData();
        }
      } catch (error) {
        setPlaceholderData();
      }
    }

    function setPlaceholderData() {
      const now = new Date();
      
      // Generate energy data based on time of day (simple day-night cycle model)
      const placeholderData = Array.from({ length: 24 }, (_, i) => {
        const hour = Math.floor((now.getHours() + i) % 24); // Round down hour
        let energy;
    
        // Simulate a pattern where energy usage increases during the day (6 AM to 6 PM) and decreases at night (6 PM to 6 AM)
        if (hour >= 6 && hour < 18) {
          energy = Math.floor(30 + Math.random() * 20); // Peak energy usage during the day (30 - 50)
        } else {
          energy = Math.floor(10 + Math.random() * 10); // Lower energy usage during the night (10 - 20)
        }
    
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        time.setMinutes(0, 0, 0); // Set minutes, seconds, and milliseconds to 0
        return {
          hour: time.toTimeString().slice(0, 5),
          energy,
        };
      }).reverse(); // Reverse the data array to match the timeline
    
      setData(placeholderData);
      const predictions = predictNextValues(placeholderData);
      setCombinedData([...placeholderData, ...predictions]);
    
      // Delay the appearance of the prediction line (start animating after 1 second)
      setTimeout(() => {
        setShowPredictionLine(true);
      }, 1000); // Delay in milliseconds
    }
    
    

    loadData();
  }, []);

  const energyMin = Math.min(
    ...combinedData.map((d) => d.energy || d.predictedEnergy),
    10
  );
  const energyMax = Math.max(
    ...combinedData.map((d) => d.energy || d.predictedEnergy),
    50
  );

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={combinedData}>
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="1" x2="0" y2="0">
            {Array.from({ length: 10 }, (_, i) => {
              const value = energyMin + ((energyMax - energyMin) * i) / 9;
              return (
                <stop
                  key={`stop-${i}`}
                  offset={`${i * 10}%`}
                  stopColor={getColor(value, energyMin, energyMax)}
                />
              );
            })}
          </linearGradient>
        </defs>
        <XAxis
          dataKey="hour"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value} kWh`}
        />
        <Line
          type="monotone"
          dataKey="energy"
          stroke="url(#lineGradient)"
          strokeWidth={3}
          dot={{
            strokeWidth: 1,
            fill: "#fff",
            r: 3,
            stroke: "#888888",
          }}
          connectNulls
          animationDuration={1000} // Duration of the first line animation
        />
        {showPredictionLine && (
          <Line
            type="monotone"
            dataKey="predictedEnergy"
            stroke="#888888"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            activeDot={{
              r: 3,
              fill: "#fff",
              stroke: "#888888",
              strokeWidth: 1,
            }}
            connectNulls
            animationDuration={1500}  // Slower animation (increased duration)
            animationBegin={1000}  // Delay the start of the prediction line animation
            className="pulseStroke" // Apply pulsing effect via CSS class
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}

