import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

/**
 * Password Strength Indicator Component
 * Displays a progress bar showing password strength with real-time validation
 */
const PasswordStrengthIndicator = ({ password }) => {
  // Calculate password strength
  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'error', percentage: 0 };

    let score = 0;
    const criteria = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[@$!%*?&]/.test(pwd),
    };

    // Score calculation (each criterion is worth 20 points)
    if (criteria.length) score += 20;
    if (criteria.uppercase) score += 20;
    if (criteria.lowercase) score += 20;
    if (criteria.number) score += 20;
    if (criteria.special) score += 20;

    // Determine strength label and color
    let label = '';
    let color = 'error';
    
    if (score === 100) {
      label = 'Strong';
      color = 'success';
    } else if (score >= 80) {
      label = 'Good';
      color = 'info';
    } else if (score >= 60) {
      label = 'Fair';
      color = 'warning';
    } else if (score >= 40) {
      label = 'Weak';
      color = 'warning';
    } else if (score > 0) {
      label = 'Very Weak';
      color = 'error';
    }

    return { score, label, color, percentage: score, criteria };
  };

  const strength = calculateStrength(password);

  // Don't show anything if no password entered
  if (!password) return null;

  return (
    <Box sx={{ mt: 1, mb: 1 }}>
      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={strength.percentage}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            backgroundColor:
              strength.color === 'success'
                ? '#4caf50'
                : strength.color === 'info'
                ? '#2196f3'
                : strength.color === 'warning'
                ? '#ff9800'
                : '#f44336',
          },
        }}
      />

      {/* Strength Label */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
        <Typography
          variant="caption"
          sx={{
            color:
              strength.color === 'success'
                ? '#4caf50'
                : strength.color === 'info'
                ? '#2196f3'
                : strength.color === 'warning'
                ? '#ff9800'
                : '#f44336',
            fontWeight: 'bold',
          }}
        >
          {strength.label}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {strength.percentage}%
        </Typography>
      </Box>

      {/* Password Requirements Checklist */}
      <Box sx={{ mt: 1 }}>
        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mb: 0.5 }}>
          Password must contain:
        </Typography>
        <Box sx={{ pl: 1 }}>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: strength.criteria?.length ? '#4caf50' : 'text.secondary',
            }}
          >
            {strength.criteria?.length ? '✓' : '○'} At least 8 characters
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: strength.criteria?.uppercase ? '#4caf50' : 'text.secondary',
            }}
          >
            {strength.criteria?.uppercase ? '✓' : '○'} One uppercase letter (A-Z)
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: strength.criteria?.lowercase ? '#4caf50' : 'text.secondary',
            }}
          >
            {strength.criteria?.lowercase ? '✓' : '○'} One lowercase letter (a-z)
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: strength.criteria?.number ? '#4caf50' : 'text.secondary',
            }}
          >
            {strength.criteria?.number ? '✓' : '○'} One number (0-9)
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: strength.criteria?.special ? '#4caf50' : 'text.secondary',
            }}
          >
            {strength.criteria?.special ? '✓' : '○'} One special character (@$!%*?&)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PasswordStrengthIndicator;
