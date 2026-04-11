import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const Home = () => {

    const [File, setFile] = React.useState("")
    const [result, setresult] = React.useState(null)
    const [loading, setloading] = React.useState(false) 

    const navigate = useNavigate()

    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        setFile(e.target.files[0])
        setloading(true)
        console.log(file.name)


        const formdata = new FormData()
        formdata.append("file", file)

        try{
            const res=await axios.post("http://localhost:8000/parse-image",formdata)
            console.log(res.data)
             setloading(false)
             setresult(res.data)
             console.log(result)

        }
        catch(err){
            console.log(err)
            navigate("/error", { state: { message: "Failed to parse the prescription. Please try again." } })
             setloading(false)
        }
    }
  return (
    <div className='w-screen bg-green-50 h-screen flex gap-17 flex-col items-center overflow-y-scroll'>

       <header className='w-full h-23 bg-blue-950 flex items-center flex-row'>
         <div className='w-8 h-8 bg-green-600 m-4 border-1 rounded-md flex items-center justify-center'>

            <img className='w-4' src="./src/assets/med.svg" alt="" />
          

         </div>

           <h1 className='text-white text-2xl'>Prescripto<span className='text-green-600'>AI</span></h1>


       </header>


       <label  className='w-70 h-60 bg-blue-100 hover:bg-green-100 border-dashed rounded-xl border-1 md:w-120 flex flex-col items-center justify-center gap-3 cursor-pointer'>

            <div className='w-12 h-12 rounded-xl bg-white flex items-center justify-center'>
                <img src="./src/assets/micro.svg" alt="" />
            </div>

            <h1 className='text-xl'>Upload a Prescription</h1>
            <span className='text-gray-400  text-sm'>Supports JPG, PNG, JPEG MAX 5MB</span>

            <input type="file" placeholder="Choose Image" name='image' onChange={handleFileUpload} className='w-30 h-10  hidden'
             />


             <div className='border p-2 rounded-xl'>{File ? File.name : "choose image"}</div>


       </label>

       {loading  && File ?  
<div className="flex justify-center items-center">
  <div className="animate-spin rounded-full h-12 w-32 border-t-2 border-b-2 border-blue-900"></div>
</div>
:null }

{!loading && !File ? <div className='flex items center justify-center'>
    <h1 className='sm:text-2xl'>Turn Any Prescription Into <span className='text-green-400'>Structured Data</span>  instantly</h1>
</div>:null}

      {result && !loading? <section className='flex flex-col items-center justify-center gap-10 '>

        <div className='w-100 h-20 bg-blue-950 rounded-xl md:w-230 flex flex-row items-center justify-between'>
            <div className='flex flex-col items-center justify-center ml-2'>
                <h1 className='text-white'>Parsed Prescription</h1>
                <span className='text-gray-400 text-sm'>{File ? File.name : "No file selected"}</span>
            </div>

            

            <div className='flex justify-center items-center text-white bg-green-300  mr-3 rounded-md p-1'><h3>Extracted</h3></div>


            
        </div>

        <div  className='w-full h-8 flex items-center justify-between'>
            <h2 className='text-xl'>Name: {result?.patient_name}</h2>
            <h2 className='text-xl'>Age: {result?.patient_age}</h2>
        </div>

        <div className='w-full h-8 flex items-center'>
            <h2>Confidence Score: {result?.confidence_score?.toFixed(2)}</h2>
        </div>


        <div className='flex flex-row justify-between items center gap-3 w-full h-40'>
            <div className='bg-white w-1/2 h-auto rounded-xl flex flex-col '>
            <div className='w-full h-1/4 border-b border-b-gray-300'> <h2 className='text-blue-700 m-3 sm:text-xl font-extrabold'>CHIEF COMPLAINTS</h2></div>
             <div className='w-full h-3/4 border-b-gray-300 p-1 flex gap-2 flex-wrap '> 
             { result?.chief_complaints?.map((comp,ind)=>(
                <div key={ind} className='sm:w-20 mt-3 sm:h-13  w-15 h-8  bg-red-200 p-1 text-[9px]  text-red-700 sm:text-sm rounded-xl flex items-center justify-center'>
                    {comp}
                </div>
              ))
            }</div>
            </div>
             <div className='bg-white w-1/2 h-full rounded-xl flex flex-col '>
            <div className='w-full h-1/4 border-b border-b-gray-300'> <h2 className='text-blue-700 m-3 sm:text-xl font-extrabold'>DIAGNOSIS</h2></div>
             <div className='w-full h-3/4 border-b-gray-300 flex flex-wrap gap-2 p-1'> 
              { result?.diagnosis?.map((dia,ind)=>(
                <div key={ind} className='sm:w-25 mt-3 sm:h-13 bg-blue-200 p-2 w-16 h-8 text-[9px]   text-blue-900 sm:text-sm rounded-xl flex items-center justify-center'>
                    {dia}
                </div>
              ))
            }
             </div>
            </div>
        </div>


        <div className='w-full m-3 bg-white h-auto rounded-xl position-relative '>
            <div className='w-full h-1/4 border-b border-b-gray-300'> <h2 className='text-blue-700 m-3 sm:text-xl font-extrabold'>MEDICATIONS</h2></div>
             <div className='w-full h-3/4 border-b-gray-300 flex flex-col pt-2 pb-3 items-center gap-2'> 
             {result?.medications?.map((med,ind)=>(
                 <div key={ind} className='w-[80%] h-20 border-l-3 mt-3 bg-stone-50 rounded-xl flex flex-row items-center justify-between border-l-green-400'>
                    <div className='flex flex-col items-start justify-center p-1 ml-4'>
                        <div className='font-semibold text-blue-950'>{med.name}</div>
                        <div className='flex gap-3'>
                            <h2>{med.frequency}</h2>
                            <h2>{med.duration}</h2>
                        </div>

                    </div>
                  {med.dosage &&  <div className='flex items-center justify-center p-1 mr-4 w-18 rounded-xl bg-green-200 text-green-700'>{med.dosage}</div>}


                 </div>
                
             ))}
            
             </div>

        </div>

          <div className='flex flex-row justify-between items center gap-3 w-full h-40'>
            <div className='bg-white w-1/2 h-full rounded-xl flex flex-col '>
            <div className='w-full h-1/4 border-b border-b-gray-300'> <h2 className='text-blue-700 m-3 sm:text-xl font-extrabold'>LAB TESTS</h2></div>
             <div className='w-full h-3/4 border-b-gray-300 flex flex-wrap flex-row gap-2'> 
                { result?.lab_tests?.map((lab,ind)=>(
                    <div key={ind} className='w-18 mt-3 h-9 bg-purple-200 p-2  text-purple-900 text-sm rounded-xl'>
                        {lab}
                    </div>
                    
                ))}
             </div>
            </div>
             <div className='bg-white w-1/2 h-full rounded-xl flex flex-col '>
            <div className='w-full h-1/4 border-b border-b-gray-300'> <h2 className='text-blue-700 m-3 sm:text-xl font-extrabold'>RADIOLOGY TESTS</h2></div>
             <div className='w-full h-3/4 border-b-gray-300 flex flex-wrap gap-2'> 
                { result?.radiology_tests?.map((rad,ind)=>(
                    <div key={ind} className='w-18 mt-3 h-9 bg-yellow-200 p-2  text-yellow-900 text-sm rounded-xl'>
                        {rad}
                    </div>
                ))}
             </div>
            </div>
        </div>

        {result?.advice?.length>0 ? 
        <div className='flex flex-col items-start justify-center w-full h-auto bg-white rounded-xl p-3'>

            <h1 className='mb-3'>ADVICE</h1>
          { result?.advice?.map((adv,ind)=>(
                <div key={ind} className='w-full h-auto bg-green-50 rounded-xl p-2 mb-2 text-green-900'>
                    {adv}
                </div>
            ))
        }
            


        </div>
        :null}

    
       </section> : null
}


      
    </div>
  )
}

export default Home
