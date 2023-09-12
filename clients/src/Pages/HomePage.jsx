import moment from "moment";
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, message, Table, DatePicker } from "antd";
import {UnorderedListOutlined,  AreaChartOutlined} from "@ant-design/icons"
import Layout from "../components/Layout/Layout";
import axios from "axios";
import Spinner from "../components/Layout/Spinner";
import Analytics from "../components/Layout/Analytics";
const { RangePicker } = DatePicker;


const HomePage = () => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allTransaction, setAllTransaction] = useState([]);
    const [frequency, setFrequency] = useState("7");
    const [selectedDate, setSelectedDate] = useState([]);
    const [type, setType] = useState("all");
    const [viewData,setViewData]=useState("table");


    //table data
    const columns = [
        {
            title: "Date",
            dataIndex: "date",
            render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>
        },
        {
            title: "Amount",
            dataIndex: "amount"
        },
        {
            title: "Type",
            dataIndex: "type"
        },
        {
            title: "Category",
            dataIndex: "category"
        },
        {
            title: "Reference",
            dataIndex: "reference"
        },
        {
            title: "Actions",

        },
    ]



    //useEffect hook
    useEffect(() => {
        //get all transactions
        const getAllTransactions = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                setLoading(true);
                const res = await axios.post("/transactions/get-transaction", {
                    userid: user._id,
                    frequency,
                    selectedDate,
                    type
                });
                setLoading(false);
                setAllTransaction(res.data);
                console.log(res.data);

            } catch (error) {
                console.log(error);
                message.error("fetch issue with transaction");
            }
        };
        getAllTransactions();


    }, [frequency, selectedDate,type])

    //form handling
    const handleSubmit = async (values) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            setLoading(true)
            await axios.post("/transactions/add-transaction", { ...values, userid: user._id })
            setLoading(false)
            message.success("transaction added successfully");
            setShowModal(false);

        } catch (error) {
            setLoading(false);
            message.error("failed to add transaction")
        }
    }
    return (
        <Layout>
            {loading && <Spinner />}
            <div className="filters">
                <div>
                    <h6>Select Frequency</h6>
                    <Select value={frequency} onChange={(values) => setFrequency(values)}>
                        <Select.Option value="7">LAST 1 week</Select.Option>
                        <Select.Option value="30">LAST 1 month</Select.Option>
                        <Select.Option value="365">LAST 1 year</Select.Option>
                        <Select.Option value="custom">custom</Select.Option>
                    </Select>
                    {frequency === "custom" && (<RangePicker value={selectedDate} onChange={(values) => setSelectedDate(values)} />
                   ) }
                </div>

                <div>
                    <h6>Select Type</h6>
                    <Select value={type} onChange={(values) => setType(values)}>
                        <Select.Option value="all">ALL</Select.Option>
                        <Select.Option value="income">INCOME</Select.Option>
                        <Select.Option value="expense">EXPENSE</Select.Option>
                        
                    </Select>
                    {frequency === "custom" && (<RangePicker value={selectedDate} onChange={(values) => setSelectedDate(values)} />
                   ) }
                </div>
                <div className="switch-icons">
                        <UnorderedListOutlined className={`mx-2 ${viewData==="table" ? "active-icon" : "inactive-icon" }`} onClick={()=>setViewData("table")}/>
                        <AreaChartOutlined className={`mx-2 ${viewData==="analytics" ? "active-icon" : "inactive-icon" }`} onClick={()=>setViewData("analytics")}/>
                    </div>
                <div>
                    
                    <button className="btn btn-primary"
                        onClick={() => setShowModal(true)} >Add New</button>
                </div>




                
            </div>
            <div className="content">
                {viewData==="table" ? <Table columns={columns} dataSource={allTransaction} />
                : <Analytics allTransaction={allTransaction}/>
                
            }
                
            </div>
            <Modal title="Add Transaction" open={showModal}
                onCancel={() => setShowModal(false)}
                footer={false} >
                <Form layout="vertical"
                    onFinish={handleSubmit} >
                    <Form.Item label="Amount" name="amount">
                        <Input type="text" />

                    </Form.Item>
                    <Form.Item label="type" name="type">
                        <Select>
                            <Select.Option value="income">Income</Select.Option>
                            <Select.Option value="expense">Expense</Select.Option>
                        </Select>

                    </Form.Item>

                    <Form.Item label="Category" name="category">
                        <Select>
                            <Select.Option value="salary">Salary</Select.Option>
                            <Select.Option value="tip">Tip</Select.Option>
                            <Select.Option value="project">Project</Select.Option>
                            <Select.Option value="food">Food</Select.Option>
                            <Select.Option value="movie">Movie</Select.Option>
                            <Select.Option value="bills">Bills</Select.Option>
                            <Select.Option value="medical">Medical</Select.Option>
                            <Select.Option value="fee">Fee</Select.Option>
                            <Select.Option value="tax">Tax</Select.Option>
                        </Select>

                    </Form.Item>
                    <Form.Item label="Date" name="date">
                        <Input type="date" />
                    </Form.Item>

                    <Form.Item label="Reference" name="reference">
                        <Input type="text" />
                    </Form.Item>

                    <Form.Item label="Description" name="description">
                        <Input type="text" />
                    </Form.Item>
                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary">SAVE</button>
                    </div>

                </Form>

            </Modal>
        </Layout>
    )
}

export default HomePage;
