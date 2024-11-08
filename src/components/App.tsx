"use client";

import React, { Component } from "react";

import DWTEditBar from "./DWTEditBar";
import DWTScan from "./DWTScan";
import DWTUploadAndSave from "./DWTUploadAndSave";
import OutputMessage from "./OutputMessage";
import { DwtUIOperations } from "./tools/dwtUIOperations";
import MetaInformation from "./MetaInformation";

const containerId = "dwtcontrolContainer";
const dwtUtil = new DwtUIOperations(containerId);

export default class Dwt extends Component {
  componentDidMount() {
    dwtUtil.onPageInit();
  }

  componentWillUnmount() {
    dwtUtil.destroy();
  }

  render() {
    return (
      <>
        {/* <div className="ds-dwt-logo"><img src="assets/Images/logo.png" /></div> */}
        <div className="ds-dwt-content ds-dwt-center">
          <div className="ds-dwt-header">
            <h1>Scan documents</h1>
          </div>
        </div>
        <div className="ds-dwt-content ds-dwt-center">
          <div id="DWTcontainerTop">
            <DWTEditBar dwtUtil={dwtUtil}></DWTEditBar>
            <div id={containerId}></div>
          </div>
          <div id="ScanWrapper">
            <DWTScan dwtUtil={dwtUtil}></DWTScan>
            <MetaInformation dwUtil={dwtUtil} />

            {/* <DWTUploadAndSave dwtUtil={dwtUtil}></DWTUploadAndSave> */}
            {/* <OutputMessage></OutputMessage> */}
          </div>
        </div>
      </>
    );
  }
}
