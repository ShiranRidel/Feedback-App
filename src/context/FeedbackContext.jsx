import { createContext, useState,useEffect } from "react";

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
  const [isLoading,setIsLoding]=useState(true)
  const [feedback, setFeedback] = useState([])
  const [feedbackEdit, setFeedbackEdit]=useState({
    item:{},
    edit: false
  })

  useEffect(()=>{
    fetchFeedback()
  },[])

  // Fatch feedback data
  const fetchFeedback = async ()=>{
    const response = await fetch(`/feedback?_sort=id&_order=desc`)
    const data = await response.json()
    setFeedback(data)
    setIsLoding(false)
  }

// add feedback
  const addFeedback = async(newFeedback) => {
    const response= await fetch('/feedback',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(newFeedback)
    })

    const data = await response.json()
    setFeedback([data, ...feedback]);
  };
//delete feedback
  const deleteFeedback = async (id) => {
    if (window.confirm("Are you sure you want to delete? ")) {
      await fetch(`/feedback/${id}`,{method:'DELETE'})
        setFeedback(feedback.filter((item) => item.id !== id));
    }
  };

//update feedback item
const updateFeedback = async(id,updItem)=>{
  const response= await fetch(`/feedback/${id}`,{
    method:'PUT',
    headers:{
      'Content-Type':'application/json'
    },
    body: JSON.stringify(updItem)

  })
  const data = await response.json()
  // NOTE: no need to spread data and item
  setFeedback(feedback.map((item) => (item.id === id ? data : item)))

  // FIX: this fixes being able to add a feedback after editing
  setFeedbackEdit({
    item: {},
    edit: false,
  })
}

// set item to be updated
  const editFeedback = (item)=>{
    setFeedbackEdit({
      item,
      edit:true
    })
  }

  return (
    <FeedbackContext.Provider
      value={{
        feedback,
        feedbackEdit,//state that hold the item and the bool
        isLoading,
        //functions:
        deleteFeedback,
        addFeedback,
        editFeedback,
        updateFeedback,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export default FeedbackContext;
