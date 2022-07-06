import { createContext, useState, useEffect } from "react";


const FeedbackContext = createContext()

export const FeedbackProvider = ({children}) => {
        const [feedback, setFeedback] = useState([])

        const [feedbackEdit, setFeedbackEdit] = useState({
            item: {},
            edit: false
        })
        
        const deleteFeedback = async (id) => {
            if (window.confirm('Are you sure you want to delete?')) {
              await fetch(`/feedback/${id}`, {method: 'DELETE'})  
              setFeedback(feedback.filter((item) => item.id !== id))
            }
        }

        // update feedback item
          // Update feedback item
        const updateFeedback = async (id, updItem) => {
            const response = await fetch(`/feedback/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'

                },
                body: JSON.stringify(updItem),
            })

            const data = await response.json()
            setFeedback(
            feedback.map((item) => (item.id === id ? { ...item, ...data } : item))
            )
        }
        // set item to be updated
        const editFeedback = (item) => {
            setFeedbackEdit({
                item,
                edit: true
            })
        }

        useEffect(() => {
            fetchFeedback()
        }, [])

        const fetchFeedback = async () => {
            const response = await fetch(`/feedback?sort=id&order=desc`)
            const data = await response.json()
            setFeedback(data)
        }

        const addFeedback = async (newFeedback) => {
            const response = await fetch('/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'

                },
                body: JSON.stringify(newFeedback),
            })

            const data = await response.json()
            setFeedback([ ...feedback, data])
          }

        return <FeedbackContext.Provider value={{
            feedback,
            feedbackEdit,
            deleteFeedback,
            addFeedback,
            editFeedback,
            updateFeedback            
        }}>
        {children}
    </FeedbackContext.Provider>
}

export default FeedbackContext