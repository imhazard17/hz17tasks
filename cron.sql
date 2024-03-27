-- everyday at 00:00

FOR rec
IN (
    SELECT 
    table1.scheduleId as scheduleId, ((workDoneCount/totalWorkCount)*100) as completionPercent, table1.userId as userId
    FROM 
    (
        SELECT Schedule.id as scheduleId, t1.workDoneCount as workDoneCount, Schedule.userId as userId
        FROM Schedule
        INNER JOIN (
            SELECT scheduleId, count(*) as workDoneCount
            FROM ScheduleWorkDone
            GROUP BY scheduleId;
        ) AS t1
        ON Schedule.id = t1.scheduleId;
    ) AS table1
    INNER JOIN (
        SELECT Schedule.id, t2.totalWorkCount as totalWorkCount
        FROM Schedule
        INNER JOIN (
            SELECT scheduleId as scheduleId, count(*) as totalWorkCount
            FROM Work
            GROUP BY scheduleId;
        ) AS t2
        ON Schedule.id = t2.scheduleId;
    ) AS table2
    ON table1.scheduleId = table2.scheduleId;
)
LOOP
    CASE 
        WHEN rec.completionPercent = 100
        THEN (
            UPDATE Streak
            SET endDate = (SELECT CURRENT_DATE - 1)
            WHERE t.scheduleId = Streak.scheduleId;
        )

        WHEN rec.completionPercent < 100
        THEN (
            INSERT INTO Streak(startDate, scheduleId, userId)
            VALUES ((SELECT CURRENT_DATE - 1), rec.scheduleId, rec.userId);
        )
    END
END LOOP;

TRUNCATE ScheduleWorkDone;
