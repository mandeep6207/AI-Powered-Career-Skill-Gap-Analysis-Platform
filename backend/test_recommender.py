import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from utils.recommender import analyze, ROLE_SKILLS

def test_data_scientist_match():
    """Test matching for Data Scientist role"""
    result = analyze('Data Scientist', ['Python', 'SQL', 'Statistics'], 'Intermediate', 10)
    assert result['match_percentage'] > 0
    assert 'Python' in result['found_skills']
    assert len(result['missing_skills']) > 0
    print('✓ test_data_scientist_match passed')

def test_perfect_match():
    """Test perfect skill match with all required skills"""
    skills = ROLE_SKILLS['Data Scientist']
    result = analyze('Data Scientist', skills, 'Advanced', 20)
    assert result['match_percentage'] >= 85  # High match with all skills
    assert len(result['missing_skills']) == 0
    print('✓ test_perfect_match passed')

def test_no_match():
    """Test zero skill match"""
    result = analyze('Data Scientist', ['Cooking', 'Gardening'], 'Beginner', 5)
    assert result['match_percentage'] < 10
    assert len(result['missing_skills']) > 0
    print('✓ test_no_match passed')

def test_proficiency_boost():
    """Test that advanced proficiency boosts match score"""
    skills = ['Python']
    beginner_result = analyze('Data Scientist', skills, 'Beginner', 5)
    advanced_result = analyze('Data Scientist', skills, 'Advanced', 5)
    assert advanced_result['match_percentage'] > beginner_result['match_percentage']
    print('✓ test_proficiency_boost passed')

def test_hours_factor():
    """Test that more study hours reduce estimated weeks"""
    skills = ['React']
    low_hours = analyze('Web Developer', skills, 'Intermediate', 5)
    high_hours = analyze('Web Developer', skills, 'Intermediate', 20)
    assert high_hours['estimated_weeks'] < low_hours['estimated_weeks']
    print('✓ test_hours_factor passed')

if __name__ == '__main__':
    test_data_scientist_match()
    test_perfect_match()
    test_no_match()
    test_proficiency_boost()
    test_hours_factor()
    print('\n✓ All tests passed!')
