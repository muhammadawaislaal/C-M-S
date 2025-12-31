import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import assessmentsService from '../../services/assessmentsService'
import Button from '../../components/Button'

export default function AdminGradeSubmission(){
  const { submissionId } = useParams()
  const navigate = useNavigate()
  const [submission, setSubmission] = useState(null)
  const [answers, setAnswers] = useState([])

  useEffect(()=>{
    if(!submissionId) return
    assessmentsService.getSubmission(submissionId).then(res=>{
      setSubmission(res.submission)
      setAnswers(res.submission.answers.map(a=>({answer_id: a.id, points_awarded: a.points_awarded || 0, question_id: a.question_id, text: a.text_answer})))
    }).catch(err=>console.error(err))
  },[submissionId])

  function updatePoints(idx, val){
    const copy = [...answers]
    copy[idx].points_awarded = parseFloat(val) || 0
    setAnswers(copy)
  }

  function submitGrades(){
    assessmentsService.gradeSubmission(submission.id, answers).then(res=>{
      alert('Graded: ' + res.score)
      navigate('/admin/assessments')
    }).catch(err=>{console.error(err); alert('Error grading')})
  }

  if(!submission) return <div>Loading...</div>
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Grade Submission #{submission.id} (Student: {submission.student_id})</h2>
      <div className="mt-4 space-y-4">
        {answers.map((a, idx)=> (
          <div key={a.answer_id} className="p-3 border rounded">
            <div className="text-sm text-gray-700">Question ID: {a.question_id}</div>
            <div className="mt-2">{a.text || '— no text answer —'}</div>
            <div className="mt-2">
              <label className="mr-2">Points:</label>
              <input type="number" value={a.points_awarded} onChange={e=>updatePoints(idx, e.target.value)} className="border px-2 py-1 rounded" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Button onClick={submitGrades}>Submit Grades</Button>
      </div>
    </div>
  )
}
