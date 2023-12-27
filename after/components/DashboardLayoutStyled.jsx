import React from 'react'
import BurnBottomBar from './BurnBottomBar'
import BurnStatsContainer from './BurnStatsContainer'

function DashboardLayoutStyled() {
  return (
    <DashboardLayoutStyled className="burnpage">
    <div
      className="top_conatiner burnpage"
      style={{ alignItems: "flex-start" }}
    >
      <div className="info_box filled">
        <h1 className="title">App TOKEN BURN</h1>
        <p className="description medium"></p>

        <BurnBottomBar/>
      </div>
      <BurnStatsContainer/>

    </div>
  </DashboardLayoutStyled>
  )
}

export default DashboardLayoutStyled
