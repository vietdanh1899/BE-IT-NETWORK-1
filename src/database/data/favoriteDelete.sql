CREATE OR ALTER TRIGGER trigger_favorite_delete
ON [dbo].[job_favorite]
FOR DELETE 
AS 
BEGIN
DECLARE @jobId varchar(256)
DECLARE @userId varchar(256)
DECLARE @rating int
SELECT @userId = deleted.userId FROM deleted
SELECT @jobId = deleted.jobId FROM deleted
BEGIN
BEGIN TRY 
	BEGIN TRANSACTION
		IF EXISTS (SELECT TOP 1 ID FROM [dbo].[user_rating] where userId = @userId and jobId = @jobId)
		BEGIN
			UPDATE [dbo].[user_rating] SET rating = 1 where userId = @userId and jobId = @jobId
		END
	COMMIT
END TRY
BEGIN CATCH
ROLLBACK TRANSACTION
END CATCH
END
END
