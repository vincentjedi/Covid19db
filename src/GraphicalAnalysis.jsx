// GraphComponent.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GraphicalAnalysis = ({ data, show }) => {
  const renderBars = () => {
    if (data.length === 0) return null;

    const keys = Object.keys(data[0]).filter(key => key !== 'id'); // Exclude 'id' from keys
    return keys.map((key, index) => (
      <Bar key={index} dataKey={key} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
    ));
  };

  return (
    <>
      {show && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="id" />
            <YAxis />
            <Tooltip />
            <Legend />
            {renderBars()}
          </BarChart>
        </ResponsiveContainer>
      )}
    </>
  );
};

export default GraphicalAnalysis;
