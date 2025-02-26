import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography,
  styled,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// Styled components
const SearchBar = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius * 3,
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  overflow: 'hidden',
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 0,
    '& fieldset': {
      border: 'none',
    },
  },
  flex: 1,
  '& .MuiInputBase-input::placeholder': {
    color: theme.palette.text.primary,
    opacity: 1,
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: '0 20px 20px 0',
  color: theme.palette.common.white,
  height: '56px',
  padding: theme.spacing(1, 3),
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const AppointmentCounter = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(3),
  fontSize: '1.1rem',
}));

const HeadlineTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(2),
  fontSize: '2rem',
  color: theme.palette.common.black,
}));

const SearchSection = () => {
  const [treatmentAnchor, setTreatmentAnchor] = useState(null);
  const [locationAnchor, setLocationAnchor] = useState(null);
  const [dateAnchor, setDateAnchor] = useState(null);
  const [timeAnchor, setTimeAnchor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showClock, setShowClock] = useState(false);
  const [timeRange, setTimeRange] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Handlers for opening/closing menus
  const handleOpenTreatment = (event) => setTreatmentAnchor(event.currentTarget);
  const handleCloseTreatment = () => setTreatmentAnchor(null);
  
  const handleOpenLocation = (event) => setLocationAnchor(event.currentTarget);
  const handleCloseLocation = () => setLocationAnchor(null);
  
  const handleOpenDate = (event) => {
    setDateAnchor(event.currentTarget);
    setShowCalendar(true);
  };
  const handleCloseDate = () => {
    setDateAnchor(null);
    setShowCalendar(false);
  };

  const handleOpenTime = (event) => {
    setTimeAnchor(event.currentTarget);
    setShowClock(true);
  };
  const handleCloseTime = () => {
    setTimeAnchor(null);
    setShowClock(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
  };

  const timeOptions = [
    '12:00 AM', '12:30 AM', '1:00 AM', '1:30 AM', '2:00 AM', '2:30 AM', '3:00 AM', '3:30 AM', '4:00 AM', '4:30 AM', '5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM',
  ];

  return (
    <Container>
      <HeadlineTypography variant="h3">
        Book Local Beauty Services with Ease!
      </HeadlineTypography>

      <SearchBar elevation={2}>
        {/* Treatment & Venues */}
        <SearchField
          placeholder="All Treatments & Venues"
          onClick={handleOpenTreatment}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        {/* Location */}
        <SearchField
          placeholder="Current Location"
          onClick={handleOpenLocation}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        {/* Date */}
        <SearchField
          placeholder="Any Date"
          onClick={handleOpenDate}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarTodayIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        {/* Time */}
        <SearchField
          placeholder="Any Time"
          onClick={handleOpenTime}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccessTimeIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        {/* Search Button */}
        <SearchButton variant="contained">
          Search
        </SearchButton>
      </SearchBar>

      {/* Treatment Menu */}
      <Menu
        anchorEl={treatmentAnchor}
        open={Boolean(treatmentAnchor)}
        onClose={handleCloseTreatment}
      >
        <MenuItem onClick={handleCloseTreatment}>Hair Services</MenuItem>
        <MenuItem onClick={handleCloseTreatment}>Nail Services</MenuItem>
        <MenuItem onClick={handleCloseTreatment}>Facials</MenuItem>
        <MenuItem onClick={handleCloseTreatment}>Massages</MenuItem>
        <MenuItem onClick={handleCloseTreatment}>All Services</MenuItem>
      </Menu>

      {/* Location Menu */}
      <Menu
        anchorEl={locationAnchor}
        open={Boolean(locationAnchor)}
        onClose={handleCloseLocation}
      >
        <MenuItem onClick={handleCloseLocation}>Current Location</MenuItem>
        <MenuItem onClick={handleCloseLocation}>Enter Address</MenuItem>
        <MenuItem onClick={handleCloseLocation}>Search by Area</MenuItem>
      </Menu>

      {/* Date Menu */}
      <Menu
        anchorEl={dateAnchor}
        open={Boolean(dateAnchor)}
        onClose={handleCloseDate}
      >
        {showCalendar ? (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ width: 300 }}>
              <DateCalendar
                value={selectedDate}
                onChange={handleDateChange}
              />
            </Box>
          </LocalizationProvider>
        ) : null}
      </Menu>

      {/* Time Menu */}
      <Menu
        anchorEl={timeAnchor}
        open={Boolean(timeAnchor)}
        onClose={handleCloseTime}
      >
        {showClock ? (
          <Box sx={{ width: 250, textAlign: 'center' }}>
            <FormControl sx={{width : 230, textAlign: 'center' }}>
              <InputLabel id="time-range-label">Time Range</InputLabel>
              <Select
                labelId="time-range-label"
                id="time-range"
                value={timeRange}
                label="Time Range"
                onChange={handleTimeRangeChange}
              >
                <MenuItem value="morning">Morning</MenuItem>
                <MenuItem value="afternoon">Afternoon</MenuItem>
                <MenuItem value="evening">Evening</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">From:</Typography>
              <FormControl  sx={{width : 230, textAlign: 'center' }}>
                <InputLabel id="start-time-label">Start Time</InputLabel>
                <Select
                  labelId="start-time-label"
                  id="start-time"
                  value={startTime}
                  label="Start Time"
                  onChange={handleStartTimeChange}
                >
                  {timeOptions.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>To:</Typography>
              <FormControl  sx={{width : 230, textAlign: 'center' }}>
                <InputLabel id="end-time-label">End Time</InputLabel>
                <Select
                  labelId="end-time-label"
                  id="end-time"
                  value={endTime}
                  label="End Time"
                  onChange={handleEndTimeChange}
                >
                  {timeOptions.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        ) : null}
      </Menu>

      <AppointmentCounter variant="subtitle1">
        530,856 appointments booked
      </AppointmentCounter>
    </Container>
  );
};

export default SearchSection;