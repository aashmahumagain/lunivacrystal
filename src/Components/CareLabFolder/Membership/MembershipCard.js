import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
// import CarelabFilter from "../../Common/CarelabFilter";
import { printMembership } from "./MembershipPrint";
import { getMemberShipDetailsByMemberId } from "../../../services/careLabService";

import PageHeader from "../../Common/pageHeader";
import cry from "../../../assets/images/cry.png";
import logosmall from "../../../assets/images/logosmall.png";
import { useDispatch } from "react-redux";
import CarelabFilter from "../../Common/CarelabFilter";

function MembershipCard() {
  const [data, setData] = useState([]);
  // const [dyColumn, setDyColumn] = useState([]);
  const [dyColumnData, setDyColumnData] = useState([]);
  const dispatch = useDispatch();
  const d = new Date();
  const e = d.toISOString().split("T")[0];

  const dyColumn = [
    {
      key: "Id",
      dataIndex: "Id",
      title: "Id",
    },
    {
      key: "Name",
      dataIndex: "Name",
      title: "Name",
    },
    {
      key: "Member Code",
      dataIndex: "MemberCode",
      title: "Member Code",
    },
    {
      key: "Address",
      dataIndex: "Address",
      title: "Address",
    },
    {
      key: "Contact",
      dataIndex: "ContactNo",
      title: "Phone No.",
    },
    {
      key: "DOB",
      dataIndex: "DateOfBirth",
      title: "Date of Birth",
    },
    {
      key: "IssuedDate",
      dataIndex: "Date",
      title: "Issued Date",
    },
    {
      key: "Action ",
      dataIndex: "Action",
      title: "Action",
      render: (data, row, meta) => {
        return <Button onClick={() => onFinish(row)}> Print</Button>;
      },
    },
  ];

  useEffect(() => {
    loadMemberData()
  }, []);

  const loadMemberData = (memberId=0) => {
    let a = {
      mId: memberId,
    };
    dispatch(
      getMemberShipDetailsByMemberId(a, (res) => {
        // console.log(res);
        if (res.length > 0) {
          setDyColumnData(res);
          // console.log(res);
        } else {
          setDyColumnData([]);
        }
      })
    );
  }

  const onFinish = (values) => {
    {
      const urlhref = window.location.href,
        newpath = urlhref.split("luniva360lims");
      const imagePath = `${newpath[0]}${cry}`;
      const small = `${newpath[0]}${logosmall}`;
      
      printMembership(imagePath, small, values, e);
    }
  };

  const returnFilterData = (res) => {
    loadMemberData(res?.sampleId)
  }

  return (
    <>
      <div className="maiTopContainer">
        <PageHeader pageTitle={"Membership Card"} />
        {/* <Button onClick={onFinish}> Print</Button> */}
      </div>
      <CarelabFilter
      showSampleId={'Member Id'}
      returnFilterData={returnFilterData}
      />
      {dyColumnData.length > 0 && (
        <div className="tableisRes">
          <Table
            className="tableWidth"
            columns={dyColumn}
            dataSource={dyColumnData}
          />
        </div>
      )}
    </>
  );
}

export default MembershipCard;
