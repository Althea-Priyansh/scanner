"use client";
import React, { useCallback, useEffect, useState } from "react";
import { DwtUIOperations } from "./tools/dwtUIOperations";
import { useParams, useSearchParams } from "next/navigation";

const MetaInformation = ({ dwUtil }, { dwUtil: DwtUIOperations }) => {
  const searchParams = useSearchParams();

  const [claimNo, setClaimNo] = useState<string>();
  const [inwardNo, setinwardNo] = useState<string>();
  const searchValue = searchParams.get("claimNo");
  const searchValueInward = searchParams.get("inwardNo");
  useEffect(() => {
    if (searchValue) {
      setClaimNo(searchValue);
    }
    if (searchValueInward) {
      setinwardNo(searchValueInward);
    }
  }, [searchValue, searchValueInward]);

  const onClaimChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setClaimNo(e.target.value);
    },
    []
  );

  const onInwardChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setClaimNo(e.target.value);
    },
    []
  );

  console.log(searchParams.get("claimNo"));
  return (
    <div id="divScanner" className="divinput">
      <ul className="PCollapse">
        <li>
          <div className="divType">Meta Information</div>
          <div id="div_ScanImage" className="divTableStyle">
            <ul id="ulScaneImageHIDE" style={{ marginBottom: "10px" }}>
              <li>
                <label htmlFor="source">
                  <p>Claim No</p>
                </label>

                <input
                  size={1}
                  value={claimNo}
                  onChange={onClaimChange}
                  id="source"
                  style={{
                    position: "relative",
                    width: "100%",
                    padding: "8px",
                  }}
                  //   onChange={(event) => this.onSourceChange(event)}
                />
              </li>
            </ul>
            <ul id="ulScaneImageHIDE">
              <li>
                <label htmlFor="source">
                  <p>Inward No</p>
                </label>

                <input
                  size={1}
                  value={inwardNo}
                  onChange={onInwardChange}
                  id="source"
                  style={{
                    position: "relative",
                    width: "100%",
                    padding: "8px",
                  }}
                  //   onChange={(event) => this.onSourceChange(event)}
                />
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default MetaInformation;
