import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing(){
  return (
    <div className="text-center py-5">
      <h1 className="display-4">SkillGap Navigator</h1>
      <p className="lead">Find the skills you need to reach your target role and get a study roadmap.</p>
      <p>
        <Link className="btn btn-primary btn-lg me-2" to="/signup">Get started</Link>
        <Link className="btn btn-outline-primary btn-lg" to="/login">Sign in</Link>
      </p>

      <section className="mt-5">
        <div className="row">
          <div className="col-md-4">
            <h5>Assess</h5>
            <p>Enter your current skills and get a gap analysis.</p>
          </div>
          <div className="col-md-4">
            <h5>Learn</h5>
            <p>Receive prioritized recommendations and timelines.</p>
          </div>
          <div className="col-md-4">
            <h5>Track</h5>
            <p>Monitor progress and history on a dashboard.</p>
          </div>
        </div>

        <div className="mt-5">
          <h4>What users say</h4>
          <div className="row">
            <div className="col-md-4">
              <blockquote className="blockquote">"Helped me focus my learning"<footer className="blockquote-footer">Jane Doe, Data Scientist</footer></blockquote>
            </div>
            <div className="col-md-4">
              <blockquote className="blockquote">"Clear roadmap and milestones"<footer className="blockquote-footer">John Smith, Web Developer</footer></blockquote>
            </div>
            <div className="col-md-4">
              <blockquote className="blockquote">"Easy to track progress week-by-week"<footer className="blockquote-footer">Alex Lee, AI Engineer</footer></blockquote>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
