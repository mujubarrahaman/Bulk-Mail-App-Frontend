import { use, useState } from 'react'
import './App.css'
import axios from 'axios';
import * as XLSX from "xlsx";
import btn from './assets/arrow_icon.png'
import right from './assets/right_img.png'

function App() {
  const [msg, setMsg] = useState("")
  const [status, setStatus] = useState(false)
  const [emailList,setEmailList] = useState([])

  function handleFile(event) {
    const file = event.target.files[0]

    const reader = new FileReader()
    reader.onload = function (event) {
      const data = event.target.result
      const workBook = XLSX.read(data, { type: "binary" })
      const sheetName = workBook.SheetNames[0]
      const workSheet = workBook.Sheets[sheetName]
      const emailList = XLSX.utils.sheet_to_json(workSheet, { header: 'A' })
      console.log(emailList);
      const totalemail = emailList.map(function(item){return item.A})
      console.log(totalemail)
      setEmailList(totalemail)
    }

    reader.readAsBinaryString(file)

}

function handleMsg(evt) {
  setMsg(evt.target.value)
}

function send() {
  setStatus(true)
  axios.post("https://bulk-mail-app-backend.onrender.com/sendemail", { msg: msg, emailList: emailList })

    .then(function (data) {
      if (data.data === true) {
        alert("Email sent successfully")
        setStatus(false)
      }
      else {
        alert("Failed")
      }
    })
}

return (

<div className="contact-container">

<div className="contact-left">
  <div className="contact-left-title">
    <h1>Bulk Mail</h1>
    <hr />
  </div>
  <p >We can help your business with sending multiple emails at once !!</p>
  <h3>Drag and Drop📁</h3>
  <textarea onChange={handleMsg} value={msg} name="" id="" placeholder="Enter the Email text...📝" class="contact-inputs"></textarea>
  <input onChange={handleFile} class="file" type="file"/>
 
  <h3 className='count'>Total Email in the file: {emailList.length}</h3>
  <button onClick={send}>{status ? "sending" : "send"} <img src={btn} alt="" /></button>
</div>

<div className="contact-right">
    <img src={right} alt="" />
</div>

</div>
)
}

export default App
