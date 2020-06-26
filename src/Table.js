import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form } from 'antd';
import { Chart } from "react-google-charts";
import './Table.css'
import 'antd/dist/antd.css';
import moment from 'moment';

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async e => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
      
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: false,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          padding: 24,
          
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const EditableTable = props => {
    const [ChartData,setChartData]=useState()

    const labels =  [
        { type: 'string', id: 'Room' },
        { type: 'string', id: 'Name' },
        { type: 'date', id: 'Start' },
        { type: 'date', id: 'End' },
      ]

    const columnss= [
        {
          title: 'Task Title',
          dataIndex: 'tasktitle',
          width: '10%',
          editable: true,
        },
        {
          title: 'Comment',
          dataIndex: 'comment',
          editable: true,
          width: '30%',
        },
        {
          title: 'Operators Name',
          dataIndex: 'NameOp',
          editable: true,
        },
        {
            title: 'Start Time',
            dataIndex: 'StartHour',
            editable: true,
            
            
          },
          {
            title: 'End Time',
            dataIndex: 'EndHour',
            editable: true,
            
          },
          {
            title: 'Initial Duration',
            dataIndex: 'duration',
          },
          {
            title: 'ECRS',
            dataIndex: 'Ecrs',
            editable: true,
          },
          {
            title: 'Improvement Idea',
            dataIndex: 'Improvement Idea',
            editable: true,
            width:'30%'
          },
        {
          title: 'Eliminate ?',
          dataIndex: 'operation',
          render: (text, record) =>
            props.DataSource.length >= 1 ? (
              <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                <a>Eliminate</a>
              </Popconfirm>
            ) : null,
        },
      ];


 const handleDelete = (key) => {
    const dataSource = [...props.DataSource];
    props.setDataSource(
      dataSource.filter(item => item.key !== key),
    );
    const NewDatadelete = dataSource.filter(item => item.key !== key)
    newchart(NewDatadelete)
      
  };

  let j = 100;

 const handleAdd = () => {

    const { dataSource } = props.DataSource;
    const newData = {
      'key':j,
      'EndHour':props.DataSource[0].EndHour,
      'NameOp': '' ,
      'SessionNumber': '',
      'StartHour':props.DataSource[0].StartHour,
      'comment':'',
      'duration':'',
      'tasktitle':'',
      'Ecrs': '',
      'Improvement Idea': '',
    };
    props.setDataSource(
       [...props.DataSource, newData]
    );
    j+=1
  };

 const handleSave = row => {
    const newData = [...props.DataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    props.setDataSource(newData)
    newchart(newData)

       
    }
  
    
    const { dataSource } = props.DataSource;
    
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
   const newchart = (newData) => {
    let RawData= []
    let Data2 = []
        newData.map(obj=>{
            Object.keys(obj).map((key)=>{
            RawData.push(obj[key])
            
            })
            const H1 = parseInt(RawData[4].substring(0,2))
            const M1 = parseInt(RawData[4].substring(3,5))
            const H2 = parseInt(RawData[1].substring(0,2))
            const M2 = parseInt(RawData[1].substring(3,5))

            
            if(isNaN(H1)){
              Data2.push([RawData[2],RawData[7],0,0])}
            else { Data2.push([RawData[2],RawData[7],new Date(0,0,0,H1,M1,0),new Date(0,0,0,H2,M2,0)])}
            RawData=[]
            
        });
        
        setChartData([labels,...Data2])
        
      }


    const columns = columnss.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: handleSave,
        }),
      };
    });
    
    return (
      <div>
          <div style={{position: '-webkit-sticky',
position: 'sticky',
top: 0,
backgroundColor:'white',
marginBottom:15,
zIndex:6}}>
  <text>Gantt After</text>
            {ChartData!==undefined && <Chart
              width={'100%'}
              height={'100px'}
              chartType="Timeline"
              loader={<div>Loading Chart</div>}
              data={ChartData}
              options={{
                height: 300,
                gantt: {
                  defaultStartDateMillis: new Date(2020, 3, 28),
                },
              }}
              rootProps={{ 'data-testid': '5' }}
            /> }

          {ChartData===undefined && props.SessionNumber.toString().length === 5 && <Chart
              width={'100%'}
              height={'200px'}
              chartType="Timeline"
              loader={<div>Loading Chart</div>}
              data={props.PrevData}
              options={{
                height: 200,
                gantt: {
                  defaultStartDateMillis: new Date(2020, 3, 28),
                },
              }}
              rootProps={{ 'data-testid': '5' }}
            /> }
          </div>
          <div style = {{marginTop:50}}>

            <Table
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              dataSource={props.DataSource}
              columns={columns}
            />
                        <Button
              onClick={handleAdd}
              type="primary"
              style={{
                marginBottom: 16,
              }}
            >
              Add a Task
            </Button>
          </div>



      </div>

    );
  
        }

export default EditableTable;