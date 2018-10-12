import React, { Component } from 'react';
/*
Custom Table Component made to manageeach tab data in once component on passing them
tabName, data, Click function as props.
*/
const CustomTable = (props) => {
  let { onClick, data, tabName, onChangeText } = props
  return (
    <table className='table table-borderless'>
      {
        tabName === "NodeStatus"
        ? null
        :
        tabName === "Survey"
        ?
          <thead>
            <tr>
              <td><b>Nodes</b></td>
              <td><b>Packets : Green/Yellow/Red/Missed</b></td>
            </tr>
          </thead>
        :
          <thead>
            <tr>
              <td><b>Nodes</b></td>
              <td><b>Status</b></td>
            </tr>
          </thead>
      }
      <tbody>
      {
        data.map((row, index) => {
          if(tabName === "NodeStatus") {
            let label ="";
            if(row.LabelName == "LowPassFilter") {
              label = "Low Pass Filter"
            }
            if(row.LabelName == "SampleHighLowCounter") {
              label = "Sample High/Low Counter"
            }
            if(row.LabelName == "ReportRate") {
              label = "Report Rate"
            }
            if(row.LabelName == "SampleRate") {
              label = "Sample Rate"
            }
            if(row.LabelName == "BaseLineFilter") {
              label = "BaseLine Filter"
            }
            if(row.LabelName == "Threshold") {
              label = "Threshold"
            }
            if(row.LabelName == "Hysteresis") {
              label = "Hysteresis"
            }
            return (
    					<tr key ={index} onClick={()=>onClick(row)}>
    						<td className="tdfirst" style={{textAlign:"left",width:"40%"}}>
                  {label}
                </td>
    						<td className="tdsecond" style={{width:"40%"}}>
                  {row.ReadValue == null ? 0 : row.ReadValue}
                </td>
    						<td className="tdthird" style={{textAlign:"left",width:"20%"}}>
                  <input onChange = {(e)=>onChangeText(e, row)}
                    className="form-control" placeholder="" type="text"/>
                </td>
    					</tr>
            )
          }
          if(tabName === "Survey") {
            return (
    					<tr key ={index} onClick={()=>onClick(row)}>
    						<td>
                  {row.DeviceId == 0 ? "Gateway" : row.DeviceId}
                </td>
    						<td>
                  {row.PacketsGYR == null ? "0/0/0/0" : row.PacketsGYR}
                </td>
    					</tr>
            )
          }
          else {
            return (
    					<tr className = "selectPointer" key ={index} onClick={()=>onClick(row)}>
    						<td>
                  {row.DeviceId == 0 ? "Gateway" : row.DeviceId}
                </td>
    						<td>
                  {row.Status}
                </td>
    					</tr>
            )
          }

        })
      }
      </tbody>
    </table>
  )
}

export default CustomTable
