import { Col, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Filter from "../Common/Filter";
import PageHeader from "../Common/pageHeader";
import { getDataMetricReportByReportTypeAndDateRange } from "../../services/datametricService";

import { useDispatch } from "react-redux";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import DoughnutChart from "./DoughnutChart";
import DataIsLoading from "../Common/IsLoading";

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

const columns = [
  {
    title: "Date",
    dataIndex: "Day",
    key: "Day",
  },
  {
    title: "Nepali Date",
    dataIndex: "NepaliDay",
    key: "NepaliDay",
  },
  {
    title: "Total Patient",
    dataIndex: "Total Patient",
    key: "TotalPatient",
  },
  {
    title: "Total Amount",
    dataIndex: "Total Amount",
    key: "TotalAmount",
  },
  {
    title: "Dues",
    dataIndex: "Dues",
    key: "Dues",
  },
  {
    title: "Paid",
    dataIndex: "Paid",
    key: "Paid",
  },
];

const Index = () => {
  const dispatch = useDispatch();
  const [PayPie, setPayPie] = useState([]);
  const [PayBar1, setPayBar1] = useState([]);
  const [PayBar2, setPayBar2] = useState([]);
  const [PayRef, setPayRef] = useState([]);
  const [PayReq, setPayReq] = useState([]);
  const [PayTable, setPayTable] = useState([]);

  const [PayPieLabel, setPayPieLabel] = useState([]);
  const [PayBarLabel, setPayBarLabel] = useState([]);
  const [PayRefLabel, setPayRefLabel] = useState([]);
  const [PayReqLabel, setPayReqLabel] = useState([]);

  const [IsLoading, setIsLoading] = useState(false);

  const getDataForReport = (data) => {
    setIsLoading(true);
    dispatch(
      getDataMetricReportByReportTypeAndDateRange(data, (val) => {
        setPayTable(val?.Table4);
        //for pie
        let pusPayPie = [];
        let pusPayPieLabel = [];
        val.ReportDetails.forEach((ele) => {
          pusPayPie.push(ele?.Total);
          pusPayPieLabel.push(ele?.BIllPaymentType);
        });
        setPayPie(pusPayPie);
        setPayPieLabel(pusPayPieLabel);
        // for bar
        let pshBar1 = [];
        let pshBar2 = [];
        let pshBarLabel = [];
        val.Table1.forEach((ele) => {
          pshBar1.push(ele?.PAID);
          pshBar2.push(ele?.UNPAID);
          pshBarLabel.push(ele?.Date.split("T")[0]);
        });
        setPayBar1(pshBar1);
        setPayBar2(pshBar2);
        setPayBarLabel(pshBarLabel);

        // for refer
        let pshRef = [];
        let pushReflabel = [];
        val.Table2.forEach((ele) => {
          pshRef.push(ele?.Total);
          pushReflabel.push(ele?.Referrer);
        });
        setPayRefLabel(pushReflabel);
        setPayRef(pshRef);

        // for requestor
        let pshReq = [];
        let pushReQlabel = [];
        val.Table3.forEach((ele) => {
          pshReq.push(ele?.Total);
          pushReQlabel.push(ele?.Requestor);
        });
        setPayReqLabel(pushReQlabel);
        setPayReq(pshReq);
        setIsLoading(false);
      })
    );

    if (PayBar1 == []) {
      setIsLoading(false);
    }
  };

  const dataRet = (val) => {
    let data = {
      ...val,
      fromdate: val[0].format("YYYY-MM-DD"),
      todate: val[1].format("YYYY-MM-DD"),
    };
    getDataForReport(data);
  };

  useEffect(() => {
    const fd = new Date();
    const date = `${fd.getFullYear()}-${fd.getMonth() + 1}-${fd.getDate()}`;
    const data = {
      fromdate: date,
      todate: date,
    };
    getDataForReport(data);
  }, []);

  return (
    <FinanceDashbordContainer>
      <div className="maiTopContainer">
        <PageHeader pageTitle="Finance Dashboard" />
        <Filter dateRange dateRet={dataRet} serchButton />
      </div>
      {/* loading pop up */}
      {PayBar1 === [] ? (
        <DataIsLoading />
      ) : (
        <div className="mainContainer">
          <Row>
            <Col lg={24} md={24} sm={24} xs={24} className="financeCards">
              <h3>Payment Report</h3>
              <BarChart labels={PayBarLabel} data1={PayBar1} data2={PayBar2} />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col lg={8} md={8} sm={24} xs={24}>
              <PieChart labels={PayPieLabel} data={PayPie} />
            </Col>

            <Col lg={8} md={8} sm={24} xs={24}>
              <DoughnutChart
                title={"Referer Report"}
                data={PayRef}
                labels={PayRefLabel}
              />
            </Col>
            <Col lg={8} md={8} sm={24} xs={24}>
              <DoughnutChart
                title={"Requestor Report"}
                data={PayReq}
                labels={PayReqLabel}
              />
            </Col>
          </Row>

          <Row style={{ marginTop: "20px" }}>
            <div className="tableisRes financeCards">
              <h3>Total Collection</h3>
              <Table
                className="tableWidth"
                columns={columns}
                dataSource={PayTable}
              ></Table>
            </div>
          </Row>
        </div>
      )}
    </FinanceDashbordContainer>
  );
};
export default Index;

const FinanceDashbordContainer = styled.div`
  .financeCards {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 2px 22px 0 rgba(31, 38, 135, 0.1);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border-radius: 7px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    margin-bottom: 20px;
    padding: 5px 8px;
    width: 100%;
    height: 100%;
    h3 {
      border-bottom: 1px solid #c6c6cb;
    }
  }
`;
