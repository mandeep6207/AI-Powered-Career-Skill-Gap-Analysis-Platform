import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './RoleComparison.css';

const ROLES = ['Data Scientist', 'AI Engineer', 'Web Developer', 'Cybersecurity Analyst'];
const ROLE_COLORS = {
  'Data Scientist': '#3498db',
  'AI Engineer': '#9b59b6',
  'Web Developer': '#e74c3c',
  'Cybersecurity Analyst': '#f39c12'
};

const RoleComparison = () => {
  const [selectedRoles, setSelectedRoles] = useState(['Data Scientist', 'Web Developer']);
  const [comparisons, setComparisons] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const response = await api.get('/profile');
        setUserSkills(response.data.current_skills ? response.data.current_skills.split(',') : []);
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };
    loadUserProfile();
  }, []);

  const handleRoleToggle = (role) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const generateComparison = async () => {
    setLoading(true);
    try {
      const skillsStr = userSkills.join(',');
      const results = await Promise.all(
        selectedRoles.map(role =>
          api.post('/analyze', {
            target_role: role,
            current_skills: skillsStr,
            proficiency: 'Intermediate',
            weekly_hours: 10
          })
        )
      );
      
      setComparisons(results.map((r, idx) => ({
        role: selectedRoles[idx],
        ...r.data
      })));
    } catch (error) {
      console.error('Comparison failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="role-comparison-container">
      <h2>Compare Target Roles</h2>
      
      <div className="role-selector">
        <p>Select roles to compare:</p>
        <div className="role-buttons">
          {ROLES.map(role => (
            <button
              key={role}
              className={`role-btn ${selectedRoles.includes(role) ? 'active' : ''}`}
              style={{ 
                borderColor: ROLE_COLORS[role],
                color: selectedRoles.includes(role) ? '#fff' : ROLE_COLORS[role],
                backgroundColor: selectedRoles.includes(role) ? ROLE_COLORS[role] : 'transparent'
              }}
              onClick={() => handleRoleToggle(role)}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <button 
        className="compare-btn" 
        onClick={generateComparison}
        disabled={loading || selectedRoles.length === 0}
      >
        {loading ? 'Comparing...' : 'Generate Comparison'}
      </button>

      <div className="comparison-results">
        {comparisons.map((comp, idx) => (
          <div 
            key={idx} 
            className="comparison-card"
            style={{ borderTopColor: ROLE_COLORS[comp.role] }}
          >
            <h3>{comp.role}</h3>
            <div className="comparison-metric">
              <span>Match Score:</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${comp.match_percentage}%`,
                    backgroundColor: ROLE_COLORS[comp.role]
                  }}
                />
              </div>
              <span className="metric-value">{comp.match_percentage}%</span>
            </div>
            <div className="comparison-metric">
              <span>Skills to Learn:</span>
              <span className="metric-value">{comp.missing_skills.length}</span>
            </div>
            <div className="comparison-metric">
              <span>Estimated Weeks:</span>
              <span className="metric-value">{comp.estimated_weeks}</span>
            </div>
            <div className="missing-skills-preview">
              <strong>Top Skills to Learn:</strong>
              <ul>
                {comp.missing_skills.slice(0, 3).map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleComparison;
