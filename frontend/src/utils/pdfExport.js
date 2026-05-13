// PDF export utility using canvas + html2canvas approach

export const generateAssessmentPDF = async (assessment, jsPDF, html2canvas) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 800;
  canvas.height = 600;
  
  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Title
  ctx.fillStyle = '#333333';
  ctx.font = 'bold 24px Arial';
  ctx.fillText('Skill Gap Analysis Report', 50, 50);
  
  // Date
  ctx.font = '12px Arial';
  ctx.fillStyle = '#666666';
  const date = new Date(assessment.date).toLocaleDateString();
  ctx.fillText(`Generated: ${date}`, 50, 80);
  
  // Role
  ctx.font = 'bold 14px Arial';
  ctx.fillStyle = '#333333';
  ctx.fillText(`Target Role: ${assessment.target_role}`, 50, 120);
  
  // Match score
  ctx.fillStyle = '#2ecc71';
  ctx.font = 'bold 16px Arial';
  ctx.fillText(`Match Score: ${assessment.match_score}%`, 50, 160);
  
  // Missing skills count
  ctx.fillStyle = '#e74c3c';
  ctx.font = '13px Arial';
  const missingCount = assessment.missing_skills.split(',').length;
  ctx.fillText(`Missing Skills: ${missingCount}`, 50, 190);
  
  // Missing skills list
  ctx.font = 'bold 12px Arial';
  ctx.fillStyle = '#333333';
  ctx.fillText('Skills to Learn:', 50, 230);
  
  const skills = assessment.missing_skills.split(',').filter(s => s.trim());
  let y = 260;
  ctx.font = '11px Arial';
  ctx.fillStyle = '#555555';
  for (let i = 0; i < Math.min(skills.length, 10); i++) {
    ctx.fillText(`• ${skills[i].trim()}`, 70, y);
    y += 20;
  }
  
  // Convert canvas to image
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  pdf.addImage(imgData, 'PNG', 10, 10, 190, 140);
  
  return pdf;
};

export const downloadAssessmentPDF = async (assessment, fileName = 'assessment.pdf') => {
  try {
    // Dynamic import for jsPDF (add to package.json: jspdf)
    const { jsPDF } = await import('jspdf');
    const pdf = await generateAssessmentPDF(assessment, jsPDF);
    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('PDF export failed:', error);
    return false;
  }
};

export const exportMultipleAssessmentsPDF = async (assessments) => {
  try {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    for (let i = 0; i < assessments.length; i++) {
      if (i > 0) pdf.addPage();
      
      const assessment = assessments[i];
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = 800;
      canvas.height = 500;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 18px Arial';
      ctx.fillText(`Assessment ${i + 1}`, 50, 40);
      
      ctx.font = '12px Arial';
      ctx.fillStyle = '#666666';
      ctx.fillText(`Role: ${assessment.target_role}`, 50, 70);
      ctx.fillText(`Match: ${assessment.match_score}%`, 50, 95);
      ctx.fillText(`Date: ${new Date(assessment.date).toLocaleDateString()}`, 50, 120);
      
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 110);
    }
    
    pdf.save('assessments-history.pdf');
    return true;
  } catch (error) {
    console.error('Multi-assessment PDF export failed:', error);
    return false;
  }
};
