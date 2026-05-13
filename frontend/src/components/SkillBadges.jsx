import React from 'react';
import './SkillBadges.css';

const PROFICIENCY_COLORS = {
  'Beginner': '#3498db',
  'Intermediate': '#f39c12',
  'Advanced': '#2ecc71'
};

const SkillBadges = ({ skills, proficiencies = {} }) => {
  return (
    <div className="skill-badges-container">
      {skills.map((skill, idx) => {
        const proficiency = proficiencies[skill] || 'Beginner';
        const color = PROFICIENCY_COLORS[proficiency];
        return (
          <div key={idx} className="skill-badge" style={{ borderColor: color, backgroundColor: `${color}20` }}>
            <span className="skill-name">{skill}</span>
            <span className="proficiency-indicator" style={{ backgroundColor: color }}>
              {proficiency.charAt(0)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SkillBadges;
