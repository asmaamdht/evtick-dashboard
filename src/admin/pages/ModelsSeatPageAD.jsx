import React from 'react'
import MediumSeatMap from '../components/modelsSeat/mediumSeatMap/MediumSeatMap'
function ModelsPageAD() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 flex flex-col gap-6">

        <MediumSeatMap />
      </div>

      <div className="flex-1 flex flex-col gap-6">
      </div>
    </div>
  )
}

export default ModelsPageAD