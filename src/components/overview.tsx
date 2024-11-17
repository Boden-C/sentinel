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
  const targetReduction = 0.15;
  const perHourReduction = targetReduction / numPredictions;

  const lastDate = new Date(`2000/01/01 ${historicalData[historicalData.length - 1].hour}`);
  const predictions = [];

  for (let i = 1; i <= numPredictions; i++) {
    const nextDate = new Date(lastDate.getTime() + i * 60 * 60 * 1000);
    const reductionFactor = 1 - (perHourReduction * i);
    const variation = (Math.random() * 0.04) - 0.02;
    const predictedEnergy = lastValue * (reductionFactor + variation);

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

  useEffect(() => {
    async function loadData() {
      try {
        const energyData = await fetchEnergyData();
        if (energyData && energyData.length) {
          setData(energyData);
          const predictions = predictNextValues(energyData);
          setCombinedData([...energyData, ...predictions]);
        } else {
          setPlaceholderData();
        }
      } catch (error) {
        setPlaceholderData();
      }
    }

    function setPlaceholderData() {
      const now = new Date();
      const placeholderData = Array.from({ length: 24 }, (_, i) => {
        const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
        return {
          hour: hour.toTimeString().slice(0, 5),
          energy: Math.floor(Math.random() * 50) + 10,
        };
      }).reverse();
      setData(placeholderData);
      const predictions = predictNextValues(placeholderData);
      setCombinedData([...placeholderData, ...predictions]);
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
            strokeWidth: 2,
            fill: "#fff",
            r: 5,
            stroke: "#888888",
          }}
          connectNulls
        />
        <Line
          type="monotone"
          dataKey="predictedEnergy"
          stroke="#888888"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
          activeDot={{
            r: 6,
            fill: "#fff",
            stroke: "#888888",
            strokeWidth: 2,
          }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}




