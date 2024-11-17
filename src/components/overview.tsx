"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Cell } from "recharts"
import { useState, useEffect } from "react"
import { fetchEnergyData } from "@/scripts/api" // assuming this function fetches the data

function lerpHSL(start, end, t) {
  // Convert hex to HSL
  function hexToHSL(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h, s, l

    l = (max + min) / 2
    if (max === min) {
      h = s = 0 // achromatic
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
        default:
          break
      }
      h /= 6
    }
    return [h * 360, s * 100, l * 100]
  }

  // Interpolate HSL values
  const startHSL = hexToHSL(start)
  const endHSL = hexToHSL(end)
  const h = startHSL[0] + t * (endHSL[0] - startHSL[0])
  const s = startHSL[1] + t * (endHSL[1] - startHSL[1])
  const l = startHSL[2] + t * (endHSL[2] - startHSL[2])

  // Convert HSL back to hex
  function hslToHex(h, s, l) {
    s /= 100
    l /= 100

    const k = (n) => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = (n) => {
      const x = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
      return Math.round(x * 255)
    }
    return `#${f(0).toString(16).padStart(2, "0")}${f(8).toString(16).padStart(2, "0")}${f(4).toString(16).padStart(2, "0")}`
  }

  return hslToHex(h, s, l)
}

export function Overview() {
  const [data, setData] = useState([])

  useEffect(() => {
    async function loadData() {
      try {
        const energyData = await fetchEnergyData()
        if (energyData && energyData.length) {
          setData(energyData)
        } else {
          setPlaceholderData()
        }
      } catch (error) {
        setPlaceholderData()
      }
    }

    function setPlaceholderData() {
      const now = new Date()
      const placeholderData = Array.from({ length: 24 }, (_, i) => {
        const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
        return {
          hour: hour.toTimeString().slice(0, 5), // Format as HH:mm
          energy: Math.floor(Math.random() * 50) + 10, // Random energy value
        }
      }).reverse() // Reverse to ensure latest is on the right
      setData(placeholderData)
    }

    loadData()
  }, [])

  // Find min and max energy values for color interpolation
  const energyMin = Math.min(...data.map((d) => d.energy), 10)
  const energyMax = Math.max(...data.map((d) => d.energy), 50)

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <defs>
          {data.map((entry, index) => {
            // Normalize energy to range 0-1 for color interpolation
            let t = (entry.energy - energyMin) / (energyMax - energyMin)

            // Adjust transition scale to keep more green
            if (t < 0.5) {
              t = t * 0.5 // Slow down scaling in green range
            } else {
              t = 0.5 + (t - 0.7) * 2.5 // Speed up transition to red
            }

            // Clamp t between 0 and 1
            t = Math.max(0, Math.min(1, t))

            const color = lerpHSL("#4CAF50", "#FF9999", t) // From "green energy" green to soft red

            return (
              <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={1} />
                <stop offset="100%" stopColor={color} stopOpacity={0.2} />
              </linearGradient>
            )
          })}
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
        <Bar dataKey="energy" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
