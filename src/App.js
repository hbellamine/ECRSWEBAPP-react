import React,{useState,useEffect} from 'react';
import './App.css';
import { Chart } from "react-google-charts";
import axios from './axios-sessions'
import EditableTable from './Table'
import moment from 'moment'
import { Table, Input, Button, Popconfirm, Form } from 'antd';

const App =props => {

  const [SessionNumber,setSessionNumber]=useState('')
  const [Data,setData]=useState([])
  const [DataSource,setDataSource]= useState( [
    {
      key: '0',
      name: 'Edward King 0',
      age: '32',
      address: 'London, Park Lane no. 0',
    },

  ])


 

  
  let Dat= []
  let Dat1 = []
  let Dat2 = []
  let i = 0
  

  const labels =  [
    { type: 'string', id: 'Room' },
    { type: 'string', id: 'Name' },
    { type: 'date', id: 'Start' },
    { type: 'date', id: 'End' },
  ]

  const handleChange = (event) =>{
    setSessionNumber(event.target.value)
  }

  const handleSubmit = (event) => {
    setSessionNumber(event.target.value)
    event.preventDefault();
  }

  useEffect(() => {
    axios.get('https://ecrs-bbfdf.firebaseio.com/'+SessionNumber+'/NewLaps.json').then(response => {
      //setData(response.data)
      
      response.data!==null && setDataSource(response.data)
      

      response.data!=null && response.data.map(obj=>{
        
        
        Object.keys(obj).map((key)=>{
          
          Dat.push(obj[key])
          
        })
        const H1 = (moment(Dat[3]).format('HH'))
        const M1 = (moment(Dat[3]).format('mm'))
        const S1 = (moment(Dat[3]).format('ss'))
        const H2 = (moment(Dat[0]).format('HH'))
        const M2 = (moment(Dat[0]).format('mm'))
        const S2 = (moment(Dat[0]).format('ss'))


        if(isNaN(H1)){
          Dat1.push([ Dat[1],Dat[6],Dat[3],Dat[0]]) }

          else { Dat1.push([ Dat[1],Dat[6],new Date(0,0,0,H1,M1,S1),new Date(0,0,0,H2,M2,S2)]) }
        i+=1
        let CurrentObject = {'key':i,
                              'EndHour':moment(obj['StartHour']+obj['duration']).format('HH:mm:ss'),
                              'NameOp': obj['NameOp'] ,
                              'SessionNumber': obj['SessionNumber'],
                              'StartHour':moment(obj['StartHour']).format('HH:mm:ss'),
                              'comment':obj['comment'],
                              'duration':moment(obj['duration']).format('HH:mm:ss'),
                              'tasktitle':obj['tasktitle'],
                              'Ecrs': '',
                              'Improvement Idea': '',}
        Dat2.push(CurrentObject)
        
        Dat=[]
        
      })
      Dat1.shift()
     
      
      setData([labels,...Dat1])
      Dat2.shift()
      setDataSource([...Dat2])
     
    })
  }, [SessionNumber]);



  const InitialTotalTime = () => {
    let startinghours = []
    let endinghours =[]
    const DataWithoutLabels = [...Data]

    DataWithoutLabels.shift()

    DataWithoutLabels.map(elem=>{
      startinghours.push(moment(elem[2]).diff(moment().startOf('second'), 'minutes'))
      endinghours.push(moment(elem[3]).diff(moment().startOf('second'), 'minutes'))
     
    })

    

     const starttime = Math.abs(Math.max(...startinghours))
    const endtime = Math.abs(Math.min(...endinghours))
    console.log(starttime)
    console.log(endtime)

    const timestamptotaltime = endtime - starttime

    return timestamptotaltime

  }
  
  
  
  return (

    <div style= {{margin:20}}>

    <form onSubmit={handleSubmit}>
      <label>
        Numéro de Session :
        <input type="number" value={SessionNumber} onChange={handleChange} />
      </label>
      {/* <input type="submit" value="Envoyer" /> */}
    </form>
    
    
    <div>
    <text style={{justifyContent:'center'}}>Initial Gantt</text>
    {SessionNumber !== undefined && SessionNumber.toString().length === 5  && 
       <text>Total time in minutes : {(InitialTotalTime())}</text>} 
    </div>
      <div style={{marginTop:50}}>
        
          {SessionNumber !== undefined && SessionNumber.toString().length === 5  &&  <Chart
            width={'100%'}
            height={'200px'}
            chartType="Timeline"
            loader={<div>Loading Chart</div>}
            data={Data}
            options={{
              height: 200,
              gantt: {
                defaultStartDateMillis: new Date(2020, 3, 28),
              },
            }}
            rootProps={{ 'data-testid': '5' }}
          /> }
      </div>
  <EditableTable SessionNumber = {SessionNumber} DataSource = {DataSource} setDataSource = {setDataSource} PrevData ={Data}  />
</div>
  );
  
  
}

export default App;
