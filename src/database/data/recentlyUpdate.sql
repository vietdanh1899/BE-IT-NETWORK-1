CREATE OR ALTER TRIGGER trigger_recently
ON [dbo].[job_recently]
FOR UPDATE, INSERT
AS 
BEGIN
DECLARE @jobId varchar(256)
DECLARE @userId varchar(256)
DECLARE @rating int
SELECT @userId = inserted.userId FROM inserted
SELECT @jobId = inserted.jobId FROM inserted
BEGIN
BEGIN TRY 
	BEGIN
		IF (EXISTS(SELECT TOP 1 id from [dbo].[user_rating] where userId = @userId AND jobId = @jobId))
		BEGIN
			UPDATE [dbo].[user_rating] set rating = rating+1 where userId = @userId AND jobId = @jobId
		END
		ELSE 
		BEGIN
			INSERT INTO [dbo].[user_rating](userId, jobId, rating) values (@userId, @jobId, 2)
		END
	END 
END TRY
BEGIN CATCH
 PRINT N'ROLL BACK.';  
ROLLBACK TRANSACTION
END CATCH
END
END