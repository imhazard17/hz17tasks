scheduleWorkDone contains unique id => (scheduleId, workId)

get that scheduleId's total no of works
calc of a schedule completion = count(scheduleId)/totalNoOfWorks

on a schedule's 100 completion: if any current streak running (null end date) then dont do nun;
but no streak running on that schedule then create a new streak with start date as prev date;

if schdule is not 100: put endDate == prev
streak unique key => scheduleId + startDate + endDate

streak schema => id, userId, scheduleId, startdate, endDate 

after creating streak data with scheduleWorkDone; truncate the table
