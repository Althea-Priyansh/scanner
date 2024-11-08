"use client";
import { Component, useState } from "react";

import { getEl, getInputEl } from "./tools/common";
import { DwtUIOperations } from "./tools/dwtUIOperations";

export default class DWTUploadAndSave extends Component<{
  dwtUtil: DwtUIOperations;
}> {
  constructor(props) {
    super(props);
    this.state = {
      strFileNameWithoutExt: "WebTWAINImage",
      strExtension: "pdf",
      bAllPages: true,
    };
  }

  state: {
    strFileNameWithoutExt: string;
    strExtension: string;
    bAllPages: boolean;
  };

  setFileNameWithoutExt(value) {
    this.state.strFileNameWithoutExt = value;
    this.setState(this.state);
  }
  setAllPages(value) {
    this.state.bAllPages = value;
    this.setState(this.state);
  }

  handleFileNameChange(evt) {
    let el = evt.target;
    this.setFileNameWithoutExt(el.value);
  }

  handleImageExtensionChange(evt) {
    let el = evt.target;
    let strNewExtension = el.value;
    strNewExtension = strNewExtension.toLowerCase();
    this.state.strExtension = strNewExtension;

    let currentPage = getInputEl("CurrentPage");
    let allPages = getInputEl("AllPages");

    // set AllPages OR CurrentPage
    switch (strNewExtension) {
      case "pdf":
        this.state.bAllPages = true;
        break;
      case "tif":
      case "bmp":
      case "jpg":
      case "png":
        this.state.bAllPages = false;
        break;
      default:
        break;
    }
    this.setState(this.state);

    // set Enabled
    if (strNewExtension == "pdf" || strNewExtension == "tif") {
      if (currentPage) {
        currentPage.disabled = false;
      }

      if (allPages) {
        allPages.disabled = false;
      }
    } else {
      if (currentPage) {
        currentPage.disabled = true;
      }

      if (allPages) {
        allPages.disabled = true;
      }
    }
  }

  saveOrUploadImage(saveType) {
    let strAllPages = this.state.bAllPages.toString();
    console.log(strAllPages);
    this.props.dwtUtil.save(
      saveType,
      this.state.strFileNameWithoutExt,
      this.state.strExtension,
      strAllPages
    );
  }

  showCustomInfo() {
    let el = getEl("customDetail");
    if (el) el.style.display = "";
  }

  hideCustomInfo() {
    let el = getEl("customDetail");
    if (el) el.style.display = "none";
  }

  onclickShowUploadedFiles() {
    this.props.dwtUtil.onclickShowUploadedFiles();
  }

  onclickSaveDocuments() {
    this.props.dwtUtil.onclickSaveDocuments();
  }

  render() {
    return (
      <>
        <div
          id="divUpload"
          className="divinput mt30"
          style={{ position: "relative" }}
        >
          <ul>
            <li>
              <div className="divType">Save Documents</div>
            </li>
          </ul>
        </div>
        <div id="tabCon" className="divinput mt30">
          <div id="divSaveDetail">
            <ul>
              <li>
                <p>File Name:</p>
                <input
                  type="text"
                  size={20}
                  value={this.state.strFileNameWithoutExt}
                  onChange={(event) => this.handleFileNameChange(event)}
                />
                <span> . </span>
                <select
                  size={1}
                  id="fileType"
                  style={{ position: "relative", width: "25%" }}
                  value={this.state.strExtension}
                  onChange={(event) => this.handleImageExtensionChange(event)}
                >
                  <option value="pdf">pdf</option>
                  <option value="tif">tif</option>
                  <option value="jpg">jpg</option>
                  <option value="png">png</option>
                  <option value="bmp">bmp</option>
                </select>
              </li>
              <li>
                <span> Pages: </span>
                <label htmlFor="CurrentPage" style={{ marginLeft: "5px" }}>
                  <input
                    type="radio"
                    id="CurrentPage"
                    checked={!this.state.bAllPages}
                    onChange={(event) => this.setAllPages(false)}
                    name="Pages"
                  />
                  Current Page&nbsp;
                </label>
                <label htmlFor="AllPages">
                  <input
                    type="radio"
                    id="AllPages"
                    checked={this.state.bAllPages}
                    onChange={(event) => this.setAllPages(true)}
                    name="Pages"
                  />
                  All Pages
                </label>
              </li>
              <li>
                <span
                  className="customInfo"
                  onMouseOver={(event) => this.showCustomInfo()}
                  onMouseOut={(event) => this.hideCustomInfo()}
                >
                  Optional Custom Info <i className="fa fa-download"></i>
                </span>{" "}
                :
                <div style={{ display: "none" }} id="customDetail">
                  You can input any custom info to be uploaded with your images.
                </div>
                <input type="text" id="txt_CustomInfo" />
              </li>
              <li>
                <input
                  id="btnUpload"
                  className="btnOrg"
                  type="button"
                  value="Upload"
                  onClick={(event) => this.saveOrUploadImage("server")}
                />
                <a
                  id="btnSave"
                  className="btnLoadAndSave"
                  onClick={(event) => this.saveOrUploadImage("local")}
                >
                  Save to Local Drive &gt;
                </a>
              </li>
            </ul>
          </div>
          <div id="divUploadedFiles" style={{ display: "none" }}>
            <div id="resultWrap"></div>
          </div>
        </div>
      </>
    );
  }
}
