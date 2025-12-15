import React from 'react'
import MediumSeatMap from '../components/modelsSeat/mediumSeatMap/MediumSeatMap'
import SmallSeatMap from '../components/modelsSeat/smallSeatMap/SmallSeatMap'
function ModelsPageAD() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex-1 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-gray-700">Medium Model</h2>
        <MediumSeatMap />
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-gray-700">Small Model (Angled)</h2>
        <SmallSeatMap />
      </div>
    </div>
  )
}

export default ModelsPageAD